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
    styles['picture-side'],
    isSelected && styles['is-selected'],
    size && styles[size],
  );

  return <div className={className}></div>;
};
