import { useEffect, useState } from 'react';

import { getProgressTabData } from '../data/api';
import getMissingTimingFeedback from './utils';

// Fetches the progress data itself (the course home page does not load it) and reports the
// Timing Feedback subsections still missing. Failures just mean no nudge.
export default function useMissingTimingFeedback(courseId, enabled) {
  const [missing, setMissing] = useState([]);

  useEffect(() => {
    if (!enabled || !courseId) { return undefined; }
    let cancelled = false;
    getProgressTabData(courseId)
      .then(data => { if (!cancelled) { setMissing(getMissingTimingFeedback(data?.sectionScores)); } })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [courseId, enabled]);

  return missing;
}
