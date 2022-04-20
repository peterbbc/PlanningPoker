import { Icon, Modal, VerticalSpacing } from '@we-agile-you/react-base';
import React, { useEffect, useState } from 'react';

import { PokerTableSummary } from '@we-agile-you/types-planning-poker';
import { List, ListElement } from './List';
import styles from './MyGamesModal.module.scss';
import { Tabs } from './Tabs';
import { ConfirmDeleteGameModal } from './ConfirmDeleteGameModal';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { getCurrentUserGamesCreated } from '../../spaces/auth/data/user';
import { DEFAULT_GAME_NAME } from '../../spaces/poker-table/constants';
import { useCurrentTable } from '../../spaces/poker-table/hooks/useCurrentTable';
import { navigate } from 'gatsby';
import { getMonthWithDayAndYearAndTimeInLocalTime } from '@we-agile-you/js-base';

interface MyGamesModalProps {
  onClose: () => void;
}

export const MyGamesModal = ({ onClose }: MyGamesModalProps) => {
  const { isFacilitator, uid, user } = useCurrentUser();
  const { pokerTable } = useCurrentTable();
  const [currentTab, setCurrentTab] = useState('last-games');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<
    false | ListElement
  >(false);
  const [gamesCreated, setGamesCreated] = useState<PokerTableSummary[] | null>(
    null,
  );

  useEffect(() => {
    if (uid && !gamesCreated) {
      getCurrentUserGamesCreated().then((games) => {
        setGamesCreated(games);
      });
    }
  }, [uid, gamesCreated]);

  // useEffect(() => {
  //   const gamesIds = (user?.gameHistory || [])
  //     .slice(0, 9)
  //     .map((game) => game.id);

  //   console.log(gamesIds);
  //   getPokerTableSummariesByIds(gamesIds)
  //     .then((games) => {
  //       const sortedGames = gamesIds.map(
  //         (gameId) =>
  //           games.find((game) => game.id === gameId) as PokerTableSummary,
  //       );

  //       setGamesHistory(sortedGames ? sortedGames : []);
  //     })
  //     .catch(() => setGamesHistory([]));
  // }, [user?.gameHistory]);

  const handleCloseModal = () => {
    onClose();
  };

  const handleGameDelete = (game: ListElement) => {
    setIsConfirmModalOpen(game);
  };

  if (!isFacilitator) {
    return null;
  }

  return (
    <>
      <Modal
        onClose={handleCloseModal}
        titleTopBar={
          <div className={styles['top-bar-content']}>
            <div className={styles['top-bar-title']}>
              <Icon icon="cards" />
              <span className={styles['title-span']}>My Games</span>
            </div>
            <div className={styles.tabs}>
              <Tabs
                selectedTab={currentTab}
                elements={[
                  { name: 'Last games', id: 'last-games' },
                  { name: 'Created games', id: 'created-games' },
                ]}
                onChange={(id) => setCurrentTab(id)}
              />
            </div>
          </div>
        }
        width="big"
        height="full-height"
      >
        <div>
          <VerticalSpacing spacing="spacing-xxl-4" />
          <VerticalSpacing spacing="spacing-xxl-4" />
          {currentTab === 'last-games' ? (
            <div>
              {user?.gameHistory && user?.gameHistory.length > 0 ? (
                <List
                  onLinkClick={() => handleCloseModal()}
                  elements={user?.gameHistory.map((game) => ({
                    name: game.name || DEFAULT_GAME_NAME,
                    id: game.id,
                    to: `/${game.id}`,
                    meta: game.lastJoinedAtMilis
                      ? `Last joined at ${getMonthWithDayAndYearAndTimeInLocalTime(
                          new Date(game.lastJoinedAtMilis),
                        )}`
                      : `${game.id}`,
                    onDelete: !!gamesCreated?.find(
                      (_game) => game.id === _game.id,
                    )
                      ? handleGameDelete
                      : undefined,
                  }))}
                />
              ) : (
                <div className={styles['empty-message']}>
                  You haven´t joined any game, when you do it will appear here.
                </div>
              )}
            </div>
          ) : (
            <div>
              {gamesCreated === null ? (
                <div className={styles['empty-message']}>Loading</div>
              ) : gamesCreated && gamesCreated.length > 0 ? (
                <List
                  onLinkClick={() => handleCloseModal()}
                  elements={gamesCreated.map((game) => ({
                    id: game.id,
                    name: game.name || DEFAULT_GAME_NAME,
                    to: `/${game.id}`,
                    meta: game.createdAt
                      ? `Created at ${getMonthWithDayAndYearAndTimeInLocalTime(
                          game.createdAt,
                        )}`
                      : `${game.id}`,
                    onDelete: handleGameDelete,
                  }))}
                />
              ) : (
                <div className={styles['empty-message']}>
                  You haven´t created any game, when you do it will appear here.
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
      {isConfirmModalOpen && (
        <ConfirmDeleteGameModal
          onGameDeleted={() => {
            if (isConfirmModalOpen.id === pokerTable.id) {
              navigate(`/`);

              return;
            }
            setIsConfirmModalOpen(false);
            getCurrentUserGamesCreated().then((games) => {
              setGamesCreated(games);
            });
          }}
          onClose={() => setIsConfirmModalOpen(false)}
          gameId={isConfirmModalOpen.id}
        />
      )}
    </>
  );
};
