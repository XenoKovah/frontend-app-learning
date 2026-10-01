import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import thumbsUp from './lil-stranger-thumbs-up.png';

/**
 * Li'l Stranger giving a thumbs up, linked to the LMS hello page.
 *
 * Meant to sit inside a shrink-to-fit (inline-block) wrapper together with the certificate
 * heading: the image has width 0 + min-width `widthPercent`, so it contributes nothing to
 * the wrapper's intrinsic width and instead scales to a fraction of the heading text's width.
 */
const CertificateMascot = ({ widthPercent, centered }) => {
  const intl = useIntl();
  return (
    <a
      href={`${getConfig().LMS_BASE_URL}/lil-stranger/`}
      className="d-block mb-2 inline-link"
      data-testid="certificate-mascot-link"
    >
      <img
        src={thumbsUp}
        alt={intl.formatMessage({
          id: 'learning.certificateMascot.alt',
          defaultMessage: 'Li\'l Stranger giving a thumbs up',
          description: 'Alt text for the Li\'l Stranger thumbs-up image above the certificate-ready heading',
        })}
        data-testid="certificate-mascot"
        style={{
          display: 'block',
          width: 0,
          minWidth: `${widthPercent}%`,
          height: 'auto',
          margin: centered ? '0 auto' : 0,
        }}
      />
    </a>
  );
};

CertificateMascot.propTypes = {
  widthPercent: PropTypes.number,
  centered: PropTypes.bool,
};

CertificateMascot.defaultProps = {
  widthPercent: 100,
  centered: false,
};

export default CertificateMascot;
