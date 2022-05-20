import cx from 'classnames';
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { usePopover } from '../../../react-use-popover';
import { ButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { Tooltip } from '../../atoms/Tooltip/Tooltip';
import { useHandleClickOuside } from '../../hooks/useHandleClickOutside';
import styles from './PointsPicker.module.scss';

interface PointsPickerProps {
  value: string | number | null;
  deck: string[];
  isInIssueCard?: boolean;
  onChange: (value: string | null) => void;
  align?: 'left' | 'left-top';
  overBackgroundColor?: 'white' | 'grey200' | 'grey100' | 'primary-white';
}

export const PointsPicker = ({
  value,
  deck,
  isInIssueCard,
  onChange,
  align,
  overBackgroundColor,
}: PointsPickerProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownElement, setDropdownElement] = useState<HTMLElement | null>(
    null,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean | null>(null);
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(
    null,
  );

  const { dropdownStyle: tooltipStyle } = usePopover({
    anchorRef: buttonRef,
    dropdownElement: tooltipElement,
    position: 'bottom-left',
  });

  const handleMouseEnter = () => {
    setIsTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    setIsTooltipOpen(false);
  };

  const handleToggleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    document.body.click();
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    card: string,
  ) => {
    document.body.click();
    event.stopPropagation();
    onChange(`${value}`.trim() === `${card}`.trim() ? null : card);
    setIsOpen(false);
  };

  useHandleClickOuside([wrapperRef], () => {
    isOpen && setIsOpen(false);
  });

  const { dropdownStyle } = usePopover({
    position: 'left',
    anchorRef: buttonRef,
    dropdownElement,
  });

  return (
    <div ref={wrapperRef} className={styles['story-points-selector']}>
      <button
        ref={buttonRef}
        onClick={handleToggleClick}
        translate="no"
        className={cx(
          styles.button,
          isOpen && styles[`button--is-active`],
          styles[`button--over-${overBackgroundColor || 'white'}`],
          isInIssueCard && styles[`button--is-in-card`],
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {value ?? '-'}
      </button>
      {isTooltipOpen &&
        !isOpen &&
        ReactDOM.createPortal(
          <div ref={setTooltipElement} style={{ ...tooltipStyle, zIndex: 999 }}>
            <Tooltip>Select story points</Tooltip>
          </div>,
          document.body,
        )}

      {isOpen &&
        ReactDOM.createPortal(
          <div
            className={cx(
              styles['dropdown'],
              styles[`dropdown--${align || 'left'}`],
            )}
            style={dropdownStyle}
            ref={setDropdownElement}
          >
            <ul
              className={styles.list}
              onClick={(event: any) => event.stopPropagation()}
            >
              {deck.map((card) => (
                <li key={card} className={styles.item}>
                  <ButtonIcon
                      icon={card}
                      isActive={`${value}`.trim() === `${card}`.trim()}
                      onClick={(event) => handleOptionClick(event, card)}
                  />
                </li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
};
