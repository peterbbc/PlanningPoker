import React from 'react';
import cx from 'classnames';

import styles from './Label.module.scss';

interface FormLabelProps {
  htmlFor?: string;
  isPlaceholder?: boolean;
  hasLeftAddon?: boolean;
  isMultiple?: boolean;
}

export const Label: React.FC<FormLabelProps> = ({
  children,
  isPlaceholder,
  hasLeftAddon,
  isMultiple,
  ...labelProps
}) => {
  const className = cx(
    styles['label'],
    isPlaceholder && styles['placeholder'],
    hasLeftAddon && styles['label--has-left-addon'],
    isMultiple && styles['label--multiple'],
  );

  return (
    <label className={className} {...labelProps}>
      {children}
    </label>
  );
};
