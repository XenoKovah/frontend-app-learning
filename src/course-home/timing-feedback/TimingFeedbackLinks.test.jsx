import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render, screen } from '@testing-library/react';

import { TimingFeedbackNudge } from './TimingFeedbackLinks';

describe('TimingFeedbackNudge', () => {
  it('shows the mascot, the message and links to the missing sections', () => {
    render(
      <IntlProvider locale="en">
        <TimingFeedbackNudge missing={[{ label: '2', title: 'TF 02', url: '/a' }, { label: '4', title: 'TF 04', url: '/b' }]} />
      </IntlProvider>,
    );
    expect(screen.getByAltText("Li'l Stranger whispering to you...")).toBeInTheDocument();
    expect(screen.getByText(/BTW! We see you submitted some Timing Feedback/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('href', '/a');
    expect(screen.getByRole('link', { name: '4' })).toHaveAttribute('href', '/b');
  });
});
