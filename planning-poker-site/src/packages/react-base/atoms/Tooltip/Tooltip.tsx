import React from 'react';
import cx from 'classnames';

import styles from './Tooltip.module.scss';

interface TooltipProps {
  className?: string;
  children: React.ReactNode;
  isShowOnSmallScreen?: boolean;
}

export const Tooltip = ({
  className,
  children,
  isShowOnSmallScreen,
}: TooltipProps) => {
  return (
    <span
      className={cx(
        className,
        styles['tooltip'],
        isShowOnSmallScreen && styles[`tooltip--show-on-small-screen`],
      )}
    >
      {children}
    </span>
  );
};
