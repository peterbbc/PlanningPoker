import { CountryKey, isEuCountry } from '../../../../packages/js-base';
import { FormInput } from '../../../../packages/react-base';
import React from 'react';

interface VATNumberPickerProps {
  country?: CountryKey;
  value: string | null;
  onChange: (value: string) => void;
}

export const VATNumberPicker = ({
  value,
  country,
  onChange,
}: VATNumberPickerProps) => {
  const isEuVat = country && isEuCountry(country);

  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <FormInput
      value={value || ''}
      onChange={handleChange}
      name="vatid"
      type="text"
      label={isEuVat ? 'VAT id' : 'TAX id'}
    />
  );
};
