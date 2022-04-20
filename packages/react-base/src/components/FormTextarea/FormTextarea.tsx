import React, { useState } from 'react';

import { FormGroup } from '../../molecules/FormGroup/FormGroup';
import { Label } from '../Label/Label';
import { Textarea } from '../Textarea/Textarea';

interface FormTextareaProps {
  label?: string;
  id?: string;
  value?: string;
  autoFocus?: boolean;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  readOnly?: boolean;
  name?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const FormTextareaFC: React.ForwardRefRenderFunction<
  HTMLTextAreaElement,
  FormTextareaProps
> = (props, ref) => {
  const [isFocus, setIsFocus] = useState(false);

  const handleFocus = () => {
    setIsFocus(true);
    if (props.onFocus) {
      props.onFocus();
    }
  };
  const handleBlur = () => {
    setIsFocus(false);

    if (props.onBlur) {
      props.onBlur();
    }
  };

  const { label, ...inputProps } = props;

  const isLabelAPlaceholder = !props.value && !isFocus;

  return (
    <FormGroup>
      <Label htmlFor={props.name} isPlaceholder={isLabelAPlaceholder}>
        {label}
      </Label>
      <Textarea
        ref={ref}
        {...inputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </FormGroup>
  );
};

export const FormTextarea = React.forwardRef(FormTextareaFC);
