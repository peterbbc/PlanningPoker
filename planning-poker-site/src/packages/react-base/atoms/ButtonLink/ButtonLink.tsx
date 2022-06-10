import cx from 'classnames';
import React from 'react';

import styles from './ButtonLink.module.scss';

export interface ButtonProps {
  buttonColor?: 'primary' | 'light' | 'danger' | 'grey500';
  fontWeight?: 'bold' | 'normal';
  size?: 'normal' | 'small';
  tooltip?: React.ReactNode;
  tooltipPosition?: 'bottom-left';
  isDisabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  translate?: 'no';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// -- Component
const ButtonFC: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  ButtonProps
> = (props, ref) => {
  const {
    buttonColor,
    fontWeight,
    isDisabled,
    children,
    className,
    translate,
    tooltip,
    size,
    tooltipPosition,
    onClick,
  } = props;
  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }
  };

  const resolvedClassName = cx(
    className,
    styles.buttonLink,
    buttonColor && styles[`color-${buttonColor}`],
    fontWeight && styles[`font-weight-${fontWeight}`],
    size && styles[`size-${size}`],
    {
      [styles.isDisabled]: isDisabled,
      [styles[`tooltip--${tooltipPosition}`]]: tooltipPosition,
    },
    'is-clickable',
  );

  return (
    <button
      className={resolvedClassName}
      onClick={handleOnClick}
      disabled={isDisabled}
      type="button"
      translate={translate}
      ref={ref}
    >
      <span className="is-clickable">
        {children}
      </span>
      {tooltip && <div>{tooltip}</div>}
    </button>
  );
};

export const ButtonLink = React.forwardRef(ButtonFC);
