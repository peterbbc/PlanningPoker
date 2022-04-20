import { CountryKey, isEuCountry } from '@we-agile-you/js-base';
import { FormInput } from '@we-agile-you/react-base';
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
