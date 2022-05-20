import React from 'react';
import { StripeElementsProvider } from '../../../vendors/stripe/StripeElementsProvider';

import { PaymentFailedAlertInner } from './PaymentFailedAlertInner';

export const PaymentFailedAlert = () => {
  return (
    <StripeElementsProvider>
      <PaymentFailedAlertInner />
    </StripeElementsProvider>
  );
};
