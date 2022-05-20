import cx from 'classnames';
import React, { ReactNode } from 'react';

import styles from './FlexBox.module.scss';

interface FlexBoxProps {
  className?: string;
  children: ReactNode;
  wrapElements?: boolean;
  onClick?: () => void;
  justifyContent?: 'start' | 'center' | 'end' | 'space-between';
  alignItems?: 'start' | 'center' | 'end' | 'strech';
  isInline?: boolean;
}

export const FlexBox = ({
  children,
  justifyContent,
  alignItems,
  wrapElements,
  className,
  onClick,
  isInline,
}: FlexBoxProps) => (
  <div
    className={cx(
      styles['flexbox'],
      isInline && styles['flexbox--inline'],
      justifyContent && styles[`flexbox--${justifyContent}`],
      alignItems && styles[`flexbox--align-${alignItems}`],
      wrapElements && styles[`flexbox--wrap-elements`],
      className,
    )}
    onClick={onClick}
  >
    {children}
  </div>
);
