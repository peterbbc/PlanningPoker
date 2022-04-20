import {
  Header4,
  Modal,
  Paragraph,
  SubmitRow,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React, { useEffect, useState } from 'react';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { useCurrentTable } from '../../spaces/poker-table/hooks/useCurrentTable';

import { useAppContext } from '../../spaces/app/hooks/useAppContext';

import robotImage from './happy_robot.svg';
import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from '../../vendors/hotjar/identify';

export const ModalAlerting = () => {
  const { pokerTable } = useCurrentTable();
  const { isPremium, uid, isFacilitator } = useCurrentUser();
  const setIsPricingModalOpen = useAppContext().pricingModal[1];

  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  const showPlayersReachedLimitAlert = !!pokerTable.isSomePlayersReachedFreeLimit;

  useEffect(() => {
    if (isOpen === null && showPlayersReachedLimitAlert) {
      setIsOpen(true);

      hotjarIdentify(HOTJAR_IDENTIFY_KEYS.REACHED_FREE_USERS_LIMIT, uid);
    }
    if (isOpen && !showPlayersReachedLimitAlert) {
      setIsOpen(null);
    }
  }, [isOpen, showPlayersReachedLimitAlert, uid]);

  const isLoading = !pokerTable.id || isPremium === null;

  if (
    isLoading ||
    pokerTable?.isPremium ||
    isPremium ||
    isFacilitator ||
    !isOpen
  )
    return null;

  return (
    <Modal onClose={() => setIsOpen(false)}>
      <Paragraph align="center">
        <img alt="Happy robot" src={robotImage} />
      </Paragraph>
      <VerticalSpacing spacing="spacing-xxl" />
      <Header4 align="center">Enjoying Planning Poker Online?</Header4>
      <VerticalSpacing spacing="spacing-xs" />
      <Paragraph align="center">
        We’ve noticed some of your teammates have used our free plan for a long
        time now. By supporting us, you make sure this service keeps existing
        and you keep your workflow efficient and fun.
      </Paragraph>
      <VerticalSpacing spacing="spacing-xxl" />
      <SubmitRow
        align="strech"
        cancelLabel="Not now"
        onCancel={() => setIsOpen(false)}
        confirmLabel="Go Premium"
        onConfirm={() => setIsPricingModalOpen(true)}
      />
    </Modal>
  );
};
