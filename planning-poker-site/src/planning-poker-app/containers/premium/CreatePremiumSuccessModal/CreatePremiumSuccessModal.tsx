import { Modal, SubmitRow } from '../../../../packages/react-base';
import React from 'react';
import { RobotImage } from '../../../components/atoms/RobotImage/RobotImage';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';

import styles from './SubscribeSuccess.module.scss';

interface PricingModalProps {
  onClose: () => void;
}

export const CreatePremiumSuccessModal = ({ onClose }: PricingModalProps) => {
  const appContext = useAppContext();
  const { user } = useCurrentUser();

  const setIsMyAccountModalOpen = appContext.myAccountModal[1];
  const setIsManageFacilitatorsModalOpen =
    appContext.manageFacilitatorsModal[1];

  const facilitatorsQuantity = user?.subscriptionFacilitatorsQuantity;

  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <RobotImage
          image="happy-robot"
          alt="Happy robot"
          className={styles.image}
        />
        <div className={styles.title}>Congratulations!</div>
        <div className={styles.subtitle}>You are now premium</div>
        {typeof facilitatorsQuantity === 'number' &&
        facilitatorsQuantity > 1 ? (
          <SubmitRow
            cancelLabel="Done"
            onConfirm={() => {
              setIsManageFacilitatorsModalOpen(true);
              onClose();
            }}
            confirmLabel="Manage facilitators"
            onCancel={onClose}
            align="strech"
          />
        ) : (
          <SubmitRow
            cancelLabel="Go to my account"
            onCancel={() => {
              setIsMyAccountModalOpen(true);
              onClose();
            }}
            confirmLabel="Done"
            onConfirm={onClose}
            align="strech"
          />
        )}
      </div>
    </Modal>
  );
};
