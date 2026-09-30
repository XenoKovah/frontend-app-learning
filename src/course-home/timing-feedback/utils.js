// OST2: detect Timing Feedback subsections a learner has not submitted.
//
// Works on the progress-tab `sectionScores` (camelCased). A Timing Feedback subsection holds a
// scored time-spent problem plus a 1-point "done" block, so the subsection total cannot tell
// "submitted" from "only clicked done". We therefore ignore 1-point entries (the done block) and
// call the subsection submitted when the remaining problem score is > 0.
// Caveat: a submission that scored 0 is indistinguishable from no submission here.

const TIMING_FEEDBACK = 'timing feedback';

const isTimingFeedback = (subsection) => (
  (subsection.assignmentType || '').trim().toLowerCase() === TIMING_FEEDBACK
);

const isSubmitted = (subsection) => {
  const scores = subsection.problemScores || [];
  const problems = scores.filter(score => score.possible > 1);
  if (problems.length === 0) {
    return (subsection.numPointsEarned || 0) > 0;
  }
  return problems.some(score => score.earned > 0);
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
