import React from 'react';
import cx from 'classnames';

import styles from './Spinner.module.scss';

interface SpinnerProps {
  className?: string;
  size?: 'small' | 'medium';
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size }) => {
  return <span
    className={cx(
      styles.spinner,
      size && styles[size],
      className,
    )}
  />;
};
