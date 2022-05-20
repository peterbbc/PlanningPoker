import cx from 'classnames';
import React from 'react';

import { Checkbox } from '../Checkbox/Checkbox';
import { FormGroup } from '../../molecules/FormGroup/FormGroup';
import styles from './FormCheckbox.module.scss';

interface FormCheckboxProps {
  label?: React.ReactNode;
  id?: string;
  isChecked?: boolean;
  required?: boolean;
  name?: string;
  boxSize?: 'medium' | 'big';
  onChange?: (value: boolean) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const FormCheckboxFC: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  FormCheckboxProps
> = (props, ref) => {
  const { label, onFocus, onBlur, onChange, isChecked, ...inputProps } = props;

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };
  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const handleChange = () => {
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <FormGroup>
      <div className={styles.wrapper}>
        <div>
          <Checkbox
            ref={ref}
            color="primary"
            value="agree-to-terms"
            onChange={handleChange}
            checked={isChecked}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...inputProps}
          />
        </div>

        <div
          className={cx(
            styles.label,
            inputProps.boxSize === 'big' && styles['label--big'],
          )}
        >
          <label htmlFor={props.id}>{label}</label>
        </div>
      </div>
    </FormGroup>
  );
};

export const FormCheckbox = React.forwardRef(FormCheckboxFC);
