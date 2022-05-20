import React from 'react';
import cx from 'classnames';
import styles from './Wave.module.scss';

interface WaveProps {
  color: 'grey100' | 'white' | 'black';
  className?: string;
}

const COLORS = {
  grey100: '#f9f9f9',
  white: '#ffffff',
  black: '#1A2935',
};
export const Wave = ({ color, className }: WaveProps) => {
  return (
    <svg
      className={cx(styles.wave, className)}
      viewBox="0 0 1440 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M448 0C228.764 0 54.5 30.7284 0 44V128H1440V1.88947e-05C1412 7.64564 1257.54 43 993 43C728.461 43 667.236 0 448 0Z"
        fill={COLORS[color || 'grey100']}
      />
    </svg>
  );
};
