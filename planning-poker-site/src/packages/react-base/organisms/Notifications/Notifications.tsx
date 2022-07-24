import React from 'react';

import { Notification } from './Notification';
import styles from './Notifications.module.scss';
import { NotificationType } from '../../../types-planning-poker';

interface NotificationsProps {
  openNotifications: NotificationType[];
  setOpenNotifiactions: (notifications: NotificationType[]) => void;
}

export const Notifications = ({
  openNotifications,
  setOpenNotifiactions,
}: NotificationsProps) => {
  const handleClose = (notification: NotificationType) => {
    setOpenNotifiactions(
      openNotifications.filter(
        (_notification) => _notification.uuid !== notification.uuid,
      ),
    );
  };

  return (
    <>
      <div className={styles['notifications-container']}>
        {openNotifications.map((notification) => (
          <Notification
            key={notification.uuid}
            notification={notification}
            onClose={() => handleClose(notification)}
          />
        ))}
      </div>
    </>
  );
};
