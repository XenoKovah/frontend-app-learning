import React, { useMemo } from 'react';
import { getConfig } from '@edx/frontend-platform';

import { useAlert } from '../../../../generic/user-messages';
import { useModel } from '../../../../generic/model-store';
import { useMissingTimingFeedbackSoFar } from '../../../timing-feedback/hooks';

const TimingFeedbackAlert = React.lazy(() => import('./TimingFeedbackAlert'));

// OST2: only boxes that set OST2_TIMING_FEEDBACK_MIDCLASS_NUDGE in MFE_CONFIG (beta, where Timing
// Feedback is mandatory) show this. MFE_CONFIG values may arrive as the string "true".
const isEnabled = () => {
  const value = getConfig().OST2_TIMING_FEEDBACK_MIDCLASS_NUDGE;
  return value === true || String(value).toLowerCase() === 'true';
};

function useTimingFeedbackAlert(courseId) {
  const { isEnrolled } = useModel('courseHomeMeta', courseId);

  const enabled = isEnabled() && !!isEnrolled;
  const missing = useMissingTimingFeedbackSoFar(courseId, enabled);
  const payload = useMemo(() => ({ missing }), [missing]);

  useAlert(enabled && missing.length > 0, {
    code: 'clientTimingFeedbackAlert',
    payload,
    topic: 'outline-course-alerts',
  });

  return { clientTimingFeedbackAlert: TimingFeedbackAlert };
}

export default useTimingFeedbackAlert;
