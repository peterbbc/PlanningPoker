import cx from 'classnames';
import React, { ReactNode, useRef, useState } from 'react';
import ReactDom from 'react-dom';
import { Tooltip } from '../../Tooltip/Tooltip';

import styles from './Span.module.scss';
import { usePopover } from '../../../../react-use-popover';
import { isTouchDevice } from '../../../../js-base';
import { useHandleClickOuside } from '../../../hooks/useHandleClickOutside';

interface SpanProps {
  children: ReactNode;
  size?: 'body' | 'small' | 'micro';
  color?: 'black' | 'grey600' | 'grey500' | 'success' | 'primary';
  spanStyle?: 'regular' | 'semibold' | 'bold';
  hideUnderline?: boolean;
  tooltip?: ReactNode;
  tooltipPosition?: 'bottom' | 'bottom-left' | 'bottom-right' | 'top-right';
}

export const Span = ({
  children,
  tooltip,
  tooltipPosition,
  hideUnderline,
  ...props
}: SpanProps) => {
  const color = props.color || 'black';
  const size = props.size || 'body';
  const style = props.spanStyle || 'regular';
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean | null>(null);
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(
    null,
  );

  const { dropdownStyle: tooltipStyle } = usePopover({
    anchorRef: spanRef,
    dropdownElement: tooltipElement,
    position: tooltipPosition,
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

  useHandleClickOuside([spanRef], () => {
    if (!tooltip || !isTouchDevice() || !isTooltipOpen) return;

    setIsTooltipOpen(false);
  });

  return (
    <span
      ref={spanRef}
      className={cx(
        styles.span,
        styles[`span--${color}`],
        styles[`span--${size}`],
        styles[`span--${style}`],
        !!tooltip && styles['span--with-tooltip'],
        hideUnderline && styles['span--hide-underline'],
        isTooltipOpen && styles['span--is-tooltip-open'],
        isTooltipOpen === false && styles['span--is-tooltip-closed'],
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {isTooltipOpen &&
        ReactDom.createPortal(
          <div ref={setTooltipElement} style={{ ...tooltipStyle, zIndex: 999 }}>
            <Tooltip isShowOnSmallScreen className={styles.tooltip}>
              {tooltip}
            </Tooltip>
          </div>,
          document.body,
        )}
    </span>
  );
};
