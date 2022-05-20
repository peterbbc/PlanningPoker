import { Button, Header4 } from '../../../../../packages/react-base';
import React, { useContext, useState } from 'react';
import { useAppContext } from '../../../../spaces/app/hooks/useAppContext';
import {
  hideCards as hideCardsData,
  showCards,
} from '../../../../spaces/poker-table/actions/playerActions';
import {
  cancelTimerForGame,
  startTimerForGame,
} from '../../../../spaces/poker-table/data/poker';
import { useCurrentTable } from '../../../../spaces/poker-table/hooks/useCurrentTable';
import { useIssueActions } from '../../../../spaces/poker-table/hooks/useIssueActions';

import { SidebarStateContext } from '../../SidebarLayoutWrapper/SidebarLayoutWrapper';
import styles from '../Table.module.scss';

export const TableContent = () => {
  const {
    pokerTable,
    isVoting,
    isOnCountdown,
    currentPlayer,
    currentIssueIndex,
  } = useCurrentTable();
  const [isHidingCards, setIsHidingCards] = useState(false);
  const [isSidebarOpen] = useContext(SidebarStateContext);
  const { voteNextIssue, unsetVotingIssue } = useIssueActions();
  const setIsPricingModalOpen = useAppContext().pricingModal[1];

  const haveMoreTicketsToVote =
    !!pokerTable.issues &&
    currentIssueIndex !== null &&
    currentIssueIndex + 1 < pokerTable.issues?.length;
  const isVotingIssue = currentIssueIndex !== null;

  const hideCards = async () => {
    if (!pokerTable.id) return;

    setIsHidingCards(true);

    await hideCardsData(pokerTable.id);

    setIsHidingCards(false);
  };

  const handleVotingStarted = async () => {
    if (
      !pokerTable.id ||
      !pokerTable.timerDurationMinutes ||
      !pokerTable.timerAutoRestart
    )
      return;

    startTimerForGame(pokerTable.id, pokerTable.timerDurationMinutes);
  };
  const handleNewVotingEnded = async () => {
    if (
      !pokerTable.id ||
      !pokerTable.timerDurationMinutes ||
      !pokerTable.timerAutoRestart
    )
      return;

    cancelTimerForGame(pokerTable.id);
  };
  async function handleNewVotingClick() {
    hideCards();
    handleVotingStarted();

    if (isVotingIssue) unsetVotingIssue();
  }

  const handleVoteNextTicketClick = () => {
    hideCards();
    voteNextIssue();
    handleVotingStarted();
  };

  function handleShowCardsButton() {
    showCards(pokerTable, { isSidebarOpen: !!isSidebarOpen });
    handleNewVotingEnded();
  }

  const currentPlayerCanShowCards =
    !pokerTable.whoCanShowCards ||
    (currentPlayer && pokerTable.whoCanShowCards.includes(currentPlayer.uid));

  if (
    pokerTable.isGameOver === true ||
    pokerTable.isSomePlayersReachedFreeLimit
  ) {
    return (
      <div className={styles['show-cards-wrapper']}>
        <Button onClick={() => setIsPricingModalOpen(true)}>Go premium</Button>
      </div>
    );
  }

  if (pokerTable.cardsUp) {
    if (currentPlayerCanShowCards) {
      const isLastIssue = isVotingIssue && !haveMoreTicketsToVote;
      let label = haveMoreTicketsToVote
        ? 'Vote next issue'
        : 'Start new voting';
      const labelSmall = haveMoreTicketsToVote ? 'Next issue' : 'New voting';
      const labelSuperSmall = haveMoreTicketsToVote ? 'Next' : 'Reset';
      if (isLastIssue) {
        label = 'Start new voting';
      }
      return (
        <div className={styles['show-cards-wrapper']}>
          <div>
            <Button
              onClick={
                haveMoreTicketsToVote
                  ? handleVoteNextTicketClick
                  : handleNewVotingClick
              }
              isLoading={isHidingCards}
              className={styles['button-reset']}
            >
              <span className={styles['label-super-small-screen']}>
                {labelSuperSmall}
              </span>
              <span className={styles['label-small-screen']}>{labelSmall}</span>
              <span className={styles['label-big-screen']}>{label}</span>
            </Button>
          </div>
        </div>
      );
    }

    return <div className={styles['table-caption']}>Voting finished</div>;
  }

  if (!isVoting) {
    return <div className={styles['table-caption']}>Pick your cards!</div>;
  }

  if (isOnCountdown) {
    return (
      <div className={styles['show-cards-wrapper']}>
        <Header4 color="primary">{pokerTable.cardsUpCountdown}</Header4>
      </div>
    );
  }

  return currentPlayerCanShowCards ? (
    <div className={styles['show-cards-wrapper']}>
      <Button onClick={handleShowCardsButton}>
        <span className={styles['label-super-small-screen']}>Reveal</span>
        <span className={styles['label-small-screen']}>Reveal cards</span>
        <span className={styles['label-big-screen']}>Reveal cards</span>
      </Button>
    </div>
  ) : (
    <div className={styles['table-caption']}>Voting in progress</div>
  );
};
