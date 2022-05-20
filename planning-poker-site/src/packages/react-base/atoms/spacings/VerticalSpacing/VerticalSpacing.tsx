import cx from 'classnames';
import React from 'react';

import styles from './VerticalSpacing.module.scss';

interface VerticalSpacingProps {
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
  spacingXL?:
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

export const VerticalSpacing = ({
  spacing,
  spacingXL,
}: VerticalSpacingProps) => (
  <div
    className={cx(
      styles['vertical-spacer'],
      styles[`vertical-spacer--${spacing}`],
      styles[`vertical-spacer-xl--${spacingXL}`],
    )}
  />
);
