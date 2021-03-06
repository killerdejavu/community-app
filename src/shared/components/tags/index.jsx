import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-themr';
import { Link } from 'utils/router';

import defaultTag from './default.scss';
import primaryDesignTag from './primaryDesign.scss';
import eventDesignTag from './eventDesign.scss';

/* TODO: Well, this is basically a copy/paste of generic button code.
 * We should just import and reuse that button. It will demand just some
 * corrections of the styles. */

/* Generic button, not wrapped by themr, but accepting theme property.
 * In most cases you will want to use some of the themable exports below
 * instead. */
export function GenericTag({
  children,
  enforceA,
  onClick,
  openNewTab,
  replace,
  theme,
  to,
}) {
  if (to) {
    return (
      <Link
        className={theme.tag}
        enforceA={enforceA}
        onClick={onClick}
        openNewTab={openNewTab}
        replace={replace}
        to={to}
      >{children}</Link>
    );
  }
  return (
    <a
      className={theme.tag}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >{children}</a>
  );
}

GenericTag.defaultProps = {
  children: null,
  enforceA: false,
  onClick: null,
  openNewTab: false,
  replace: false,
  to: null,
};

GenericTag.propTypes = {
  children: PT.node,
  enforceA: PT.bool,
  onClick: PT.func,
  openNewTab: PT.bool,
  replace: PT.bool,
  theme: PT.shape({
    tag: PT.string.isRequired,
  }).isRequired,
  to: PT.oneOfType([PT.object, PT.string]),
};

export const Tag =
  themr('Tag', defaultTag)(GenericTag);

export const PrimaryTag =
  themr('PrimaryTag', primaryDesignTag)(GenericTag);

export const EventTag =
  themr('EventTag', eventDesignTag)(GenericTag);

export default undefined;
