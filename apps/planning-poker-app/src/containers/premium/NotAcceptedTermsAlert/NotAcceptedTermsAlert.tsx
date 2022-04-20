import {
  InlineAlert,
  Paragraph,
  SubmitRow,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React, { useEffect, useState } from 'react';
import { updateCurrentUser } from '../../../spaces/auth/data/user';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import styles from './NotAcceptedTermsAlert.module.scss';

export const NotAcceptedTermsAlert = () => {
  const { user } = useCurrentUser();
  const [isOpen, setIsOpen] = useState<null | boolean>(null);

  useEffect(() => {
    if (isOpen !== null) return;

    if (
      (user?.subscriptionStatus === 'active' ||
        user?.subscriptionStatus === 'trialing') &&
      user.customerAcceptedTerms !== 'v1'
    ) {
      setIsOpen(true);
    }
  }, [user, isOpen]);

  const handleConfirm = () => {
    updateCurrentUser({ customerAcceptedTerms: 'v1' });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.alert}>
      <InlineAlert
        title="Please accept our new terms and conditions"
        style="info"
        content={
          <>
            <Paragraph color="info">
              Please read and accept our new{' '}
              <a href="/terms-and-conditions" target="_blank">
                terms and conditions
              </a>
              .
            </Paragraph>
            <VerticalSpacing spacing="spacing-m" />
            <SubmitRow
              confirmLabel="Accept new terms and conditions"
              cancelLabel="Close"
              onCancel={() => setIsOpen(false)}
              onConfirm={handleConfirm}
            />
          </>
        }
      />
    </div>
  );
};
