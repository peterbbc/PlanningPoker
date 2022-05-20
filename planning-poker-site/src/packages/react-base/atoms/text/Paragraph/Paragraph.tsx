import cx from 'classnames';
import React, { ReactNode } from 'react';

import styles from './Paragraph.module.scss';

interface ParagraphProps {
  children: ReactNode;
  color?:
    | 'black'
    | 'primary-white'
    | 'grey600'
    | 'grey500'
    | 'danger'
    | 'success'
    | 'info'
    | 'white';
  align?: 'left' | 'center' | 'right';
  size?: 'body' | 'small' | 'micro' | 'nano';
  fontWeight?: 'normal' | 'bold';
  id?: string;
  className?: string;
  sizeSmallScreen?: 'body' | 'small' | 'micro' | 'nano';
}

export const Paragraph = ({
  children,
  sizeSmallScreen,
  id,
  align,
  className,
  ...props
}: ParagraphProps) => {
  const color = props.color || 'black';
  const size = props.size || 'body';
  const fontWeight = props.fontWeight || 'normal';

  return (
    <p
      id={id}
      className={cx(
        styles.paragraph,
        styles[`paragraph--${color}`],
        align && styles[`paragraph--${align}`],
        styles[`paragraph--${size}`],
        styles[`paragraph--weight-${fontWeight}`],
        sizeSmallScreen && styles[`paragraph--small-screen-${sizeSmallScreen}`],
        className,
      )}
    >
      {children}
    </p>
  );
};
