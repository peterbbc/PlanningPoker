import React from 'react';

import styles from './Loading.module.scss';

interface LoadingProps {
  message: string;
}

export const Loading = ({ message }: LoadingProps) => {
  return (
    <div className={styles.loading}>
      <div>
        <div className={styles.spinner} />
      </div>
      <div>{message}</div>
    </div>
  );
};
