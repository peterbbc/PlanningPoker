import { StripeCardElement, Stripe } from '@stripe/stripe-js';
export const savePaymentMethod = async (
  cardElement: StripeCardElement,
  stripe: Stripe,
) => {
  if (!stripe || !cardElement) {
    // Stripe.js has not yet loaded.
    // Make sure to disable form submission until Stripe.js has loaded.

    throw new Error(
      'Something when loading resources, please refresh page and try again.',
    );
  }

  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error || !paymentMethod) {
    console.error('[createPaymentMethod error]', error);

    throw new Error(
      error?.message || 'Unexpected error when saving card details.',
    );
  }

  return paymentMethod.id;
};
