import React from 'react';
import cx from 'classnames';

import styles from './InputNumber.module.scss';

export interface InputNumberProps {
  id?: string;
  value?: number | null;
  required?: boolean;
  maxLength?: number;
  name?: string;
  min?: number;
  max?: number;
  onChange: (value: number | null) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const InputNumberFC: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputNumberProps
> = (props, ref) => {
  const value = props.value || 0;
  const isMinButtonDisabled =
    typeof props.min === 'number' && value <= props.min;
  return (
    <div className={styles['wrapper']}>
      <button
        className={cx(
          styles['minus-button'],
          isMinButtonDisabled && styles['minus-button--disabled'],
        )}
        type="button"
        disabled={isMinButtonDisabled}
        onClick={() => {
          const newValue = value - 1;

          if (typeof props.min !== 'undefined' && newValue < props.min) {
            return;
          }
          props.onChange(newValue);
        }}
      >
        -
      </button>
      <input
        ref={ref}
        className={styles['input']}
        {...props}
        value={props.value || undefined}
        type="number"
        onChange={(event) =>
          props.onChange(event.target.value ? Number(event.target.value) : null)
        }
      />
      <button
        type="button"
        className={styles['plus-button']}
        onClick={() => {
          const newValue = value + 1;
          if (typeof props.max !== 'undefined' && newValue > props.max) {
            return;
          }
          props.onChange(newValue);
        }}
      >
        +
      </button>
    </div>
  );
};

export const InputNumber = React.forwardRef(InputNumberFC);
