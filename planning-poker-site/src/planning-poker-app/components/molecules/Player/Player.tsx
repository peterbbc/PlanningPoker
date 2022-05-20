import cx from 'classnames';
import React from 'react';

import { Player as PlayerType } from '../../../../packages/types-planning-poker';
import styles from './Player.module.scss';
import Card from '../Card/Card';
import { Icon, ProfileImage } from '../../../../packages/react-base';

export enum PlayerPosition {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

interface PlayerProps {
  player: PlayerType;
  position: PlayerPosition;
  cardUp?: boolean;
  onClick?: () => void;
  layout: 'horizontal' | 'vertical';
}

const Player = ({ player, position, cardUp, onClick, layout }: PlayerProps) => {
  const { displayName, profilePictureUrl } = player;
  const className = cx(
    styles['player-wrapper'],
    styles[position],
    !displayName && styles['no-display-name'],
  );

  const tooltipLabel =
    displayName?.length &&
    displayName.length > 10 &&
    layout === 'vertical' &&
    (position === 'left' || position === 'right')
      ? displayName.slice(0, 8)
      : displayName;

  return (
    <div className={className} onClick={onClick}>
      {player.isSpectator ? (
        <div className={cx(styles['card-container'], styles['is-spectator'])}>
          <Icon icon="eye2" />
        </div>
      ) : (
        <div
          className={cx(
            styles['card-container'],
            !player.vote && styles['is-empty'],
          )}
        >
          {!!player.vote && <Card card={player.vote} isDownwards={!cardUp} />}
        </div>
      )}

      {profilePictureUrl ? (
        <div className={styles['profile-picture']}>
          <ProfileImage
            size="l"
            src={profilePictureUrl}
            alt={displayName}
            tooltip={`${tooltipLabel}${
              tooltipLabel?.length !== displayName?.length ? '..' : ''
            }`}
          />
        </div>
      ) : (
        <div
          className={cx(styles['player-name'], 'notranslate')}
          translate="no"
        >
          {displayName}
        </div>
      )}
    </div>
  );
};

export default Player;
