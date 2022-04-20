import {
  FlexBox,
  Header4,
  HoritzontalSpacing,
  Modal,
  Paragraph,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React, { useEffect } from 'react';
import { Loader } from '../../../components/molecules/Loader/Loader';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useProceedToPayment } from '../../../spaces/premium/hooks/useProceedToPayment';

import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from '../../../vendors/hotjar/identify';
import { Plan } from './Plan/Plan';

import styles from './PricingModal.module.scss';

interface PricingModalProps {
  onClose: () => void;
}

export const PricingModal = ({ onClose }: PricingModalProps) => {
  const { uid } = useCurrentUser();

  const handleClose = () => {
    onClose();
  };

  const { handlePlansProceedClick, isLoading } = useProceedToPayment();

  useEffect(() => {
    if (uid) {
      hotjarIdentify(HOTJAR_IDENTIFY_KEYS.OPENED_PRICING_MODAL, uid);
    }
  }, [uid]);

  return (
    <Modal onClose={handleClose} width={'bigger'}>
      <Header4>Upgrade Planning Poker Online</Header4>
      {isLoading ? (
        <>
          <VerticalSpacing spacing="spacing-xxl" />
          <FlexBox justifyContent="center">
            <Loader message="Just a few seconds..." />
          </FlexBox>
        </>
      ) : (
        <>
          <VerticalSpacing spacing="spacing-xs" />
          <Paragraph>Pay per month or year and cancel anytime.</Paragraph>
          <VerticalSpacing spacing="spacing-xxl-2" />
          <FlexBox
            className={styles.plans}
            justifyContent="center"
            alignItems="strech"
          >
            <Plan
              plan="basic"
              key="basic"
              onProceed={handlePlansProceedClick}
              onClose={onClose}
            />
            <HoritzontalSpacing
              className={styles.spacing}
              spacing="spacing-l"
            />
            <Plan
              plan="premium"
              key="premium"
              onProceed={handlePlansProceedClick}
              isLoading={!!isLoading}
              onClose={onClose}
            />
          </FlexBox>
        </>
      )}
    </Modal>
  );
};
