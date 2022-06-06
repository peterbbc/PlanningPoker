import React, { ReactNode } from 'react';
import cx from 'classnames';

import styles from './Badge.module.scss';

interface BadgeProps {
  style: 'success' | 'warning';
  children: ReactNode;
}

export const Badge = ({ style, children }: BadgeProps) => {
  return (
    <div className={cx(styles.badge, styles[`badge--${style}`])}>
      {children}
    </div>
  );
};
