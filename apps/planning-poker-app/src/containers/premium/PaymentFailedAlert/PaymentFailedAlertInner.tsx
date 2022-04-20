import { useStripe } from '@stripe/react-stripe-js';
import {
  Button,
  ButtonLink,
  InlineAlert,
  Paragraph,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useNotification } from '../../../spaces/notifications/useNotification';
import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from '../../../vendors/hotjar/identify';

import styles from './PaymentFailedAlert.module.scss';

export const PaymentFailedAlertInner = () => {
  const { user } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingVerification, setIsLoadingVerification] = useState(false);
  const [isRequiresAction, setIsRequiresAction] = useState(false);
  const [
    isMyAccountModalOpen,
    setIsMyAccountModalOpen,
  ] = useAppContext().myAccountModal;
  const [isPricingModalOpen] = useAppContext().pricingModal;

  const { showNotification } = useNotification();

  const stripe = useStripe();

  const isSubscripitonFailed =
    user?.subscriptionStatus === 'past_due' ||
    user?.subscriptionStatus === 'unpaid' ||
    user?.subscriptionStatus === 'incomplete';

  const lastFailedPaymentIntentRequiresAction =
    user?.lastFailedPaymentIntent?.status === 'requires_action';
  user?.lastFailedPaymentIntent?.status === 'requires_confirmation';

  useEffect(() => {
    setIsRequiresAction(lastFailedPaymentIntentRequiresAction);
  }, [lastFailedPaymentIntentRequiresAction]);

  useEffect(() => {
    if (isSubscripitonFailed && !isMyAccountModalOpen && !isPricingModalOpen) {
      setIsOpen(true);

      hotjarIdentify(HOTJAR_IDENTIFY_KEYS.PAYMENT_FAILED_ALERT);
    } else {
      setIsOpen(false);
    }
  }, [isSubscripitonFailed, isMyAccountModalOpen, isPricingModalOpen]);

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

        setIsLoadingVerification(false);
        showNotification({
          title: 'Payment confirmed',
          content: 'You successfully fixed your last payment.',
        });
        setIsOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!isOpen) return null;

  // TODO: detect if reson is requires_action

  return (
    <div className={styles.alert}>
      {isRequiresAction ? (
        <InlineAlert
          title="Please validate the payment of your last invoice"
          style="info"
          content={
            <>
              <Paragraph color="info">
                Your bank requires 3d Secure verifiaction of your last invoice.
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
      ) : (
        <InlineAlert
          content={
            <>
              Your last payment failed. Please,{' '}
              <ButtonLink
                buttonColor="danger"
                onClick={() => {
                  setIsOpen(false);
                  setIsMyAccountModalOpen(true);
                }}
              >
                update your payment method
              </ButtonLink>{' '}
              to fix your premium plan.
            </>
          }
        />
      )}
    </div>
  );
};
