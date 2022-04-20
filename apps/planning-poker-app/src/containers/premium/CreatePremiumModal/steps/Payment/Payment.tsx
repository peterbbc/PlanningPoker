// Reference: https://github.com/stripe-samples/subscription-use-cases/tree/master/fixed-price-subscriptions

import React, { FormEvent, useState } from 'react';

import { CardElement, useElements } from '@stripe/react-stripe-js';
import { StripeCardElement, StripeElementChangeEvent } from '@stripe/stripe-js';
import { CheckoutForm } from '../../../../../components/organisms/CheckoutForm/CheckoutForm';
import { FormCheckbox, VerticalSpacing } from '@we-agile-you/react-base';

interface PaymentProps {
  isDisabled: boolean;
  errorMessage?: string;
  onSubmit: (cardElement: StripeCardElement | null) => void;
  onChangeCardComplete: (cardComplete: boolean) => void;
}

export const Payment = ({
  onSubmit,
  isDisabled,
  onChangeCardComplete,
  ...props
}: PaymentProps) => {
  const elements = useElements();
  const [cardError, setCardError] = useState<
    null | StripeElementChangeEvent['error']
  >(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSubmit(elements?.getElement(CardElement) || null);
  };

  const errorMessage = props.errorMessage || cardError?.message;

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <CheckoutForm
        isDisabled={isDisabled}
        isErrorMessage={errorMessage || false}
        onChange={(e) => {
          setCardError(e.error || null);
          onChangeCardComplete(e.complete);
        }}
      />
      <VerticalSpacing spacing="spacing-m" />
      <FormCheckbox
        id="terms-checkbox"
        required
        label={
          <>
            I have read and I agree to the{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://planningpokeronline.com/terms-and-conditions/"
            >
              Terms and conditions
            </a>
          </>
        }
      />
    </form>
  );
};
