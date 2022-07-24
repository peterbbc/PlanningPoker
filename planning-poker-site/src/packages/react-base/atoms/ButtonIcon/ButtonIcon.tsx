import cx from 'classnames';
import React, { useRef, useState } from 'react';
import ReactDom from 'react-dom';
import { usePopover } from '../../../react-use-popover';
import { Tooltip } from '../Tooltip/Tooltip';

import styles from './ButtonIcon.module.scss';

export interface ButtonProps {
  buttonColor?: 'primary' | 'secondary' | 'secondary-light' | 'light';

  icon: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipPosition?:
    | 'bottom-left'
    | 'bottom-right'
    | 'top-right'
    | 'right'
    | 'top'
    | 'left';
  tooltipDontHide?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  isNoOpactity?: boolean;
  isFloatingButton?: boolean;
  className?: string;
  translate?: 'no';
  size?: 's' | 'sm' | 'm';
  isShowTooltipOnSmallScreen?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  containerBackgroundColor?: 'grey200' | 'primary-white';
}

// -- Static attributes

const defaultProps: Partial<ButtonProps> = {
  buttonColor: 'secondary',
};

// -- Component
const ButtonFC: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> =
  (props, ref) => {
    const resolvedProps = {
      ...defaultProps,
      ...props,
    };
    const {
      buttonColor,
      isDisabled,
      isActive,
      className,
      translate,
      icon,
      tooltip,
      tooltipPosition,
      onClick,
      containerBackgroundColor,
      isFloatingButton,
      isShowTooltipOnSmallScreen,
      tooltipDontHide,
      isNoOpactity,
      size,
    } = resolvedProps;

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isMouseOver, setIsMouseOver] = useState<boolean | null>(null);
    const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(
      null,
    );

    const { dropdownStyle } = usePopover({
      anchorRef: ref ? (ref as React.RefObject<HTMLElement>) : buttonRef,
      dropdownElement: tooltipElement,
      position: tooltipPosition || 'bottom',
    });

    const handleMouseEnter = () => {
      setIsMouseOver(true);
    };

    const handleMouseLeave = () => {
      setIsMouseOver(false);
    };

    const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(event);
      }
    };

    const resolvedClassName = cx(
      className,
      styles['button-icon'],
      styles[`color-${buttonColor}`],
      size && styles[`size-${size}`],
      containerBackgroundColor &&
        styles[`color-container-${containerBackgroundColor}`],
      {
        [styles['is-disabled']]: isDisabled,
        [styles['is-floating']]: isFloatingButton,
        [styles['is-no-opacity']]: isNoOpactity,
        [styles['is-active']]: isActive,
        [styles[`tooltip--${tooltipPosition}`]]: tooltipPosition,
      },
      'is-clickable',
    );
    return (
      <>
        <button
          className={resolvedClassName}
          onClick={handleOnClick}
          disabled={isDisabled}
          type="button"
          translate={translate}
          ref={ref || buttonRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {icon}
        </button>

        {tooltip &&
          (isMouseOver || tooltipDontHide) &&
          ReactDom.createPortal(
            <div
              ref={setTooltipElement}
              style={{ ...dropdownStyle, zIndex: 999 }}
            >
              <Tooltip isShowOnSmallScreen={isShowTooltipOnSmallScreen}>
                {tooltip}
              </Tooltip>
            </div>,
            document.body,
          )}
      </>
    );
  };

export const ButtonIcon = React.forwardRef(ButtonFC);
