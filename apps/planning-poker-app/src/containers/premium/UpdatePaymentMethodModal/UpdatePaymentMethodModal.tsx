import {
  Modal,
  ModalTitle,
  Paragraph,
  VerticalSpacing,
  InlineAlert,
} from '@we-agile-you/react-base';
import React from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';

import { StripeElementsProvider } from '../../../vendors/stripe/StripeElementsProvider';
import { UpdatePaymentMethodForm } from '../UpdatePaymentMethodForm/UpdatePaymentMethodForm';
import styles from './UpdatePaymentMethodModal.module.scss';

interface UpdatePaymentMethodModalProps {
  onClose: () => void;
}
export const UpdatePaymentMethodModal = ({
  onClose,
}: UpdatePaymentMethodModalProps) => {
  const { user } = useCurrentUser();
  return (
    <Modal width="medium" onClose={onClose}>
      <ModalTitle>Update payment method</ModalTitle>
      <Paragraph>
        Once you confirm, next invoices will be billed to this new payment
        method.
      </Paragraph>
      <VerticalSpacing spacing="spacing-xl" />

      {(user?.subscriptionStatus === 'unpaid' ||
        user?.subscriptionStatus === 'past_due' ||
        user?.subscriptionStatus === 'incomplete') && (
        <>
          <InlineAlert
            style="info"
            title="Fixing your premium plan."
            content="We will automatically fix the payment of your last invoice
        using the new payment method."
          />
          <VerticalSpacing spacing="spacing-m" />
        </>
      )}

      <div className={styles['checkout-form-wrapper']}>
        <StripeElementsProvider>
          <UpdatePaymentMethodForm onSuccess={onClose} />
        </StripeElementsProvider>
      </div>
    </Modal>
  );
};
