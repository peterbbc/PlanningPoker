import { getTaxForCountry, isEuCountry } from '../../../../packages/js-base';
import {
  InlineAlert,
  SubmitRow,
  VerticalSpacing,
} from '../../../../packages/react-base';
import { Customer } from '../../../../packages/types-planning-poker';
import React, { useEffect, useState } from 'react';
import {
  BillingDetailsForm,
  BillingDetailsValue,
} from '../../../components/organisms/BillingDetailsForm/BillingDetailsForm';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { addTaxIdToCurrentUser } from '../../../spaces/premium/data/addTaxIdToCurrentUser';
import { clearTaxIdsOfCurrentUser } from '../../../spaces/premium/data/clearTaxIdsOfCurrentUser';
import { updateCurrentUserCustomer } from '../../../spaces/premium/data/updateCurrentUserCustomer';

interface BillingDetailsStepProps {
  onSaved: () => void;
  onCancel: () => void;
}

const NO_COUNTRY_MESSAGE = 'Please select a country';
const INVALID_VAT_MESSAGE =
  'VAT id is not valid. If you think this is not true please contact us.';

export const BillingDetailsStep = ({
  onSaved,
  onCancel,
}: BillingDetailsStepProps) => {
  const { user } = useCurrentUser();
  const [billingDetails, setBillingDetails] =
    useState<BillingDetailsValue | null>(null);
  const [isCountrySelected, setIsCountrySelected] = useState<boolean | null>(
    null,
  );
  const [error, setError] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  const handleBillingDetailsChange = (value: BillingDetailsValue) => {
    if (value?.address?.country && isCountrySelected === false) {
      setIsCountrySelected(true);

      if (error?.message === NO_COUNTRY_MESSAGE) {
        setError(null);
      }
    }

    if (value?.vatid && error?.message === INVALID_VAT_MESSAGE) {
      setError(null);
    }

    setBillingDetails(value);
  };

  const saveBillingDetails = async () => {
    if (!billingDetails?.address?.country) {
      throw new Error('Please select a country');
    }

    const { vatid, isParticular } = billingDetails;

    // Set to null to delete previous data
    const customer: Customer = {
      name: billingDetails.name, // non optional
      email: billingDetails.email, // non optional
      address: billingDetails.address
        ? {
            city: billingDetails.address.city || null,
            line1: billingDetails.address.line1 || null,
            line2: billingDetails.address.line2 || null,
            postal_code: billingDetails.address.postal_code || null,
            state: billingDetails.address.state || null,
            country: billingDetails.address.country, // non optional
          }
        : null,
    };

    if (vatid) {
      await addTaxIdToCurrentUser(
        vatid,
        isEuCountry(billingDetails.address.country),
      );
    } else {
      await clearTaxIdsOfCurrentUser();
    }

    const updatedCustomer = await updateCurrentUserCustomer(
      customer,
      !!isParticular,
    );

    return updatedCustomer;
  };

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    }

    // Verify form ----------------------------------------------------------------------
    if (!billingDetails?.address?.country) {
      setError({
        ...error,
        message: NO_COUNTRY_MESSAGE,
      });
    }

    // Save billing details  ------------------------------------------------------------
    setIsLoading(true);
    try {
      await saveBillingDetails();
    } catch (error: any) {
      console.error('[updateCurrentUserCustomer error]', error);
      setIsLoading(false);
      setError({
        ...error,
        message:
          error?.message && error?.message !== 'INTERNAL'
            ? error?.message
            : 'Error saving your billing details.',
      });

      return;
    }

    onSaved();
  };

  useEffect(() => {
    if (user && billingDetails === null) {
      setBillingDetails({
        name: user?.customerName || '',
        email: user?.customerEmail || '',
        address: user?.customerAddress || null,
        isParticular: !!user?.customerIsParticular,
        vatid:
          typeof user.customerTaxId === 'string'
            ? user.customerTaxId
            : user.customerTaxId?.value || '',
      });
    }
  }, [user, billingDetails]);

  const euVAT = billingDetails?.address?.country && getTaxForCountry();

  return (
    <div>
      {billingDetails && (
        <BillingDetailsForm
          billingDetails={billingDetails}
          onChangeBillingDetails={handleBillingDetailsChange}
          isCountryOnError={
            error?.message === NO_COUNTRY_MESSAGE ? NO_COUNTRY_MESSAGE : false
          }
          onSubmit={handleSubmit}
        />
      )}

      {billingDetails?.isParticular === false &&
        billingDetails?.address?.country &&
        isEuCountry(billingDetails?.address?.country) &&
        !billingDetails.vatid && (
          <>
            <InlineAlert
              style="info"
              content={`Failure to supply a Value Added Tax (VAT) number requires us to add ${euVAT}% to your total bill.`}
            />
            <VerticalSpacing spacing="spacing-m" />
          </>
        )}

      {billingDetails?.isParticular && (
        <>
          <VerticalSpacing spacing="spacing-m" />
          <InlineAlert
            style="info"
            content={`If it is not a business purchase we are required to add ${euVAT}% to your total bill.`}
          />
        </>
      )}

      {error && (
        <>
          <VerticalSpacing spacing="spacing-m" />
          <InlineAlert content={error.message} />
        </>
      )}

      <VerticalSpacing spacing="spacing-xxl-2" />

      <SubmitRow
        align="strech"
        onCancel={onCancel}
        cancelLabel="Cancel"
        confirmLabel="Save"
        form="billing-form"
        isLoading={!!isLoading}
      />
    </div>
  );
};
