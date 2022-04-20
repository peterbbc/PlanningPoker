import { CountryKey, COUNTRY_LIST } from '@we-agile-you/js-base';
import {
  FormSelect,
  Paragraph,
  SelectValue,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React from 'react';

type CountryOption = {
  label: string;
  value: CountryKey;
};

const selectOptions = Object.keys(COUNTRY_LIST) as CountryKey[];

const options: CountryOption[] = selectOptions.map((key: CountryKey) => ({
  value: key,
  label: COUNTRY_LIST[key],
}));

interface CountryPickerProps {
  value: CountryKey | null;
  onChange: (country: CountryKey) => void;
  isCountryOnError: string | false;
}

export const CountryPicker = ({
  value,
  onChange,
  isCountryOnError,
}: CountryPickerProps) => {
  const handleChange = (selectedValue: SelectValue<CountryOption>) => {
    const selectedOption =
      Array.isArray(selectedValue) && selectedValue.length > 0
        ? selectedValue[0]
        : selectedValue;

    onChange(selectedOption.value);
  };

  return (
    <>
      <FormSelect
        value={options.find((option) => option.value === value)}
        options={options}
        onChange={handleChange}
        label="Country"
        isError={!!isCountryOnError}
        isNoMargin
      />
      {isCountryOnError && (
        <>
          <VerticalSpacing spacing="spacing-xs" />
          <Paragraph color="danger">{isCountryOnError}</Paragraph>
        </>
      )}
    </>
  );
};
