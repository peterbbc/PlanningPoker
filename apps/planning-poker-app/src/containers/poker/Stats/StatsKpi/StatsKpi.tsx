import React from 'react';

import styles from './StatsKpi.module.scss';

interface StatsKpiProps {
  label: string;
  isChart?: boolean;
  value: React.ReactNode;
}

export const StatsKpi = ({ label, isChart, value }: StatsKpiProps) => {
  return (
    <div className={styles['stats-kpi']}>
      <div className={styles['label']}>{label}</div>
      <div className={isChart ? '' : styles['value']}>{value}</div>
    </div>
  );
};
