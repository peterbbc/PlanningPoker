import { VerticalSpacing } from '../../../../../packages/react-base';
import React from 'react';
import cx from 'classnames';

import styles from './StatsItem.module.scss';

interface StatsItemProps {
  card: string;
  cardVotes: number;
  totalVotes: number;
  isMostVoted: boolean;
}

export const StatsItem = ({
  card,
  cardVotes,
  totalVotes,
  isMostVoted,
}: StatsItemProps) => {
  return (
    <div
      className={cx(
        styles['stats-item'],
        isMostVoted && styles['stats-item--is-most-voted'],
      )}
    >
      <div className={styles['bar-container']}>
        <div className={styles['bar-background']}>
          <div
            className={styles['bar-fill']}
            style={{
              height: `${Math.round((cardVotes / totalVotes) * 100)}%`,
            }}
          />
        </div>
      </div>
      <div className={styles['card-container']}>
        <VerticalSpacing spacing="spacing-xs" />
        <div className={styles['card']}>{card}</div>
        <VerticalSpacing spacing="spacing-xs" />
        <div className={styles['votes-label']}>{`${cardVotes} Vote${
          cardVotes > 1 ? 's' : ''
        }`}</div>
      </div>
    </div>
  );
};
