import cx from 'classnames';
import React, { useRef } from 'react';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';
import { CardValueSide } from '../../molecules/CardValueSide/CardValueSide';

import styles from './CardSelector.module.scss';
import { CardSelectorTooltip } from './CardSelectorTooltip';

interface CardSelectorProps {
  cards: string[];
  value?: string | null;
  isDisabled?: boolean;
  onChange?: (card: string | null) => void;
}

export const CardSelector: React.FC<CardSelectorProps> = ({
  cards,
  onChange,
  value,
  isDisabled,
}) => {
  const cardListRef = useRef<HTMLUListElement>(null);
  const { isOnCountdown, pokerTable } = useCurrentTable();
  function renderCardItem(card: string, key: string) {
    const isActive = card === value;

    function handleCardClick(card: string) {
      if (isDisabled) return;

      if (onChange) {
        onChange(card !== value ? card : null);
      }
    }

    const className = cx(styles.card, {
      [styles.disabled]: isDisabled,
      [styles.selected]: isActive,
    });

    return (
      <li key={key} className={className}>
        <CardValueSide
          size="l"
          card={card}
          isButton
          isSelected={isActive}
          isDisabled={isOnCountdown || !!pokerTable.cardsUp}
          onClick={() => handleCardClick(card)}
        />
      </li>
    );
  }

  const className = cx(styles.container);

  return (
    <div className={className}>
      <ul ref={cardListRef} className={cx(styles.cardList)}>
        {cards.map((card, i) => renderCardItem(card, i.toString()))}
      </ul>

      <CardSelectorTooltip refNode={cardListRef} />
    </div>
  );
};
