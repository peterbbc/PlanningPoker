import { useStripe } from '@stripe/react-stripe-js';
import {
  ButtonLink,
  VerticalSpacing,
  FlexBox,
  InlineAlert,
  Button,
  Paragraph,
} from '@we-agile-you/react-base';
import { User } from '@we-agile-you/types-planning-poker';
import React, { useState } from 'react';

import { UpdatePaymentMethodModal } from '../../premium/UpdatePaymentMethodModal/UpdatePaymentMethodModal';
import styles from '../MyAccount.module.scss';

interface PaymentMethodProps {
  user: User;
}
export const PaymentMethod: React.FC<PaymentMethodProps> = ({ user }) => {
  const [isUpdatePaymentModalOpen, setIsUpdatePaymentModalOpen] = useState(
    false,
  );
  const [isLoadingVerification, setIsLoadingVerification] = useState(false);
  const stripe = useStripe();

  const handleAllowPaymentClick = async () => {
    if (!stripe || !user?.lastFailedPaymentIntent) return;

    setIsLoadingVerification(true);

    await stripe
      .confirmCardPayment(user.lastFailedPaymentIntent.client_secret)
      .then((result) => {
        if (result.error) {
          // Start code flow to handle updating the payment details.
          // Display error message in your UI.
          // The card was declined (i.e. insufficient funds, card has expired, etc).
          throw result;
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoadingVerification(false);
      });
  };

  const lastFailedPaymentIntentRequiresAction =
    user?.lastFailedPaymentIntent?.status === 'requires_action';
  user?.lastFailedPaymentIntent?.status === 'requires_confirmation';

  return (
    <div className={styles['subsection']}>
      {(user.subscriptionStatus === 'unpaid' ||
        user.subscriptionStatus === 'past_due' ||
        user.subscriptionStatus === 'incomplete') &&
        (lastFailedPaymentIntentRequiresAction ? (
          <>
            <InlineAlert
              title="Please validate the payment of your last invoice"
              style="info"
              content={
                <>
                  <Paragraph color="info">
                    Your bank requires 3d Secure verifiaction of your last
                    invoice.
                  </Paragraph>
                  <VerticalSpacing spacing="spacing-m" />
                  <Button
                    isLoading={isLoadingVerification}
                    isBlock
                    onClick={handleAllowPaymentClick}
                  >
                    Verify payment
                  </Button>
                </>
              }
            />
            <VerticalSpacing spacing="spacing-l" />
          </>
        ) : (
          <>
            <InlineAlert
              title="Your last payment failed."
              content="Please, change your payment method"
            />
            <VerticalSpacing spacing="spacing-l" />
          </>
        ))}
      {user.paymentMethodType && user.subscriptionStatus !== 'canceled' && (
        <FlexBox justifyContent="space-between">
          <div>
            <h3 className={styles['section-subtitle']}>Payment method</h3>
            <p className={styles['section-value']}>
              {user.paymentMethodType} [{user.paymentMethodCardBrand}] **** ****
              ***** {user.paymentMethodCardLast4}
            </p>
          </div>
          <div>
            <ButtonLink onClick={() => setIsUpdatePaymentModalOpen(true)}>
              Change
            </ButtonLink>
          </div>
        </FlexBox>
      )}

      {isUpdatePaymentModalOpen && (
        <UpdatePaymentMethodModal
          onClose={() => setIsUpdatePaymentModalOpen(false)}
        />
      )}
    </div>
  );
};
