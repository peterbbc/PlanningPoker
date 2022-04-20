import {
  ButtonLink,
  Paragraph,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import cx from 'classnames';
import React, { useContext } from 'react';
import { CardSelector } from '../../../components/organisms/CardSelector/CardSelector';
import { updateCurrentUser } from '../../../spaces/auth/data/user';
import {
  showCards,
  vote,
} from '../../../spaces/poker-table/actions/playerActions';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';
import { SidebarStateContext } from '../SidebarLayoutWrapper/SidebarLayoutWrapper';

import styles from './Panel.module.scss';

interface PanelProps {
  onSelectCard?: (card: string | null) => void;
}

const Panel: React.FC<PanelProps> = ({ onSelectCard }) => {
  const { pokerTable, currentPlayer, isOnCountdown } = useCurrentTable();
  const [isSidebarOpen] = useContext(SidebarStateContext);

  function handleCardSelectorChange(card: string | null) {
    if (pokerTable.id) {
      vote(pokerTable.id, card);
    }

    if (onSelectCard) {
      onSelectCard(card);
    }
  }

  const handleDeactivateSpectator = () => {
    updateCurrentUser({ isSpectator: false });
  };

  if (currentPlayer === null) return null;

  if (currentPlayer?.isSpectator) {
    return (
      <div className={styles['spectator-mode-container']}>
        <Paragraph align="center" sizeSmallScreen="micro">
          You are in spectator mode 👁
        </Paragraph>
        <VerticalSpacing spacing="spacing-xxs" />
        <Paragraph align="center" sizeSmallScreen="micro">
          <ButtonLink
            className={styles['deactivate-button']}
            onClick={handleDeactivateSpectator}
          >
            Deactivate
          </ButtonLink>
        </Paragraph>
      </div>
    );
  }
  function handleShowCardsButton() {
    showCards(pokerTable, { isSidebarOpen: !!isSidebarOpen }, true);
  }

  const currentPlayerCanShowCards =
    !pokerTable.whoCanShowCards ||
    (currentPlayer && pokerTable.whoCanShowCards.includes(currentPlayer.uid));

  return (
    <div
      className={cx(styles['panel'], !pokerTable.cardsUp && styles['is-open'])}
    >
      <div className={styles['card-list-label']}>
        {isOnCountdown || pokerTable.cardsUp ? (
          <div className={styles['counting-votes-label-container']}>
            <span className={styles['counting-votes-label']}>
              Counting votes...
            </span>
            {currentPlayerCanShowCards && (
              <div className={styles['count-now-button']}>
                <ButtonLink onClick={handleShowCardsButton}>
                  Count now
                </ButtonLink>
              </div>
            )}
          </div>
        ) : (
          <>
            Choose your card{' '}
            <span role="img" aria-label="point below">
              👇
            </span>
          </>
        )}
      </div>
      <div className={styles['card-list-container']}>
        <CardSelector
          cards={pokerTable.deck}
          isDisabled={!!pokerTable.cardsUp}
          onChange={handleCardSelectorChange}
          value={currentPlayer && currentPlayer.vote}
        />
      </div>
    </div>
  );
};

export default Panel;
