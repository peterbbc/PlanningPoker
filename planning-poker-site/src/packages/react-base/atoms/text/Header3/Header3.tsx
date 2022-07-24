import React, { ReactNode } from 'react';
import cx from 'classnames';

import styles from './Header3.module.scss';

interface Header3Props {
  children: ReactNode;
  isLight?: boolean;
  id?: string;
}

export const Header3 = ({ children, isLight, id }: Header3Props) => (
  <h3
    id={id}
    className={cx(styles.header3, isLight && styles['header3--light'])}
  >
    {children}
  </h3>
);
