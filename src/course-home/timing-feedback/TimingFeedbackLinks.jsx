import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

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
        {entry.url ? <a href={entry.url} title={entry.title}>{entry.label}</a> : entry.label}
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

export default TimingFeedbackLinks;
