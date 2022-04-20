import React, { ReactNode, useRef, useState } from 'react';
import ReactDom from 'react-dom';
import cx from 'classnames';

import styles from './ProfileImage.module.scss';
import { Icon } from '../Icon/Icon';
import { Tooltip, useHandleClickOuside } from '../../index';
import { usePopover } from 'react-use-popover';
import { isTouchDevice } from '@we-agile-you/js-base';

interface ProfileImageProps {
  src?: string | null;
  alt?: string;
  size?: 'm' | 'l' | 'xl' | 'xxl';
  onClick?: () => void;
  isClickable?: boolean;
  tooltip?: ReactNode;
}

export const ProfileImage = ({
  src,
  alt,
  size,
  onClick,
  isClickable,
  tooltip,
}: ProfileImageProps) => {
  const isEmpty = !src;
  const imageRef = useRef<HTMLDivElement | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean | null>(null);
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(
    null,
  );

  const { dropdownStyle } = usePopover({
    anchorRef: imageRef,
    dropdownElement: tooltipElement,
    position: 'bottom',
  });

  const handleMouseEnter = () => {
    if (!tooltip || isTouchDevice()) return;
    setIsTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    if (!tooltip || isTouchDevice()) return;
    setIsTooltipOpen(false);
  };

  const handleClick = () => {
    if (!tooltip || !isTouchDevice()) return;
    setIsTooltipOpen(!isTooltipOpen);
  };

  useHandleClickOuside([imageRef], () => {
    if (!tooltip || !isTouchDevice() || !isTooltipOpen) return;

    setIsTooltipOpen(false);
  });

  return (
    <div
      className={cx(
        styles['profile-img'],
        isEmpty && styles['profile-img--empty'],
        styles[`profile-img--${size || 'm'}`],
      )}
      ref={imageRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {isEmpty ? (
        alt ? (
          alt[0].toUpperCase()
        ) : (
          'P'
        )
      ) : (
        <>
          {src && <img src={src} alt={alt} />}
          <div className={styles['shadow']} />
        </>
      )}
      {(onClick || isClickable) && (
        <button type="button" className={styles['button']} onClick={onClick}>
          <span className={styles['button-icon']}>
            <Icon icon="camera" />
          </span>
        </button>
      )}
      {isTooltipOpen &&
        ReactDom.createPortal(
          <div
            ref={setTooltipElement}
            style={{ ...dropdownStyle, zIndex: 999 }}
          >
            <Tooltip isShowOnSmallScreen className={styles.tooltip}>
              {tooltip}
            </Tooltip>
          </div>,
          document.body,
        )}
    </div>
  );
};
