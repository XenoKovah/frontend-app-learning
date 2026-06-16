import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Locked as LockedIcon,
  Article as ArticleIcon,
  LmsBook as LmsBookIcon,
  LmsBookComplete as LmsBookCompleteIcon,
  LmsEditSquare as LmsEditSquareIcon,
  LmsEditSquareComplete as LmsEditSquareCompleteIcon,
  LmsVideocam as LmsVideocamIcon,
  LmsVideocamComplete as LmsVideocamCompleteIcon,
} from '@openedx/paragon/icons';

import { HIDE_COMPLETION_UI } from '../../../../../../hide-completion-ui';

export const UNIT_ICON_TYPES = {
  video: 'video',
  problem: 'problem',
  vertical: 'vertical',
  lock: 'lock',
  other: 'other',
};

const UnitIcon = ({ type, isCompleted, ...props }) => {
  // OST2: suppress completion styling/variants while completion UI is hidden from learners.
  const completed = HIDE_COMPLETION_UI ? false : isCompleted;
  const iconMap = {
    [UNIT_ICON_TYPES.video]: {
      default: LmsVideocamIcon,
      complete: LmsVideocamCompleteIcon,
    },
    [UNIT_ICON_TYPES.problem]: {
      default: LmsEditSquareIcon,
      complete: LmsEditSquareCompleteIcon,
    },
    [UNIT_ICON_TYPES.vertical]: ArticleIcon,
    [UNIT_ICON_TYPES.lock]: LockedIcon,
    [UNIT_ICON_TYPES.other]: {
      default: LmsBookIcon,
      complete: LmsBookCompleteIcon,
    },
  };

  let Icon = iconMap[type || UNIT_ICON_TYPES.other];

  if (typeof Icon === 'object') {
    Icon = iconMap[type || UNIT_ICON_TYPES.other]?.[completed ? 'complete' : 'default'];
  }

  return (
    <Icon {...props} className={classNames({ 'text-success': completed, 'text-gray-300': !completed })} />
  );
};

UnitIcon.propTypes = {
  type: PropTypes.oneOf(Object.keys(UNIT_ICON_TYPES)).isRequired,
  isCompleted: PropTypes.bool.isRequired,
};

export default UnitIcon;
