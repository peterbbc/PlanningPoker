import React, { ReactNode } from 'react';
import { RobotEmoji } from '../../atoms/RobotEmoji/RobotEmoji';

import styles from './DonutChart.module.scss';

interface DonutChartProps {
  percentatge: number;
}

// Docs in https://akzhy.com/blog/create-animated-donut-chart-using-svg-and-javascript/

export const DonutChart = ({ percentatge }: DonutChartProps) => {
  let label: ReactNode = '';

  if (percentatge < 25) {
    label = <RobotEmoji robot="confused" />;
  } else if (percentatge < 50) {
    label = <RobotEmoji robot="neutral" />;
  } else if (percentatge < 75) {
    label = <RobotEmoji robot="happy" />;
  } else if (percentatge < 100) {
    label = <RobotEmoji robot="super-happy" />;
  } else {
    label = <RobotEmoji robot="party" />;
  }
  return (
    <div className={styles['donut-chart']}>
      <svg className={styles['chart']} viewBox="0 0 48 48">
        <circle
          className={styles['background-cricle']}
          cx="24"
          cy="22"
          r="22"
        />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="transparent"
          stroke-width="4"
          stroke="#e8e9ea"
        />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="transparent"
          strokeWidth="4"
          stroke="#00d68f"
          strokeDasharray="138.23"
          strokeDashoffset={138.23 - (percentatge * 138.23) / 100}
          transform="rotate(-90 24 24)"
        />
        <text x="14" y="30" fill="black" fontSize="16"></text>
      </svg>
      <div className={styles.label}>{label}</div>
    </div>
  );
};
