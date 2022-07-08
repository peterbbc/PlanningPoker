import { FlexBox, FormInput, VerticalSpacing } from '../../../../packages/react-base';
import { CustomerAddress } from '../../../../packages/types-planning-poker';
import React from 'react';

import styles from './AddressPicker.module.scss';

interface AddressPickerProps {
  value: CustomerAddress | null;
  onChange: (Address: CustomerAddress) => void;
}

export const AddressPicker = ({ value, onChange }: AddressPickerProps) => {
  return (
    <div className={styles['Address-picker']}>
      <FormInput
        isNoMargin
        value={value?.line1 || ''}
        name="line1"
        type="text"
        label="Address"
        onChange={(line1Value) => onChange({ ...value, line1: line1Value })}
      />
      <VerticalSpacing spacing="spacing-xs" />
      <FormInput
        isNoMargin
        value={value?.state || ''}
        name="state"
        type="text"
        label="State / Province"
        onChange={(stateValue) => onChange({ ...value, state: stateValue })}
      />
      <VerticalSpacing spacing="spacing-xs" />
      <FlexBox justifyContent="space-between">
        <div className={styles.inputConatiner}>
          <FormInput
            isNoMargin
            value={value?.postal_code || ''}
            name="postal_code"
            type="text"
            label="Postal code / ZIP"
            onChange={(postalValue) =>
              onChange({ ...value, postal_code: postalValue })
            }
          />
        </div>
        <div className={styles.inputConatiner}>
          <FormInput
            isNoMargin
            value={value?.city || ''}
            name="city"
            type="text"
            label="City"
            onChange={(cityValue) => onChange({ ...value, city: cityValue })}
          />
        </div>
      </FlexBox>
    </div>
  );
};
