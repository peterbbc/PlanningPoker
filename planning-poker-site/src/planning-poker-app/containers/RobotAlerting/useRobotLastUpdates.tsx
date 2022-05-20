import { getMonthWithDayAndYearInLocalTime } from '../../../packages/js-base';
import { markLastUpdatesAsRead } from '../../spaces/auth/data/user';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import React, { ReactNode, useCallback } from 'react';

export type Update = {
  id: string;
  title: string;
  message: ReactNode;
  date: string;
  isRead: boolean;
};

const UPDATES: Omit<Update, 'isRead'>[] = [
  {
    id: 'voting-history-2',
    title: `Voting history is now available!`,
    date: getMonthWithDayAndYearInLocalTime(new Date(2022, 3, 6)),
    message: (
      <>
        Some of you told us that you want to view and export the voting results,
        now it is available from the new "game menu" at the header of the page.
        We hope you find it useful 🙂
      </>
    ),
  },
  {
    id: 'jql-mode',
    title: `Jira integration updated`,
    date: getMonthWithDayAndYearInLocalTime(new Date(2022, 2, 14)),
    message: (
      <>
        We know some of you had issues with Jira integration, we have fixed
        them, please let us know how it is working! We also added the option to
        search via JQL, we hope you like it!
      </>
    ),
  },
];
export const useRobotLastUpdates = () => {
  const { user } = useCurrentUser();

  const readUpdates = user?.readUpdates;

  const markAsRead = useCallback(() => {
    try {
      markLastUpdatesAsRead(UPDATES.map((update) => update.id));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const lastUpdates: Update[] = UPDATES.map((update) => ({
    ...update,
    isRead: !!readUpdates?.find((updateId) => updateId === update.id),
  }));

  return {
    lastUpdates,
    markAsRead,
    hasUnreadUpdates: lastUpdates.find((update) => !update.isRead),
    isLoading: !user,
  };
};
