import cx from 'classnames';
import React, { ReactNode } from 'react';
import ReactSelect from 'react-select';

import styles from './Select.module.scss';

export interface OptionType {
  label: string | ReactNode;
  value: string;
  meta?: any;
  [metaKey: string]: any;
}

//@ts-ignore
export type SelectValue<T> = ValueType<T>;
export type SelectOptions = OptionType[];

interface SelectProps<T> {
  value?: SelectValue<T>;
  options?: SelectOptions;
  id?: string;
  required?: boolean;
  autoFocus?: boolean;
  isMulti?: boolean;
  isSearchable?: boolean;
  backspaceRemovesValue?: boolean;
  autoComplete?: string;
  size?: 'medium' | 'small';
  placeholder?: string;
  maxLength?: number;
  isBlock?: boolean;
  controlShouldRenderValue?: boolean;
  hideSelectedOptions?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  menuIsOpen?: boolean;
  readOnly?: boolean;
  tabSelectsValue?: boolean;
  menuPlacement?: 'auto' | 'bottom' | 'top';
  name?: string;
  noOptionsMessage?: () => string;
  menuPortalTarget?: HTMLElement;
  styles?: any;
  isSmallDrodpwon?: boolean;
  isError?: boolean;
  isTableHeader?: boolean;
  onChange?: (value: SelectValue<T>) => void;
  formatOptionLabel?: (option: OptionType, meta: any) => ReactNode;
}

const SelectFC: React.ForwardRefRenderFunction<any, SelectProps<OptionType>> = (
  { isSmallDrodpwon, size, isError, isTableHeader, ...props },
  ref,
) => {
  const className = cx(
    styles.select,
    isSmallDrodpwon && styles['select--small-dropdown'],
    size === 'small' && styles['select--small'],
    isError && styles['select--error'],
    isTableHeader && styles['select--table-header'],
  );

  return (
    <ReactSelect
      ref={ref}
      className={className}
      classNamePrefix="select"
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 200 }) }}
      {...props}
    />
  );
};

export const Select = React.forwardRef(SelectFC);
