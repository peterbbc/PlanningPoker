import { FlexBox, RadioButtonsGroup } from '../../../../../../packages/react-base';
import React from 'react';

import styles from './BillingTypeRadio.module.scss';

export type BillingType = 'yearly' | 'monthly';

interface BillingTypeRadioProps {
  value: string;
  onChange: (value: BillingType) => void;
}
export const BillingTypeRadio = ({
  value,
  onChange,
}: BillingTypeRadioProps) => {
  return (
    <>
      <RadioButtonsGroup
        value={value}
        buttons={[
          {
            value: 'monthly',
            label: 'Monthly ($30/month)',
          },
          {
            value: 'yearly',
            label: (
              <FlexBox>
                <span>Yearly ($300/year)</span>
                <span className={styles.saveLabel}>SAVE 16%</span>
              </FlexBox>
            ),
          },
        ]}
        onChange={(value) => {
          onChange(value as BillingType);
        }}
      />
    </>
  );
};
