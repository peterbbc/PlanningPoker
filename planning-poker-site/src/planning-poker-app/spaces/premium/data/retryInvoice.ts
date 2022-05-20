import firebaseDefault from 'firebase/compat/app';

interface RetryInvoiceWithNewPaymentMethodInfo {
  customerId: string;
  paymentMethodId: string;
  invoiceId: string;
}

export const retryInvoice = (
  {
    customerId,
    paymentMethodId,
    invoiceId,
  }: RetryInvoiceWithNewPaymentMethodInfo,
  firebase = firebaseDefault,
) => {
  return firebase
    .functions()
    .httpsCallable('stripeRetryInvoice')({
      customerId,
      paymentMethodId,
      invoiceId,
    })
    .then((result) => {
      return result?.data || null;
    });
};
