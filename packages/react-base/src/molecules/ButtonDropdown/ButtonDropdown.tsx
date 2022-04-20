import cx from 'classnames';
import React, { useRef, useState, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { ButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { Icon } from '../../atoms/Icon/Icon';
import { useHandleClickOuside } from '../../hooks/useHandleClickOutside';
import { usePopover } from 'react-use-popover';

import styles from './ButtonDropdown.module.scss';

interface ButtonDropdownProps {
  isIconButton?: boolean;
  isFloatingButton?: boolean;
  isLight?: boolean;
  isNoOpactity?: boolean;
  color?: 'secondary' | 'primary';
  className?: string;
  buttonTooltip?: ReactNode;
  align?:
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'left-bottom'
    | 'left-top'
    | 'right-bottom';
  tooltipPosition?:
    | 'bottom-left'
    | 'bottom-right'
    | 'top-right'
    | 'right'
    | 'left';
  translate?: 'no';
  isOpen: boolean;
  isShowTooltipOnSmallScreen?: boolean;
  isShowTooltipWhenOpen?: boolean;
  size?: 's' | 'm';
  onIsOpenChange: (isOpen: boolean) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  dropdown?: React.ReactNode;
  children?: React.ReactNode;
  containerBackgroundColor?: 'grey200' | 'primary-white';
}

export const ButtonDropdown = ({
  className,
  children,
  translate,
  dropdown,
  isOpen,
  buttonTooltip,
  tooltipPosition,
  onIsOpenChange,
  onClick,
  isIconButton,
  isFloatingButton,
  isNoOpactity,
  isLight,
  isShowTooltipOnSmallScreen,
  isShowTooltipWhenOpen,
  containerBackgroundColor,
  align,
  ...props
}: ButtonDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const size = props.size || 'm';
  const color = props.color || 'primary';
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [dropdownElement, setDropdownElement] = useState<HTMLDivElement | null>(
    null,
  );

  const { updateDropdownPosition, dropdownStyle } = usePopover({
    anchorRef: buttonRef,
    position: align,
    dropdownElement,
  });

  const handleToggleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    document.body.click(); // hack to close other dropdowns
    updateDropdownPosition();

    onIsOpenChange(!isOpen);

    if (onClick) {
      onClick(event);
    }
  };

  useHandleClickOuside([dropdownRef, buttonRef], () => {
    isOpen && onIsOpenChange(false);
  });

  return (
    <div className={styles.wrapper}>
      {isIconButton ? (
        <ButtonIcon
          ref={buttonRef}
          isFloatingButton={isFloatingButton}
          buttonColor={isLight ? 'light' : color}
          onClick={handleToggleClick}
          translate={translate}
          className={className}
          isActive={isOpen}
          isNoOpactity={isNoOpactity}
          tooltip={(!isOpen || isShowTooltipWhenOpen) && buttonTooltip}
          tooltipDontHide={isOpen && isShowTooltipWhenOpen}
          tooltipPosition={tooltipPosition}
          isShowTooltipOnSmallScreen={isShowTooltipOnSmallScreen}
          icon={children}
          containerBackgroundColor={containerBackgroundColor}
        />
      ) : (
        <>
          <button
            ref={buttonRef}
            onClick={handleToggleClick}
            translate={translate}
            className={cx(
              className,
              styles.button,
              isOpen && styles[`button--is-active`],
              isLight && styles[`button--light`],
            )}
          >
            {children}
            <div className={styles.chevron}>
              <Icon icon="chevron-down" />
            </div>
          </button>
        </>
      )}

      {isOpen &&
        ReactDOM.createPortal(
          <div
            className={cx(styles['dropdown'], styles[`dropdown--${size}`])}
            style={dropdownStyle}
            ref={(el) => {
              setDropdownElement(el);
              dropdownRef.current = el;
            }}
          >
            {dropdown}
          </div>,
          document.body,
        )}
    </div>
  );
};
