import { getMonthWithDayAndYearInLocalTime } from '../../../../packages/js-base';
import { User } from '../../../../packages/types-planning-poker';
import cx from 'classnames';
import React from 'react';

import styles from '../MyAccount.module.scss';

interface SusbcriptionTitleProps {
  user: User;
  isPremium: boolean;
}
export const SusbcriptionTitle: React.FC<SusbcriptionTitleProps> = ({
  user,
  isPremium,
}) => (
  <div>
    <h2 className={styles['section-title']}>
      <span>Premium plan</span>

      {user.subscriptionStatus === 'canceled' ? (
        <span
          className={cx(
            styles['subscription-status'],
            styles['subscription-status--canceled'],
          )}
        >
          {isPremium ? 'cancels ' : 'canceled at '}
          {user.subscriptionCurrentPeriodEnd &&
            getMonthWithDayAndYearInLocalTime(
              user.subscriptionCurrentPeriodEnd,
              -1,
            )}
        </span>
      ) : (
        <span
          className={cx(
            styles['subscription-status'],
            user.subscriptionStatus === 'past_due' &&
              styles['subscription-status--past-due'],
            user.subscriptionStatus === 'unpaid' &&
              styles['subscription-status--unpaid'],
            user.subscriptionStatus === 'incomplete' &&
              styles['subscription-status--incomplete'],
          )}
        >
          {user.subscriptionStatus?.replace('_', ' ')}
        </span>
      )}
    </h2>
  </div>
);
