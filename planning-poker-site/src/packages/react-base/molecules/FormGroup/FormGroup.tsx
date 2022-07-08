import React from 'react';
import cx from 'classnames';

import styles from './FormGroup.module.scss';

interface FormGroupProps {
  children: React.ReactNode;
  isSubmit?: boolean;
  isNoMargin?: boolean;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  isSubmit,
  isNoMargin,
  className,
}) => {
  return (
    <div
      className={cx(
        styles.formGroup,
        className,
        isSubmit && styles.formGroupSubmit,
        isNoMargin && styles.formGroupNoMargin,
      )}
    >
      {children}
    </div>
  );
};
