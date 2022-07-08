import React from 'react';
import cx from 'classnames';
import emojiRegex from 'emoji-regex';

import styles from './CardValueSide.module.scss';

interface CardValueSideProps {
  card: string;
  size?: 'm' | 'l' | 'xl';
  isSelected?: boolean;
  isValueSideStyle?: boolean;
  isButton?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const regex = emojiRegex();

export const CardValueSide: React.FC<CardValueSideProps> = ({
  card,
  size,
  isSelected,
  isValueSideStyle,
  isButton,
  isDisabled,
  onClick,
}) => {
  const className = cx(
    styles.valueSide,
    isSelected && styles.isSelected,
    isValueSideStyle && styles.isValueSideStyle,
    isButton && styles.isButton,
    isDisabled && styles.isDisabled,
    size && styles[size],
    'notranslate',
  );

  let cardContent = <span>{card}</span>;

  const matches = card.matchAll(regex);

  let match = matches.next();

  if (match.value) {
    let cardString = card;

    while (match.value) {
      const emoji = match.value[0];
      cardString = cardString.replace(
        emoji,
        `<span style="font-weight: normal">${emoji}</span>`,
      );
      match = matches.next();
    }

    cardContent = <span dangerouslySetInnerHTML={{ __html: cardString }} />;
  }

  if (isButton) {
    return (
      <button
        onClick={() => {
          if (!isDisabled && onClick) {
            onClick();
          }
        }}
        className={className}
        translate="no"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className={className} translate="no">
      {cardContent}
    </div>
  );
};
