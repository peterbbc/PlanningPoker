import { isEuCountry } from '../../../../packages/js-base';
import {
  Paragraph,
  VerticalSpacing,
  RadioButtonsGroup,
  FormInput,
} from '../../../../packages/react-base';
import React, { FormEvent } from 'react';
import { CustomerAddress } from '../../../../packages/types-planning-poker';
import { AddressPicker } from '../../molecules/AddressPicker/AddressPicker';
import { CountryPicker } from '../../molecules/CountryPicker/CountryPicker';
import { VATNumberPicker } from '../../molecules/VATNumberPicker/VATNumberPicker';

export type BillingDetailsValue = {
  address?: CustomerAddress | null;
  vatid?: string;
  name?: string;
  email?: string;
  isParticular?: boolean;
};
interface BillingDetailsFormProps {
  billingDetails: BillingDetailsValue;
  onSubmit: () => void;
  onChangeBillingDetails: (details: BillingDetailsValue) => void;
  isCountryOnError: string | false;
}

export const BillingDetailsForm = ({
  billingDetails,
  onSubmit,
  onChangeBillingDetails,
  isCountryOnError,
}: BillingDetailsFormProps) => {
  const { isParticular } = billingDetails;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form id="billing-form" onSubmit={handleSubmit}>
      <Paragraph fontWeight="bold">
        <span>
          {isParticular ? 'Personal details' : 'Organization details'}
        </span>
      </Paragraph>
      <VerticalSpacing spacing="spacing-l" />

      <div>
        <CountryPicker
          value={billingDetails.address?.country || null}
          onChange={(country) =>
            onChangeBillingDetails({
              ...billingDetails,
              address: { ...billingDetails.address, country },
              vatid: undefined,
            })
          }
          isCountryOnError={isCountryOnError}
        />
        <VerticalSpacing spacing="spacing-xs" />
        <FormInput
          value={billingDetails?.name || ''}
          onChange={(name: string) => {
            onChangeBillingDetails({ ...billingDetails, name });
          }}
          name="name"
          type="text"
          label={
            billingDetails?.isParticular ? 'Your name' : 'Organization name'
          }
          required
          isNoMargin
        />
        <VerticalSpacing spacing="spacing-xs" />
        <FormInput
          value={billingDetails?.email || ''}
          onChange={(email: string) => {
            onChangeBillingDetails({ ...billingDetails, email });
          }}
          name="email"
          type="email"
          label="Billing email"
          required
          isNoMargin
        />
        <VerticalSpacing spacing="spacing-xs" />
        <AddressPicker
          value={billingDetails?.address || null}
          onChange={(address) =>
            onChangeBillingDetails({ ...billingDetails, address })
          }
        />
      </div>

      <VerticalSpacing spacing="spacing-xl" />

      <Paragraph fontWeight="bold">Is this a business purchase?</Paragraph>
      <VerticalSpacing spacing="spacing-m" />
      <RadioButtonsGroup
        value={isParticular ? 'particular' : 'organization'}
        buttons={[
          { value: 'organization', label: 'Yes' },
          { value: 'particular', label: 'No' },
        ]}
        onChange={(value) =>
          onChangeBillingDetails({
            ...billingDetails,
            isParticular: value === 'particular',
            vatid: '',
          })
        }
      />

      {!isParticular &&
        billingDetails?.address?.country &&
        isEuCountry(billingDetails?.address?.country) && (
          <>
            <VerticalSpacing spacing="spacing-l" />
            <VATNumberPicker
              value={billingDetails?.vatid || ''}
              onChange={(vatid: string) => {
                onChangeBillingDetails({
                  ...billingDetails,
                  vatid,
                });
              }}
              country={billingDetails?.address?.country}
            />
          </>
        )}
    </form>
  );
};
