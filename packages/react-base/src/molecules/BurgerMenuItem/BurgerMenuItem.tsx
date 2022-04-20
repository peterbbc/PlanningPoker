import React from 'react';
import cx from 'classnames';

import styles from './BurgerMenuItem.module.scss';
import { HoritzontalSpacing } from '../../atoms/spacings/HoritzontalSpacing/HoritzontalSpacing';

interface BurgerMenuItemProps {
  label: string;
  rightContent?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const BurgerMenuItem: React.FC<BurgerMenuItemProps> = ({
  label,
  rightContent,
  icon,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div onClick={handleClick} className={cx(styles.item)}>
      {icon ? (
        <span className={styles.icon}>{icon}</span>
      ) : (
        <HoritzontalSpacing spacing="spacing-l" />
      )}
      <span className={styles.label}>{label}</span>
      {rightContent ? (
        <div className={styles.right}>{rightContent}</div>
      ) : (
        <HoritzontalSpacing spacing="spacing-l" />
      )}
    </div>
  );
};
