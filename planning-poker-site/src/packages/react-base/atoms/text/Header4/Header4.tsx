import cx from 'classnames';
import React, { ReactNode } from 'react';

import styles from './Header4.module.scss';

interface Header4Props {
  children: ReactNode;
  align?: 'left' | 'center';
  color?: 'black' | 'primary' | 'white';
  className?: string;
}

export const Header4 = ({ children, className, ...props }: Header4Props) => {
  const align = props.align || 'left';
  const color = props.color || 'black';

  return (
    <h4
      className={cx(
        styles.header4,
        styles[`header4--${align}`],
        styles[`header4--${color}`],
        className,
      )}
    >
      {children}
    </h4>
  );
};
