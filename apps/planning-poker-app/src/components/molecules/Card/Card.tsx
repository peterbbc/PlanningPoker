import React from 'react';
import cx from 'classnames';

import styles from './Card.module.scss';
import { CardValueSide } from '../CardValueSide/CardValueSide';
import { CardPictureSide } from '../CardPictureSide/CardPictureSide';

interface CardProps {
  card?: string;
  isDownwards?: boolean;
  isTwoFaces?: boolean;
  size?: 'm' | 'l' | 'xl';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  card,
  isDownwards,
  isTwoFaces,
  size,
  onClick,
}) => {
  function handleOnClick() {
    if (onClick) {
      onClick();
    }
  }

  const className = cx(styles['card'], size && [styles[size]], {
    [styles['downwards']]: isDownwards,
  });

  return (
    <div className={className}>
      <div className={styles['value-side']}>
        <CardValueSide size={size} card={card || ''} onClick={handleOnClick} />
      </div>
      <div className={styles['picture-side']}>
        {isTwoFaces ? (
          <CardValueSide
            size={size}
            card={card || ''}
            isButton
            onClick={handleOnClick}
            isValueSideStyle
          />
        ) : (
          <CardPictureSide size={size} />
        )}
      </div>
    </div>
  );
};

export default Card;
