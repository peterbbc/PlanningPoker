import React, { ReactNode, useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import styles from './Modal.module.scss';
import { ButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { Icon } from '../../atoms/Icon/Icon';

interface ModalProps {
  onClose?: () => void;
  titleTopBar?: ReactNode;
  actionsTopBar?: ReactNode;
  width?:
    | 'auto'
    | 'small'
    | 'medium-small'
    | 'medium'
    | 'medium-big'
    | 'big'
    | 'bigger';
  height?: 'auto' | 'full-height';
  showBackButton?: boolean;
  onClickBackButton?: () => void;
  children: React.ReactNode;
  isNotClosable?: boolean;
  isNoPadding?: boolean;
}

export const Modal = ({
  onClose,
  titleTopBar,
  actionsTopBar,
  height,
  showBackButton,
  onClickBackButton,
  children,
  isNotClosable,
  isNoPadding,
  ...props
}: ModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);
  const [isScrollVisisble, setIsScrollVisible] = useState(false);

  const width = props.width || 'medium';

  useEffect(() => {
    if (contentRef.current && innerContentRef.current) {
      setIsScrollVisible(
        innerContentRef.current.offsetHeight > contentRef.current.offsetHeight,
      );
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      disableBodyScroll(contentRef.current);
    }

    return () => {
      clearAllBodyScrollLocks();
    };
  }, []);

  return (
    <div className={cx(styles['wrapper'])}>
      <div
        className={cx(styles['overlay'])}
        onClick={isNotClosable ? () => {} : onClose}
      />
      <div
        className={cx(
          styles['modal'],
          styles[`modal--width-${width}`],
          isScrollVisisble && styles[`modal--scroll-visible`],
        )}
        key="content"
      >
        <div className={cx(styles['header'])}>
          {showBackButton && (
            <div className={styles['back']}>
              <ButtonIcon
                onClick={onClickBackButton}
                icon={<Icon icon="back" />}
              />
            </div>
          )}

          {titleTopBar && (
            <div className={styles['title-top-bar']}>{titleTopBar}</div>
          )}

          {!!actionsTopBar && (
            <div className={styles['top-bar-actions']}>{actionsTopBar}</div>
          )}

          {!isNotClosable && (
            <div className={styles['close']}>
              <ButtonIcon onClick={onClose} icon={<Icon icon="close" />} />
            </div>
          )}
        </div>

        <div
          ref={contentRef}
          className={cx(
            styles['content'],
            styles[`content--width-${width}`],
            isNoPadding && styles[`content--no-padding`],
            height && styles[`content--height-${height}`],
          )}
        >
          <div ref={innerContentRef}>
            <div className={styles['top-spacer']} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
