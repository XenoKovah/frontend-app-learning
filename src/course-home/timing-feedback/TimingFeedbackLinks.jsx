import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';

import lilStranger from './assets/lil-stranger.png';

export const TimingFeedbackNudgeText = () => (
  <FormattedMessage
    id="learning.timingFeedback.nudge"
    defaultMessage="BTW! We see you submitted some Timing Feedback; thanks for that! But it looks like we're missing a couple of entries for you. Could you submit these so we can use your data?"
    description="Shown next to a ready certificate when a learner submitted some, but not all, Timing Feedback"
  />
);

const TimingFeedbackLinks = ({ missing }) => (
  <>
    <FormattedMessage
      id="learning.timingFeedback.missing"
      defaultMessage="Missing"
      description="Label before the list of Timing Feedback sections the learner has not submitted"
    />
    {' '}
    {missing.map((entry, i) => (
      <span key={entry.label}>
        {entry.url ? <a className="inline-link" href={entry.url} title={entry.title}>{entry.label}</a> : entry.label}
        {i < missing.length - 1 ? ', ' : ''}
      </span>
    ))}
  </>
);

TimingFeedbackLinks.propTypes = {
  missing: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    title: PropTypes.string,
    url: PropTypes.string,
  })).isRequired,
};

// Mascot floated left so the text wraps around it when the column is narrow.
export const TimingFeedbackNudge = ({ missing, mascotWidth }) => {
  const intl = useIntl();
  return (
    <div className="clearfix">
      <a href={`${getConfig().LMS_BASE_URL}/lil-stranger/`} className="float-left mr-3 mb-1 inline-link" data-testid="lil-stranger-link">
        <img
          src={lilStranger}
          alt={intl.formatMessage({
            id: 'learning.timingFeedback.mascotAlt',
            defaultMessage: 'Li\'l Stranger whispering to you...',
            description: 'Alt text for the Li\'l Stranger mascot image next to the Timing Feedback nudge',
          })}
          style={{ width: mascotWidth, height: 'auto', display: 'block' }}
        />
      </a>
      <TimingFeedbackNudgeText />
      {' '}
      <TimingFeedbackLinks missing={missing} />
    </div>
  );
};

TimingFeedbackNudge.propTypes = {
  ...TimingFeedbackLinks.propTypes,
  mascotWidth: PropTypes.number,
};

TimingFeedbackNudge.defaultProps = {
  mascotWidth: 72,
};

export default TimingFeedbackLinks;
