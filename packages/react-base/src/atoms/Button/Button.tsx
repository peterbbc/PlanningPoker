import classnames from 'classnames';
import React, { useRef, useState } from 'react';
import ReactDom from 'react-dom';
import { usePopover } from 'react-use-popover';
import { Spinner } from '../../components/Spinner/Spinner';
import { Tooltip } from '../Tooltip/Tooltip';

import styles from './Button.module.scss';

export interface ButtonProps {
  buttonStyle?: 'primary' | 'secondary' | 'tertiary';
  buttonColor?: 'primary' | 'secondary' | 'light' | 'danger';
  buttonType?: 'button' | 'submit' | 'reset';

  icon?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipPosition?: 'bottom-left';
  isLoading?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  isBlock?: boolean;
  isHeaderButton?: boolean;
  children?: React.ReactNode;
  className?: string;
  form?: string;
  overBackgroundColor?:
    | 'grey200'
    | 'grey100'
    | 'primary-white'
    | 'primary-whiter';
  translate?: 'no';
  size?: 'body' | 'small';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// -- Static attributes

const defaultProps: Partial<ButtonProps> = {
  buttonStyle: 'primary',
  buttonColor: 'primary',
  buttonType: 'button',
};

// -- Component
const ButtonFC: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> =
  (props, ref) => {
    const resolvedProps = {
      ...defaultProps,
      ...props,
    };
    const {
      buttonStyle,
      buttonColor,
      buttonType,
      isLoading,
      isDisabled,
      isActive,
      isBlock,
      isHeaderButton,
      children,
      className,
      translate,
      icon,
      tooltip,
      tooltipPosition,
      overBackgroundColor,
      size,
      form,
      onClick,
    } = resolvedProps;

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isMouseOver, setIsMouseOver] = useState<boolean | null>(null);
    const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(
      null,
    );

    const { dropdownStyle: tooltipStyle } = usePopover({
      anchorRef: ref ? (ref as React.RefObject<HTMLElement>) : buttonRef,
      dropdownElement: tooltipElement,
      position: tooltipPosition,
    });

    const handleMouseEnter = () => {
      setIsMouseOver(true);
    };

    const handleMouseLeave = () => {
      setIsMouseOver(false);
    };

    const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isLoading && !isDisabled && onClick) {
        onClick(event);
      }
    };

    const resolvedClassName = classnames(
      className,
      styles['button'],
      styles[`style-${buttonStyle}`],
      styles[`color-${buttonColor}`],
      overBackgroundColor &&
        styles[`over-background-color-${overBackgroundColor}`],
      size && styles[`size-${size}`],
      {
        [styles['is-loading']]: isLoading,
        [styles['is-disabled']]: isDisabled,
        [styles['is-active']]: isActive,
        [styles['is-block']]: isBlock,
        [styles['header-button']]: isHeaderButton,
        [styles[`tooltip--${tooltipPosition}`]]: tooltipPosition,
      },
      'is-clickable',
    );

    return (
      <button
        className={resolvedClassName}
        onClick={handleOnClick}
        disabled={isLoading || isDisabled}
        type={buttonType}
        translate={translate}
        form={form}
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isLoading && (
          <span className={styles['spinner-wrapper']}>
            <Spinner className={styles['spinner']} size="medium" />
          </span>
        )}
        <span className={classnames(styles['content'], 'is-clickable')}>
          {icon && (
            <span
              className={classnames(styles['icon-elemnent'], 'is-clickable')}
            >
              {icon}
            </span>
          )}
          {children && (
            <span
              className={classnames(
                styles['label'],
                icon && styles['label--icon'],
                'is-clickable',
              )}
            >
              {children}
            </span>
          )}
        </span>

        {isMouseOver &&
          tooltip &&
          ReactDom.createPortal(
            <div
              ref={setTooltipElement}
              style={{ ...tooltipStyle, zIndex: 999 }}
            >
              <Tooltip className={styles.tooltip}>{tooltip}</Tooltip>
            </div>,
            document.body,
          )}
      </button>
    );
  };

export const Button = React.forwardRef(ButtonFC);
