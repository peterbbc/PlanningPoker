import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';

const stripeKey =
  process.env.GATSBY_ENV === 'production'
    ? 'pk_live_gKiHFDfhbP0jMNOFHVoGOYYt00nCWO5LUB'
    : 'pk_test_76D83wRhlyHllGlyrL8R69FO00CV0PhD9E';

export const STRIPE_PRICES_IDS =
  process.env.GATSBY_ENV === 'production'
    ? {
        yearly: 'price_1HWN2PA3Gc0cJsLh2CrFMtEG',
        monthly: 'price_1HWN2PA3Gc0cJsLhaCQV8v3U',
        montlhyDeprecated: 'plan_H7OyEsj01TG8fV',
        perMonthFacilitator: '',
        perYearFacilitator: '',
      }
    : {
        yearly: 'price_1HVAwxA3Gc0cJsLhyF5YwTZd', // weekly
        monthly: 'price_1HVAwxA3Gc0cJsLhdAyn1YPu', // daily
        montlhyDeprecated: 'plan_H2KOmxnTUzhLcj', // daily
        perMonthFacilitator: 'price_1IxpczA3Gc0cJsLhSNvzhm3r', // weekly
        perYearFacilitator: 'price_1IxpdeA3Gc0cJsLh5e8qsrwl', // daily
      };

export const isYearly = (priceId: string) => {
  return priceId === STRIPE_PRICES_IDS.yearly;
};
export const isDeprecatedPirce = (priceId: string) => {
  return priceId === STRIPE_PRICES_IDS.montlhyDeprecated;
};

const stripePromise = loadStripe(stripeKey);

interface StripeElementsProviderProps {
  children: React.ReactNode;
}

export const StripeElementsProvider = ({
  children,
}: StripeElementsProviderProps) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);
