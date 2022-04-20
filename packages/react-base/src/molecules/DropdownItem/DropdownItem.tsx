import React, { MouseEvent, ReactNode } from 'react';
import cx from 'classnames';

import styles from './DropdownItem.module.scss';
import { HoritzontalSpacing } from '../../atoms/spacings/HoritzontalSpacing/HoritzontalSpacing';

interface DropdownItemProps {
  label: ReactNode;
  rightContent?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  label,
  rightContent,
  icon,
  onClick,
}) => {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e);
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
