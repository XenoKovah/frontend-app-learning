import PropTypes from 'prop-types';
import {
  CheckCircle as CheckCircleIcon,
  LmsCompletionSolid as LmsCompletionSolidIcon,
} from '@openedx/paragon/icons';

import { DashedCircleIcon } from '../icons';
import { HIDE_COMPLETION_UI } from '../../../../../../hide-completion-ui';

const CompletionIcon = ({ completionStat: { completed = 0, total = 0 } }) => {
  if (HIDE_COMPLETION_UI) { return null; } // OST2: keep completion invisible to learners
  const percentage = total !== 0 ? Math.min((completed / total) * 100, 100) : 0;
  const remainder = 100 - percentage;

  switch (true) {
    case !completed:
      return <LmsCompletionSolidIcon className="text-gray-300" data-testid="completion-solid-icon" />;
    case completed === total:
      return <CheckCircleIcon className="text-success" data-testid="check-circle-icon" />;
    default:
      return <DashedCircleIcon percentage={percentage} remainder={remainder} data-testid="dashed-circle-icon" />;
  }
};

CompletionIcon.propTypes = {
  completionStat: PropTypes.shape({
    completed: PropTypes.number,
    total: PropTypes.number,
  }).isRequired,
};

export default CompletionIcon;
