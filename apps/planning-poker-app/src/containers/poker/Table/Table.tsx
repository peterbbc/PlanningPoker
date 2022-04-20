import { ButtonLink } from '@we-agile-you/react-base';
import { Player as PlayerType } from '@we-agile-you/types-planning-poker';
import cx from 'classnames';
import React, { useRef } from 'react';
import Player, {
  PlayerPosition,
} from '../../../components/molecules/Player/Player';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';
import { usePlayerDistribution } from '../../../spaces/poker-table/hooks/usePlayerDistribution';

import { ShowCardsTooltip } from './ShowCardsTooltip';
import { StartNewGameTooltip } from './StartNewGameTooltip';
import styles from './Table.module.scss';
import { TableContent } from './TableContent/TableContent';

interface TableProps {
  layout: 'horizontal' | 'vertical';
}

const Table: React.FC<TableProps> = ({ layout }) => {
  const { pokerTable } = useCurrentTable();
  const { uid } = useCurrentUser();
  const { playerDistribution, totalPlayers } = usePlayerDistribution(layout);
  const tableRef = useRef<HTMLDivElement>(null);

  const isUserLonely = totalPlayers === 1 && pokerTable.players[0]?.uid === uid;

  const setIsInviteModalOpen = useAppContext().invitePlayersModal[1];

  const handleInviteClick = () => {
    setIsInviteModalOpen(true);
  };

  const renderPlayer = (player: PlayerType, position: PlayerPosition) => {
    return (
      <div className={styles['player-container']} key={player.uid}>
        <Player
          player={player}
          position={position}
          cardUp={!!pokerTable.cardsUp}
          layout={layout}
        />
      </div>
    );
  };

  const renderTopLane = () => {
    if (isUserLonely) {
      return (
        <div className={styles['invite-players-container']}>
          <div className={styles['invite-players-label']}>
            Feeling lonely?{' '}
            <span role="img" aria-label="sleeping">
              😴
            </span>
          </div>
          <div>
            <ButtonLink
              className={styles['invite-players-button']}
              onClick={handleInviteClick}
            >
              Invite players
            </ButtonLink>
          </div>
        </div>
      );
    }

    return playerDistribution.top.map((player) =>
      renderPlayer(player, PlayerPosition.Top),
    );
  };

  const isCrowded =
    !!pokerTable?.players?.length && pokerTable.players.length > 10;

  return (
    <div
      className={cx(styles.wrapper, isCrowded && styles['wrapper--is-crowded'])}
    >
      <div
        className={cx(
          styles.container,
          isUserLonely && styles['container--is-user-lonely'],
        )}
      >
        <div />
        <div className={cx(styles.top)}>{renderTopLane()}</div>
        <div />
        <div className={styles.left}>
          {playerDistribution.left.map((player) =>
            renderPlayer(player, PlayerPosition.Left),
          )}
        </div>
        <div className={styles.table}>
          <div className={styles['table-content']} ref={tableRef}>
            <TableContent />
            <ShowCardsTooltip refNode={tableRef} />
            <StartNewGameTooltip refNode={tableRef} />
          </div>
        </div>
        <div className={styles.right}>
          {playerDistribution.right.map((player) =>
            renderPlayer(player, PlayerPosition.Right),
          )}
        </div>
        <div />
        <div className={styles.bottom}>
          {playerDistribution.bottom.map((player) =>
            renderPlayer(player, PlayerPosition.Bottom),
          )}
        </div>
        <div />
      </div>
    </div>
  );
};

export default Table;
