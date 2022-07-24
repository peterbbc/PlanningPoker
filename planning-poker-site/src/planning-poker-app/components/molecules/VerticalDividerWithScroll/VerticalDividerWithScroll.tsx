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
    <div className={styles.wrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.content}>{content}</div>
      </div>
      <div className={styles.scrollShadow} />
      <div className={styles.bottomContent}>{bottomContent}</div>
    </div>
  );
};
