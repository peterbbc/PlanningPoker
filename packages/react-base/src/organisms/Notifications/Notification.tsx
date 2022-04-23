import { NotificationType } from '@we-agile-you/types-planning-poker';
import cx from 'classnames';
import React, { useEffect, useRef } from 'react';
import { ButtonIcon } from '../../atoms/ButtonIcon/ButtonIcon';
import { Icon } from '../../atoms/Icon/Icon';

import styles from './Notifications.module.scss';

const NOTIFICATION_TIMEOUT = 5500;

interface NotificationProps {
  notification: NotificationType;
  onClose: () => void;
}

export const Notification = ({ notification, onClose }: NotificationProps) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    window.setTimeout(() => {
      onCloseRef.current();
    }, NOTIFICATION_TIMEOUT);
  }, []);

  return (
    <div className={cx(styles.notification)}>
      <div className={styles['left']}>
        {notification.style === 'error' ? (
          <div className={styles['icon--error']}>
            <Icon icon="close" />
          </div>
        ) : (
          <div className={styles['icon']}>
            <Icon icon="check" />
          </div>
        )}
      </div>
      <div className={styles['center']}>
        <h2 className={styles.title}>{notification.title}</h2>
        <div className={styles.content}>{notification.content}</div>
      </div>
      <div className={styles['right']}>
        <ButtonIcon
          onClick={() => onClose()}
          buttonColor="light"
          icon={<Icon icon="close" />}
        />
      </div>
    </div>
  );
};
