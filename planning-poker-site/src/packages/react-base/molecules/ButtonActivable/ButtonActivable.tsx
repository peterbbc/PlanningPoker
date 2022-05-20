import React from 'react';
import { Button } from '../../atoms/Button/Button';

interface ButtonActivableProps {
  className?: string;
  isActive: boolean;
  onIsActiveChange: (isActive: boolean) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonIcon?: React.ReactNode;
  size?: 'body' | 'small';
  overBackgroundColor?:
    | 'grey200'
    | 'grey100'
    | 'primary-white'
    | 'primary-whiter';
}

export const ButtonActivable: React.FC<ButtonActivableProps> = ({
  className,
  children,
  isActive,
  onIsActiveChange,
  onClick,
  buttonIcon,
  overBackgroundColor,
  size,
}) => {
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onIsActiveChange(!isActive);

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button
      isActive={isActive}
      onClick={handleButtonClick}
      className={className}
      icon={buttonIcon}
      buttonColor="secondary"
      size={size}
      overBackgroundColor={overBackgroundColor}
    >
      {children}
    </Button>
  );
};
