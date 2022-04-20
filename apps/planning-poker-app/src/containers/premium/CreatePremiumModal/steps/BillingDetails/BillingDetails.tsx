import React from 'react';

import {
  BillingDetailsForm,
  BillingDetailsValue,
} from '../../../../../components/organisms/BillingDetailsForm/BillingDetailsForm';

interface BillingDetailsProps {
  billingDetails: BillingDetailsValue;
  onChangeBillingDetails: (details: BillingDetailsValue) => void;
  onSubmit: () => void;
  isCountryOnError: string | false;
}

export const BillingDetails = ({
  billingDetails,
  onChangeBillingDetails,
  isCountryOnError,
  onSubmit,
}: BillingDetailsProps) => {
  return (
    <div>
      <BillingDetailsForm
        onSubmit={onSubmit}
        billingDetails={billingDetails}
        onChangeBillingDetails={onChangeBillingDetails}
        isCountryOnError={isCountryOnError}
      />
    </div>
  );
};
