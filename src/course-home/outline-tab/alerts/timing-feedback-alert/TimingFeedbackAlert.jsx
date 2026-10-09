import PropTypes from 'prop-types';
import { Alert } from '@openedx/paragon';

import { TimingFeedbackNudge } from '../../../timing-feedback/TimingFeedbackLinks';

const TimingFeedbackAlert = ({ payload }) => (
  <Alert variant="info">
    <div data-testid="timing-feedback-midclass-nudge">
      <TimingFeedbackNudge missing={payload.missing} mascotWidth={72} midClass />
    </div>
  </Alert>
);

TimingFeedbackAlert.propTypes = {
  payload: PropTypes.shape({
    missing: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      title: PropTypes.string,
      url: PropTypes.string,
    })).isRequired,
  }).isRequired,
};

export default TimingFeedbackAlert;
