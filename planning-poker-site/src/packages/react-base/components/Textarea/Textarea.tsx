import React, { RefObject } from 'react';

import styles from './Textarea.module.scss';

interface TextareaProps {
  id?: string;
  value?: string;
  ref?: RefObject<HTMLInputElement>;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  maxLength?: number;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const TextareaFC: React.ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = (props, ref) => {
  const {
    value,
    readOnly,
    autoFocus,
    required,
    maxLength,
    onChange,
    onFocus,
    onBlur,
    autoComplete,
    name,
  } = props;

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
    <textarea
      id={name}
      ref={ref}
      className={styles.textarea}
      value={value}
      autoFocus={autoFocus}
      onFocus={handleInputFocus}
      onBlur={handleInputBlur}
      onChange={handleInputChange}
      maxLength={maxLength}
      readOnly={readOnly}
      required={required}
      name={name}
      autoComplete={autoComplete}
    />
  );
};

export const Textarea = React.forwardRef(TextareaFC);
