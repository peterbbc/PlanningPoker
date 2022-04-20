import cx from 'classnames';
import React from 'react';

import styles from './HoritzontalSpacing.module.scss';

interface HoritzontalSpacingProps {
  className?: string;
  spacing:
    | 'spacing-xxs'
    | 'spacing-xs'
    | 'spacing-s'
    | 'spacing-m'
    | 'spacing-l'
    | 'spacing-xl'
    | 'spacing-xxl'
    | 'spacing-xxl-2'
    | 'spacing-xxl-3'
    | 'spacing-xxl-4';
}

export const HoritzontalSpacing = ({
  spacing,
  className,
}: HoritzontalSpacingProps) => (
  <div
    className={cx(
      styles['horitzontal-spacer'],
      styles[`horitzontal-spacer--${spacing}`],
      className,
    )}
  />
);
