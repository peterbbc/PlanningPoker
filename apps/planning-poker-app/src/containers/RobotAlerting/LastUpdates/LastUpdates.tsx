import {
  ButtonLink,
  Paragraph,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { Update } from '../useRobotLastUpdates';

import styles from './LastUpdates.module.scss';

interface LastUpdatesProps {
  lastUpdates: Update[];
  markAsRead: () => void;
}
export const LastUpdates = ({ lastUpdates, markAsRead }: LastUpdatesProps) => {
  const [cachedUpdates] = useState(lastUpdates);

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  return (
    <div>
      <VerticalSpacing spacing="spacing-l" />
      <div className={styles['header']}>
        <Paragraph fontWeight="bold">What&apos;s new</Paragraph>
      </div>
      <VerticalSpacing spacing="spacing-m" />
      <ul className={styles['last-updates']}>
        {cachedUpdates.map(({ title, message, date, id, isRead }) => {
          return (
            <li
              key={id}
              className={cx(
                styles['update'],
                !isRead && styles['update--unread'],
              )}
            >
              <Paragraph color="grey500" size="micro">
                {date}
              </Paragraph>
              <div className={cx(styles['title-container'])}>
                <Paragraph size="small" fontWeight="bold">
                  {title}
                </Paragraph>
              </div>
              <VerticalSpacing spacing="spacing-xxs" />
              <Paragraph size="small" color="grey600">
                {message}
              </Paragraph>
              <VerticalSpacing spacing="spacing-l" />
            </li>
          );
        })}
      </ul>
      <div className={styles.contact}>
        <Paragraph size="small">
          Any suggestions? Please{' '}
          <ButtonLink size="small">Contact us!</ButtonLink> We want to make the
          best app possible for you.
        </Paragraph>
      </div>
      <VerticalSpacing spacing="spacing-m" />
    </div>
  );
};
