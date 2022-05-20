import firebaseDefault from 'firebase/compat/app';

type UpdatePaymentMethodInfo = {
  paymentMethodId: string;
};
export const updatePaymentMethod = (
  { paymentMethodId }: UpdatePaymentMethodInfo,
  firebase = firebaseDefault,
) =>
  firebase
    .functions()
    .httpsCallable('stripeUpdateCurrentUserPaymentMethod')({
      paymentMethodId,
    })
    .then((result) => {
      return result?.data;
    })
    .catch(function (error) {
      // The card had an error when trying to attach it to a customer.
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      throw error;
    });
// We dont handle payment requires action, the <PaymentFaild> component will handle this
