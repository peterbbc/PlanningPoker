import { retryInvoice } from './../data/retryInvoice';
import { sendEvent } from './../../events/events';
import { useStripe } from '@stripe/react-stripe-js';
import { createSubscription as createSubscriptionRequest } from '../data/createSubscription';

type PaymentInfo = {
  customerId: string;
  invoice?: any;
  subscription?: any;
  paymentMethodId: any;
  isRetry?: boolean;
};

type CreateSubscriptionProps = {
  customerId: string;
  paymentMethodId: string;
  billingType: 'yearly' | 'monthly';
  isPurchaseNow: boolean;
  facilitatorsQuanitity: number;
};

export const useCreateSubscription = () => {
  const stripe = useStripe();

  const handlePaymentThatRequiresCustomerAction = ({
    subscription,
    invoice,
    paymentMethodId,
    isRetry,
    customerId,
  }: PaymentInfo) => {
    if (!stripe) {
      throw new Error('Stripe produced an unexpected error.');
    }

    // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
    // If it's a retry, the payment intent will be on the invoice itself.
    // Recorda: es subscription o invoice depenent de si es createSubscription o es retryInvoice
    // es setup itnent quan es per tiral period, es a last invoice quan es purchase now
    const paymentIntent =
      invoice?.payment_intent || subscription?.latest_invoice?.payment_intent;

    const setupIntent = subscription?.pending_setup_intent;
    const invoiceId = invoice ? invoice.id : subscription?.latest_invoice?.id;

    if (subscription && subscription.status === 'active') {
      // subscription is active, no customer actions required.
      // Recorda que si es trialing aqui no entre, realment aquest if potser no es necessita
      return { subscription, paymentMethodId, customerId };
    }

    if (
      paymentIntent?.status === 'requires_action' ||
      (isRetry === true && paymentIntent?.status === 'requires_payment_method')
    ) {
      return stripe
        .confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethodId,
        })
        .then((result) => {
          if (result.error) {
            // start code flow to handle updating the payment details
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc)
            localStorage.setItem('latestInvoiceId', invoiceId);
            localStorage.setItem(
              'latestInvoicePaymentIntentStatus',
              paymentIntent.status,
            );
            throw result.error;
          } else {
            if (result?.paymentIntent?.status === 'succeeded') {
              // There's a risk of the customer closing the window before callback
              // execution. To handle this case, set up a webhook endpoint and
              // listen to invoice.payment_succeeded. This webhook endpoint
              // returns an Invoice.
              return {
                subscription: subscription,
                invoice: invoice,
                paymentMethodId: paymentMethodId,
                customerId,
              };
            } else {
              throw new Error('Payment could not be confirmed.');
            }
          }
        });
    } else if (
      setupIntent?.status === 'requires_action' ||
      (isRetry === true && setupIntent?.status === 'requires_payment_method')
    ) {
      return stripe
        .confirmCardSetup(setupIntent.client_secret, {
          payment_method: paymentMethodId,
        })
        .then((result) => {
          if (result.error) {
            // start code flow to handle updating the payment details
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc)
            throw result.error;
          } else {
            if (result?.setupIntent?.status === 'succeeded') {
              // There's a risk of the customer closing the window before callback
              // execution. To handle this case, set up a webhook endpoint and
              // listen to invoice.payment_succeeded. This webhook endpoint
              // returns an Invoice.
              return {
                subscription: subscription,
                invoice: invoice,
                paymentMethodId: paymentMethodId,
                customerId,
              };
            } else {
              throw new Error('Setup intent could not be confirmed.');
            }
          }
        });
    } else {
      // No customer action needed
      return { subscription, paymentMethodId, customerId };
    }
  };

  function handleRequiresPaymentMethod({
    invoice,
    subscription,
    paymentMethodId,
    customerId,
  }: PaymentInfo) {
    if (
      subscription &&
      (subscription.status === 'active' || subscription.status === 'trialing')
    ) {
      // subscription is active, no customer actions required.
      return { subscription, paymentMethodId, customerId };
    }

    const paymentIntent =
      invoice?.payment_intent ||
      subscription?.pending_setup_intent ||
      subscription?.latest_invoice?.payment_intent;

    if (paymentIntent.status === 'requires_payment_method') {
      // Using localStorage to store the state of the retry here
      // (feel free to replace with what you prefer)
      // Store the latest invoice ID and status
      localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id);
      localStorage.setItem(
        'latestInvoicePaymentIntentStatus',
        paymentIntent.status,
      );
      throw new Error('Your card was declined.');
    } else {
      return { subscription, paymentMethodId, customerId };
    }
  }

  function retryInvoiceWithNewPaymentMethod({
    paymentMethodId,
    invoiceId,
    customerId,
  }: any) {
    return (
      retryInvoice({
        customerId,
        paymentMethodId,
        invoiceId,
      })
        // If the card is declined, display an error to the user.
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer.
            throw result.error;
          }
          return result;
        })
        // Normalize the result to contain the object returned by Stripe.
        // Add the addional details we need.
        .then((result) => {
          const info: PaymentInfo = {
            // Use the Stripe 'object' property on the
            // returned result to understand what object is returned.
            invoice: result,
            paymentMethodId: paymentMethodId,
            isRetry: true,
            customerId,
          };

          return info;
        })
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        .then(handlePaymentThatRequiresCustomerAction)
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
    );
  }

  function onSubscriptionComplete(result: PaymentInfo) {
    // Payment was successful. Provision access to your service.
    // Remove invoice from localstorage because payment is now complete.
    // clearCache();
    if (result && !result.subscription) {
      const subscription = { id: result.invoice.subscription };
      result.subscription = subscription;

      localStorage.removeItem('latestInvoiceId');
      localStorage.removeItem('latestInvoicePaymentIntentStatus');
    }

    sendEvent({
      id: 'premium-account-created',
    });
  }

  function createSubscription({
    customerId,
    paymentMethodId,
    billingType,
    isPurchaseNow,
    facilitatorsQuanitity,
  }: CreateSubscriptionProps) {
    const requestParams = {
      customerId,
      paymentMethodId,
      billingType,
      isPurchaseNow,
      facilitatorsQuanitity,
    };

    return (
      createSubscriptionRequest(requestParams)
        // If the card is declined, display an error to the user.
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer
            throw result.error;
          }
          return result;
        })
        // Normalize the result to contain the object returned
        // by Stripe. Add the addional details we need.
        .then((result) => {
          const info: PaymentInfo = {
            // Use the Stripe 'object' property on the
            // returned result to understand what object is returned.
            subscription: result,
            paymentMethodId,
            customerId,
          };

          return info;
        })
        // Some payment methods require a customer to do additional
        // authentication with their financial institution.
        // Eg: 2FA for cards.
        .then(handlePaymentThatRequiresCustomerAction)
        // If attaching this card to a Customer object succeeds,
        // but attempts to charge the customer fail. You will
        // get a requires_payment_method error.
        .then(handleRequiresPaymentMethod)
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
    );
  }

  return {
    createSubscription,
    retryInvoiceWithNewPaymentMethod,
  };
};
