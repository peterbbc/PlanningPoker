import React from 'react';
import cx from 'classnames';

import styles from './Container.module.scss';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'big';
  isCenteredInPage?: boolean;
  className?: string;
}

export const Container = ({
  children,
  size,
  className,
  isCenteredInPage,
}: ContainerProps) => {
  return (
    <div
      className={cx(
        styles['container'],
        size && styles[`container--${size}`],
        isCenteredInPage && styles[`container--centered`],
        className,
      )}
    >
      {isCenteredInPage ? <div>{children}</div> : children}
    </div>
  );
};
