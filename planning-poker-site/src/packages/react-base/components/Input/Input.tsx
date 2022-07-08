import React, { RefObject } from 'react';
import cx from 'classnames';

import styles from './Input.module.scss';

interface InputProps {
  id?: string;
  value?: string | number;
  ref?: RefObject<HTMLInputElement>;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  maxLength?: number;
  min?: number;
  readOnly?: boolean;
  required?: boolean;
  type?: 'text' | 'password' | 'email' | 'number';
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  hasLeftAddon?: boolean;
  hasRightAddon?: boolean;
  style?: 'filter';
  formInputMultiplePosition?: 'first' | 'center' | 'last';
}

const InputFC: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  props,
  ref,
) => {
  const {
    value,
    readOnly,
    required,
    maxLength,
    onChange,
    onFocus,
    min,
    onKeyDown,
    onBlur,
    autoComplete,
    placeholder,
    name,
    style,
    hasLeftAddon,
    hasRightAddon,
    formInputMultiplePosition,
  } = props;
  const type = props.type || 'text';

  function handleInputChange(e: React.FormEvent) {
    const { value } = e.target as HTMLInputElement;

    if (onChange) {
      onChange(value);
    }
  }

  function handleInputFocus(): void {
    if (onFocus) {
      onFocus();
    }
  }

  function handleInputBlur(): void {
    if (onBlur) {
      onBlur();
    }
  }

  return (
    <input
      id={name}
      ref={ref}
      className={cx(
        styles.input,
        hasLeftAddon && styles.inputHasLeftAddon,
        hasRightAddon && styles.inputHasRightAddon,
        style && styles[`input--${style}`],
        formInputMultiplePosition && styles[`input--${formInputMultiplePosition}`],
      )}
      type={type}
      value={value}
      min={min}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      onChange={handleInputChange}
      maxLength={maxLength}
      readOnly={readOnly}
      placeholder={style === 'filter' ? placeholder : undefined}
      required={required}
      name={name}
      autoComplete={autoComplete}
      onKeyDown={onKeyDown}
    />
  );
};

export const Input = React.forwardRef(InputFC);
