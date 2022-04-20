import React, { ReactNode } from 'react';

import styles from './Header1.module.scss';

interface Header1Props {
  children: ReactNode;
}

export const Header1 = ({ children }: Header1Props) => {
  return <h1 className={styles.header1}>{children}</h1>;
};
