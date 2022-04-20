import React, { ReactNode } from 'react';
import cx from 'classnames';

import styles from './Link.module.scss';
import { Link as GatsbyLink } from 'gatsby';

interface LinkProps {
  children: ReactNode;
  className?: string;
  /** A class to apply when this Link is active */
  activeClassName?: string;
  /** Inline styles for when this Link is active */
  activeStyle?: object;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Class the link as highlighted if there is a partial match via a the `to` being prefixed to the current url */
  partiallyActive?: boolean;
  /** Used to declare that this link replaces the current URL in history with the target */
  replace?: boolean;
  /** Used to pass state data to the linked page.
   * The linked page will have a `location` prop containing a nested `state` object structure containing the passed data.
   */
  state?: any;
  /** The URL you want to link to */
  to: string;
  target?: string;
  title?: string;
  tabIndex?: number;
}

export const Link = ({ children, className, ...props }: LinkProps) => {
  return (
    <GatsbyLink className={cx(styles.link, className)} {...props}>
      {children}
    </GatsbyLink>
  );
};
