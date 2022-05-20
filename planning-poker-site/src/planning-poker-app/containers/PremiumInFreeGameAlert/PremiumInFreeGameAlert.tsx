import React from 'react';
import { ButtonLink, HoritzontalSpacing, Icon } from '../../../packages/react-base';

import styles from './PremiumInFreeGameAlert.module.scss';
import { useCurrentTable } from '../../spaces/poker-table/hooks/useCurrentTable';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { useAppContext } from '../../spaces/app/hooks/useAppContext';

export const PremiumInFreeGameAlert = () => {
  const { pokerTable } = useCurrentTable();
  const { isPremium } = useCurrentUser();

  const setSettingsModalisOpen = useAppContext().settingsModal[1];

  const showAlert = pokerTable.isPremium === false && isPremium === true;

  const ownerId = pokerTable.ownerId;
  const player = pokerTable.playersAll.find((player) => player.uid === ownerId);

  const ownerName = player?.displayName || 'another user';

  if (!showAlert) return null;

  return (
    <div className={styles['premium-in-free-game-alert']}>
      <Icon icon="info" />
      <HoritzontalSpacing spacing="spacing-s" />
      <p>{`This is a free game created by ${ownerName}. Set yourself as the facilitator of the game to make it premium at game settings.`}</p>
      <HoritzontalSpacing spacing="spacing-s" />
      <ButtonLink
        buttonColor="light"
        size="small"
        onClick={() => setSettingsModalisOpen(true)}
      >
        Go to game settings
      </ButtonLink>
    </div>
  );
};
