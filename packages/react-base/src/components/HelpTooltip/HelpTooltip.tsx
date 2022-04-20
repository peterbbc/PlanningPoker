import cx from 'classnames';
import React, { ReactNode, RefObject, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { Icon } from '../../atoms/Icon/Icon';

import styles from './HelpTooltip.module.scss';

interface HelpTooltipProps {
  title: ReactNode;
  children: ReactNode;
  refNode: RefObject<HTMLElement>;
  position: 'left' | 'right' | 'top' | 'bottom';
  specialStyle?:
    | 'table-left'
    | 'table-right'
    | 'card-selector'
    | 'issues'
    | 'add-issue'
    | 'sort-issues';
  isOpen?: boolean;
  onClose?: () => void;
}

type Coordinates = {
  x: number;
  y: number;
};

export const HelpTooltip = (props: HelpTooltipProps) => {
  const {
    children,
    title,
    position,
    isOpen,
    onClose,
    specialStyle,
    refNode,
  } = props;
  const [showOpacity, setShowOpacity] = useState(false);
  const [
    tooltipCoordinates,
    setTooltipCoordinates,
  ] = useState<Coordinates | null>(null);

  const refElement = refNode.current;

  useEffect(() => {
    const refreshTooltipCoordinates = () => {
      if (!refElement || !isOpen) return;

      const refNodeBoudningRect = refElement.getBoundingClientRect();

      if (refNodeBoudningRect) {
        switch (position) {
          case 'left':
            setTooltipCoordinates({
              y: refNodeBoudningRect.top + refNodeBoudningRect.height / 2,
              x: refNodeBoudningRect.left,
            });

            break;
          case 'right':
            setTooltipCoordinates({
              y: refNodeBoudningRect.top + refNodeBoudningRect.height / 2,
              x: refNodeBoudningRect.left + refNodeBoudningRect.width,
            });

            break;
          case 'top':
            setTooltipCoordinates({
              y: refNodeBoudningRect.top + refNodeBoudningRect.height / 2,
              x: refNodeBoudningRect.left,
            });

            break;
          case 'bottom':
            setTooltipCoordinates({
              y: refNodeBoudningRect.top + refNodeBoudningRect.height,
              x: refNodeBoudningRect.left + refNodeBoudningRect.width / 2,
            });
            break;
        }
      }
    };

    // @ts-ignore
    var ro = window.ResizeObserver
      ? //@ts-ignore
        new ResizeObserver(refreshTooltipCoordinates)
      : null;

    if (refElement && isOpen) {
      if (ro) ro.observe(refElement);

      window.addEventListener('resize', refreshTooltipCoordinates);

      refreshTooltipCoordinates();
    }

    return () => {
      if (refElement) {
        if (ro) ro.unobserve(refElement);

        window.removeEventListener('resize', refreshTooltipCoordinates);
      }
    };
  }, [position, refElement, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowOpacity(true);
    } else {
      setShowOpacity(false);
    }
  }, [isOpen]);

  if (tooltipCoordinates === null || !isOpen) return null;

  return createPortal(
    <div
      className={cx(
        styles.tooltip,
        styles[`tooltip--${position}`],
        showOpacity && styles[`tooltip--is-open`],
        specialStyle && styles[`tooltip--${specialStyle}`],
      )}
      style={{ top: tooltipCoordinates.y, left: tooltipCoordinates.x }}
    >
      <div className={styles['close']}>
        <ButtonIcon
          buttonColor="light"
          onClick={(event) => {
            event.stopPropagation();

            if (onClose) {
              onClose();
            }
          }}
          icon={<Icon icon="close" />}
        />
      </div>
      <div className={styles['content']}>
        <div className={styles['title']}>
          <div className={styles['icon']}>
            <Icon icon="info" />
          </div>
          <div className={styles['title-label']}>{title}</div>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};
