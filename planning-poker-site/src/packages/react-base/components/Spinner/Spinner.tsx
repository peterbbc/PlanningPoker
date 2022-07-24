import React from 'react';
import cx from 'classnames';

import styles from './Spinner.module.scss';

interface SpinnerProps {
  className?: string;
  size?: 'small' | 'medium';
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size }) => {
  const classNames = cx(
    styles['spinner'],
    size && styles[size],
    className,
  );

  return <span className={classNames} />;
};
