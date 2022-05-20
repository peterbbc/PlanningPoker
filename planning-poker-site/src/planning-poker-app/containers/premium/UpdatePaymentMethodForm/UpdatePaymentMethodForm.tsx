import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, InlineAlert, VerticalSpacing } from '../../../../packages/react-base';
import React, { FormEvent, useState } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useNotification } from '../../../spaces/notifications/useNotification';
import { retryInvoice } from '../../../spaces/premium/data/retryInvoice';
import { updatePaymentMethod as updatePaymentMethodAction } from '../../../spaces/premium/data/updatePaymentMethod';

import { StripeCardElement } from '../../../components/molecules/StripeCardElement/StripeCardElement';

type PaymentInfo = {
  invoice?: any;
  subscription?: any;
  paymentMethodId: any;
  customerId: string;
  isRetry?: boolean;
};
interface UpdatePaymentMethodFormProps {
  onSuccess: () => void;
}
export const UpdatePaymentMethodForm = ({
  onSuccess,
}: UpdatePaymentMethodFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardComplete, setCardComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  const { user } = useCurrentUser();

  const { showNotification } = useNotification();

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
            customerId,
            isRetry: true,
          };

          return info;
        })
    );
  }
  function handleSubscriptionThatRequiresPaymentMethod({
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

    if (paymentIntent?.status === 'requires_payment_method') {
      // Using localStorage to store the state of the retry here
      // (feel free to replace with what you prefer)
      // Store the latest invoice ID and status
      return retryInvoiceWithNewPaymentMethod({
        customerId,
        paymentMethodId,
        invoiceId: subscription.latest_invoice.id,
      });
    } else {
      return { subscription, paymentMethodId, customerId };
    }
  }

  const onUpdateComplete = (result: PaymentInfo) => {
    setIsLoading(false);

    if (result && !result.subscription) {
      const subscription = { id: result.invoice.subscription };
      result.subscription = subscription;

      localStorage.removeItem('latestInvoiceId');
      localStorage.removeItem('latestInvoicePaymentIntentStatus');
    }

    showNotification({
      title: 'New payment method changed successfully.',
      content: 'Next invoices will be billed to the new payment method.',
    });
    onSuccess();
  };

  const updatePaymentMethod = async ({ paymentMethodId, customerId }: any) => {
    updatePaymentMethodAction({
      paymentMethodId,
    })
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
          customerId,
          subscription: result?.subscription,
          paymentMethodId,
        };

        return info;
      })
      // Try to pay alst invoice if failed
      // >>>>>>> TODO: Or create a setup intent if subscription is active tov erify payment method, O ja es fa automaticament??
      .then(handleSubscriptionThatRequiresPaymentMethod)
      // Some payment methods require a customer to do additional
      // authentication with their financial institution.
      // Eg: 2FA for cards.
      .then(handlePaymentThatRequiresCustomerAction)
      // If attaching this card to a Customer object succeeds,
      // but attempts to charge the customer fail. You will
      // get a requires_payment_method error.
      // .then(handleRequiresPaymentMethod)
      // No more actions required. Provision your service for the user.
      .then(onUpdateComplete)
      .catch((error) => {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        console.error(error);
        setIsLoading(false);
        setError({
          message:
            error?.message ||
            `We found an error while validating your payment. Code: ${error?.error?.decline_code}`,
        });
      });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const customerId = user?.customerId;

    setIsLoading(true);

    if (!stripe || !elements || isLoading || !customerId) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setIsLoading(false);

      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsLoading(false);

      return;
    }

    if (!cardComplete) {
      setError({
        message: 'Card details are not valid.',
      });
      setIsLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error || !paymentMethod) {
      console.error('[createPaymentMethod error]', error);
      setError({
        ...error,
        message: error?.message || 'Error when creating payment method.',
      });

      setIsLoading(false);

      return;
    }

    const paymentMethodId = paymentMethod.id;

    updatePaymentMethod({ paymentMethodId, customerId });
  };
  return (
    <form onSubmit={handleSubmit}>
      <StripeCardElement
        onChange={(e) => {
          if (e.error) {
            showNotification({
              style: 'error',
              title: e.error.message || 'An error happened.',
            });
          }

          setCardComplete(e.complete);
        }}
        options={{ disabled: isLoading }}
      />
      <VerticalSpacing spacing="spacing-xxl-2" />
      {error && (
        <>
          <InlineAlert content={error.message} />
          <VerticalSpacing spacing="spacing-xl" />
        </>
      )}
      <Button
        isBlock
        isLoading={isLoading}
        buttonType="submit"
        isDisabled={!stripe}
      >
        Confirm new payment method
      </Button>
    </form>
  );
};
