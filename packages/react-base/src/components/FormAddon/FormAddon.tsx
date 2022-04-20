import React from 'react';
import cx from 'classnames';

import styles from './FormAddon.module.scss';

interface FormAddonProps {
  isNoLabel?: boolean;
  isRight?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const FormAddon = ({
  children,
  isNoLabel,
  isRight,
  onClick,
}: FormAddonProps) => {
  return (
    <div
      className={cx(
        styles['form-addon'],
        isRight && styles['form-addon--right'],
        isNoLabel && styles['form-addon--no-label'],
        onClick && styles['form-addon--clickable'],
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
