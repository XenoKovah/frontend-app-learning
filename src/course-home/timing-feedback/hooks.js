import { useEffect, useState } from 'react';

import { getProgressTabData } from '../data/api';
import getMissingTimingFeedback, { getMissingTimingFeedbackBeforeLastDone } from './utils';

// Fetches the progress data itself (the course home page does not load it) and reports the
// Timing Feedback subsections still missing. Failures just mean no nudge.
// The progress data honours staff "view as" (masquerade), so staff see the student's state.
function useProgressDerived(courseId, enabled, derive) {
  const [missing, setMissing] = useState([]);

  useEffect(() => {
    if (!enabled || !courseId) { return undefined; }
    let cancelled = false;
    getProgressTabData(courseId)
      .then(data => { if (!cancelled) { setMissing(derive(data?.sectionScores)); } })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [courseId, enabled]);

  return missing;
}

export default function useMissingTimingFeedback(courseId, enabled) {
  return useProgressDerived(courseId, enabled, getMissingTimingFeedback);
}

// Mid-class nudge: missing entries up to the learner's furthest checked "Mark as complete".
export function useMissingTimingFeedbackSoFar(courseId, enabled) {
  return useProgressDerived(courseId, enabled, getMissingTimingFeedbackBeforeLastDone);
}
