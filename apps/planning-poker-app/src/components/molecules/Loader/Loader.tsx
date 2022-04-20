import { Paragraph, VerticalSpacing } from '@we-agile-you/react-base';
import React, { ReactNode } from 'react';

import styles from './Loader.module.scss';

interface LoaderProps {
  message?: ReactNode;
}

export const Loader = ({ message }: LoaderProps) => {
  return (
    <div className={styles['loader']}>
      <div className={styles['robot-container']}>
        <div className={styles['robot']} />
      </div>
      <VerticalSpacing spacing="spacing-xl" />
      <Paragraph color="grey500">{message}</Paragraph>
    </div>
  );
};
