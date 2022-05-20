import React, { useState } from 'react';

import { FormGroup } from '../../molecules/FormGroup/FormGroup';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';
import { FormAddon } from '../FormAddon/FormAddon';
import { Paragraph } from '../../atoms/text/Paragraph/Paragraph';
import { Icon } from '../../atoms/Icon/Icon';
import { FlexBox } from '../../atoms/FlexBox/FlexBox';

import styles from './FormInput.module.scss';
import { VerticalSpacing } from '../../atoms/spacings/VerticalSpacing/VerticalSpacing';

export interface FormInputProps {
  label?: string;
  id?: string;
  value?: string | number;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  inlineHint?: string;
  readOnly?: boolean;
  isNoMargin?: boolean;
  type?: 'text' | 'password' | 'email' | 'number';
  name?: string;
  min?: number;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  leftContent?: React.ReactNode;
  formInputMultiplePosition?: 'first' | 'center' | 'last';
}

const FormInputFC: React.ForwardRefRenderFunction<
  HTMLInputElement,
  FormInputProps
> = (props, ref) => {
  const {
    label,
    onFocus,
    onBlur,
    value,
    leftContent,
    inlineHint,
    isNoMargin,
    ...inputProps
  } = props;
  const [isFocus, setIsFocus] = useState(false);

  const handleFocus = () => {
    setIsFocus(true);
    if (onFocus) {
      onFocus();
    }
  };
  const handleBlur = () => {
    setIsFocus(false);

    if (onBlur) {
      onBlur();
    }
  };

  const isMultipleInputs = !!props.formInputMultiplePosition;

  const isLabelAPlaceholder = !value && value !== 0 && !isFocus;

  const hideLabel = !!value && isMultipleInputs;

  return (
    <FormGroup isNoMargin={isNoMargin || isMultipleInputs}>
      {label && !hideLabel && (
        <Label
          htmlFor={props.id}
          isPlaceholder={isLabelAPlaceholder || isMultipleInputs}
          hasLeftAddon={!!leftContent}
          isMultiple={isMultipleInputs}
        >
          {label}
        </Label>
      )}
      {leftContent && <FormAddon>{leftContent}</FormAddon>}
      <Input
        ref={ref}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        hasLeftAddon={!!leftContent}
        {...inputProps}
      />
      {inlineHint && (
        <>
          <VerticalSpacing spacing="spacing-xs" />
          <FlexBox alignItems="center">
            <div className={styles.icon}>
              <Icon icon="info" />
            </div>
            <Paragraph size="micro" color="info">
              {inlineHint}
            </Paragraph>
          </FlexBox>
        </>
      )}
    </FormGroup>
  );
};

export const FormInput = React.forwardRef(FormInputFC);
