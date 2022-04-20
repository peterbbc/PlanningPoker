import React from 'react';

import { FormGroup } from '../../molecules/FormGroup/FormGroup';
import { Label } from '../Label/Label';
import {
  OptionType,
  Select,
  SelectOptions,
  SelectValue,
} from '../Select/Select';

interface FormSelectProps<T> {
  value?: SelectValue<T>;
  options?: SelectOptions;
  label?: string;
  id?: string;
  required?: boolean;
  isError?: boolean;
  autoComplete?: string;
  maxLength?: number;
  isBlock?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  isNoMargin?: boolean;
  isSearchable?: boolean;
  readOnly?: boolean;
  name?: string;
  noOptionsMessage?: () => string;
  size?: 'medium' | 'small';
  menuPlacement?: 'auto' | 'bottom' | 'top';
  menuPortalTarget?: HTMLElement;
  onChange?: (value: SelectValue<T>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const FormSelectFC: React.ForwardRefRenderFunction<
  HTMLSelectElement,
  FormSelectProps<OptionType>
> = (props, ref) => {
  const { label, isNoMargin, ...selectProps } = props;

  return (
    <FormGroup isNoMargin={isNoMargin}>
      {label && <Label htmlFor={props.name}>{label}</Label>}
      <Select ref={ref} {...selectProps} />
    </FormGroup>
  );
};

export const FormSelect = React.forwardRef(FormSelectFC);
