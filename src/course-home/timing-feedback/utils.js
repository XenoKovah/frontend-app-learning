// OST2: detect Timing Feedback subsections a learner has not submitted.
//
// Works on the progress-tab `sectionScores` (camelCased). A Timing Feedback subsection holds a
// time-spent problem plus a 1-point "done" block. The problem's score is meaningless (its
// "correct" answer is 0h/0m only because the component type requires one), so "submitted" means
// the problem was ATTEMPTED, via the `attempted` flag the LMS exposes per problem score.
// We ignore 1-point entries (the done block). If an older LMS does not send `attempted`, fall
// back to "problem earned > 0", which misses submissions that scored 0.

const TIMING_FEEDBACK = 'timing feedback';

export const isTimingFeedback = (subsection) => (
  (subsection.assignmentType || '').trim().toLowerCase() === TIMING_FEEDBACK
);

export const isSubmitted = (subsection) => {
  const scores = subsection.problemScores || [];
  // Older sections also hold a 1-point "done" block; skip it when a bigger problem is present.
  const bigger = scores.filter(score => score.possible > 1);
  const problems = bigger.length > 0 ? bigger : scores;
  if (problems.length === 0) {
    return (subsection.numPointsEarned || 0) > 0;
  }
  return problems.some(score => (score.attempted !== undefined ? score.attempted : score.earned > 0));
};

// "Timing Feedback 05 - Policies" -> 5; falls back to the 1-based position.
const labelFor = (subsection, position) => {
  const match = /(\d+)/.exec(subsection.displayName || '');
  return match ? String(parseInt(match[1], 10)) : String(position);
};

/**
 * Returns the missing entries ({ label, title, url }) when the learner submitted some but not all
 * Timing Feedback subsections; otherwise an empty array.
 */
export default function getMissingTimingFeedback(sectionScores) {
  const all = (sectionScores || [])
    .flatMap(chapter => chapter.subsections || [])
    .filter(isTimingFeedback);
  const missing = all.filter(subsection => !isSubmitted(subsection));
  if (missing.length === 0 || missing.length === all.length) {
    return [];
  }
  return missing.map(subsection => ({
    label: labelFor(subsection, all.indexOf(subsection) + 1),
    title: subsection.displayName,
    url: subsection.url,
  }));
}

// A "Mark as complete" (done) block scores 1 when checked and 0 once unchecked; the progress API
// gives each score its block's jump_to URL, which carries the block type.
const DONE_BLOCK_URL = /type@done\+block@/;

export const hasCheckedDone = (subsection) => (subsection.problemScores || []).some(
  score => DONE_BLOCK_URL.test(score.url || '') && score.earned > 0,
);

/**
 * Mid-class variant (OST2 beta): the learner is still working through the course, so only list the
 * unsubmitted Timing Feedback entries at or before the furthest subsection in which they checked a
 * "Mark as complete". Unlike the certificate nudge this fires even when no entry has been submitted.
 */
export function getMissingTimingFeedbackBeforeLastDone(sectionScores) {
  const all = (sectionScores || []).flatMap(chapter => chapter.subsections || []);
  let lastDone = -1;
  all.forEach((subsection, index) => {
    if (hasCheckedDone(subsection)) { lastDone = index; }
  });
  const timing = all.filter(isTimingFeedback);
  return all
    .slice(0, lastDone + 1)
    .filter(subsection => isTimingFeedback(subsection) && !isSubmitted(subsection))
    .map(subsection => ({
      label: labelFor(subsection, timing.indexOf(subsection) + 1),
      title: subsection.displayName,
      url: subsection.url,
    }));
}
