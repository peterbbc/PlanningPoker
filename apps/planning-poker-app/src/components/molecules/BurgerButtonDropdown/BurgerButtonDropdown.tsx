import cx from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import styles from './BurgerButtonDropdown.module.scss';
import { ButtonIcon, Icon } from '@we-agile-you/react-base';
import { BurgerMenu } from '../../../containers/BurgerMenu/BurgerMenu';

interface BurgerButtonDropdownProps {
  isLight?: boolean;
  isPoker?: boolean;
}

export const BurgerButtonDropdown = ({
  isLight,
  isPoker,
}: BurgerButtonDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && containerRef.current) {
      disableBodyScroll(containerRef.current);
    }
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [isOpen]);

  return (
    <div className={styles.wrapper}>
      <button
        onClick={handleToggleClick}
        translate="no"
        className={cx(
          styles.button,
          isOpen && styles[`button--is-active`],
          isLight && styles[`button--light`],
        )}
      >
        <Icon icon="burger" />
      </button>

      <div
        className={cx(
          styles['dropdown'],
          isOpen && styles['dropdown--is-open'],
          isPoker && styles['dropdown--is-poker'],
        )}
      >
        <div className={styles['dropdown__close']}>
          <ButtonIcon icon={<Icon icon="close" />} onClick={handleClose} />
        </div>
        <div className={styles['dropdown__scroll']} ref={containerRef}>
          <BurgerMenu onClose={handleClose} isPoker={isPoker} />
        </div>
      </div>
      {isOpen && (
        <div className={cx(styles['overlay'])} onClick={handleClose} />
      )}
    </div>
  );
};
