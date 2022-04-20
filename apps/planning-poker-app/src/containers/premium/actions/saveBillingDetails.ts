import { BillingDetailsValue } from '../../../components/organisms/BillingDetailsForm/BillingDetailsForm';
import { updateCurrentUserCustomer } from '../../../spaces/premium/data/updateCurrentUserCustomer';
import { clearTaxIdsOfCurrentUser } from '../../../spaces/premium/data/clearTaxIdsOfCurrentUser';
import { isEuCountry } from '@we-agile-you/js-base';
import { addTaxIdToCurrentUser } from '../../../spaces/premium/data/addTaxIdToCurrentUser';
import { Customer } from '@we-agile-you/types-planning-poker';

export const NO_COUNTRY_MESSAGE = 'Please select a country';
export const INVALID_VAT_MESSAGE_2 = 'VAT id is not valid.';

export const saveBillingDetails = async (
  billingDetails: BillingDetailsValue,
) => {
  if (!billingDetails?.address?.country) {
    throw new Error(NO_COUNTRY_MESSAGE);
  }

  if (
    billingDetails.vatid &&
    billingDetails.vatid.substr(0, 2).toUpperCase() !==
      billingDetails.address.country
  ) {
    throw new Error(INVALID_VAT_MESSAGE_2);
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
