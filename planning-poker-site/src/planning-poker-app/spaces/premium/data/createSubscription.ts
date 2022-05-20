import firebaseDefault from 'firebase/compat/app';
import "firebase/compat/functions";

type CreateSubscriptionInfo = {
  customerId: string;
  paymentMethodId: string;
  isPurchaseNow: boolean;
  facilitatorsQuanitity: number;
  billingType: 'monthly' | 'yearly';
};

export const createSubscription = (
  {
    customerId,
    paymentMethodId,
    isPurchaseNow,
    facilitatorsQuanitity,
    billingType,
  }: CreateSubscriptionInfo,
  firebase = firebaseDefault,
) =>
  firebase
    .functions()
    .httpsCallable('stripeCreateSubscription')({
      customerId,
      paymentMethodId,
      isPurchaseNow,
      facilitatorsQuanitity,
      billingType,
    })
    .then((result) => {
      return result?.data || null;
    });
