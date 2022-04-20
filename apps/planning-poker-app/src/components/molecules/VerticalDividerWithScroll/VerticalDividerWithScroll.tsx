import React, { ReactNode } from 'react';

import styles from './VerticalDividerWithScroll.module.scss';

interface VerticalDividerWithScrollProps {
  bottomContent: ReactNode;
  content: ReactNode;
}

export const VerticalDividerWithScroll = ({
  bottomContent,
  content,
}: VerticalDividerWithScrollProps) => {
  return (
    <div className={styles['wrapper']}>
      <div className={styles['content-container']}>
        <div className={styles['content']}>{content}</div>
      </div>
      <div className={styles['scroll-shadow']} />
      <div className={styles['bottom-content']}>{bottomContent}</div>
    </div>
  );
};
