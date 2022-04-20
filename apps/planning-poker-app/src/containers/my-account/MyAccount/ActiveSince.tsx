import { getMonthWithDayAndYearInLocalTime } from '@we-agile-you/js-base';
import { FlexBox } from '@we-agile-you/react-base';
import { User } from '@we-agile-you/types-planning-poker';
import React from 'react';

import styles from '../MyAccount.module.scss';

interface ActiveSinceProps {
  user: User;
  isPremium: boolean;
}

export const ActiveSince = ({ user, isPremium }: ActiveSinceProps) => (
  <>
    {isPremium &&
      user.subscriptionStartDate &&
      user.subscriptionStatus !== 'canceled' && (
        <>
          <div className={styles['subsection']}>
            <FlexBox justifyContent="space-between">
              <div>
                <h3 className={styles['section-subtitle']}>Active since</h3>
                <p className={styles['section-value']}>
                  {getMonthWithDayAndYearInLocalTime(
                    user.subscriptionStartDate,
                  )}
                </p>
              </div>
              <div />
            </FlexBox>
          </div>
        </>
      )}
  </>
);
