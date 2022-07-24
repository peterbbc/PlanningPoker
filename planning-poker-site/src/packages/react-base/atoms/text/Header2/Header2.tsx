import React, { ReactNode } from 'react';
import cx from 'classnames';

import styles from './Header2.module.scss';

interface Header2Props {
  children: ReactNode;
  isLight?: boolean;
}

export const Header2 = ({ children, isLight, align }: Header2Props) => (
  <h2 className={cx(styles.header2, isLight && styles['header2--light'])}>
    {children}
  </h2>
);
