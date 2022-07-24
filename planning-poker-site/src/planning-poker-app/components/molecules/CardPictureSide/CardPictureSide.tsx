import cx from 'classnames';
import React from 'react';

import styles from './CardPictureSide.module.scss';

interface CardPictureSideProps {
  isSelected?: boolean;
  size?: 'm' | 'l' | 'xl';
}

export const CardPictureSide: React.FC<CardPictureSideProps> = ({
  isSelected,
  size,
}) => {
  const className = cx(
    styles.pictureSide,
    isSelected && styles.isSelected,
    size && styles[size],
  );

  return <div className={className} />;
};
