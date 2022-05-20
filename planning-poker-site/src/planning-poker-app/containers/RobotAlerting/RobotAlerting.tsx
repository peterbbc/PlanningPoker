import {
  ButtonIcon,
  ButtonLink,
  Icon,
  useHandleClickOuside,
} from '../../../packages/react-base';
import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import robotClosedImage from './robot-closed.svg';
import robotImage from './robot.svg';
import styles from './RobotAlerting.module.scss';
import { useAppContext } from '../../spaces/app/hooks/useAppContext';
import { useRobotLimitMessage } from './useRobotLimitMessage';
import { LastUpdates } from './LastUpdates/LastUpdates';
import { useRobotLastUpdates } from './useRobotLastUpdates';

export const RobotAlerting = () => {
  const setIsPricingModalOpen = useAppContext().pricingModal[1];
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const {
    isLoading,
    hasUnreadUpdates,
    lastUpdates,
    markAsRead,
  } = useRobotLastUpdates();
  const { showLimitMessages, messages } = useRobotLimitMessage();

  useHandleClickOuside([containerRef], () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });
  useEffect(() => {
    if (showLimitMessages) {
      setIsOpen(true);
    }
  }, [showLimitMessages, messages]);

  const hasNotification = !isLoading && hasUnreadUpdates && !isOpen;

  return (
    <div
      ref={containerRef}
      className={cx(
        styles['robot-alerting'],
        isOpen && styles['robot-alerting--is-open'],
        hasNotification && styles['robot-alerting--has-notifiaction'],
      )}
    >
      <button
        className={cx(
          styles['robot-button'],
          isOpen && styles['robot-button--active'],
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img alt="Robot" src={isOpen ? robotImage : robotClosedImage} />
      </button>
      {hasNotification && <div className={styles['unread-messages-dot']} />}
      <div className={styles['popup']}>
        {showLimitMessages ? (
          <div>
            <div className={styles['popup__text']}>
              {messages &&
                messages.map((message, i) => <p key={i}>{message}</p>)}
            </div>
            <div className={styles['popup__cta']}>
              <ButtonLink onClick={() => setIsPricingModalOpen(true)}>
                {showLimitMessages
                  ? 'Go premium now and continue voting'
                  : 'Go premium now'}
              </ButtonLink>
            </div>
          </div>
        ) : (
          isOpen &&
          !isLoading && (
            <LastUpdates lastUpdates={lastUpdates} markAsRead={markAsRead} />
          )
        )}
        <div
          className={cx(
            styles['popup__close'],
            !showLimitMessages && styles['popup__close--top'],
          )}
        >
          <ButtonIcon
            icon={<Icon icon="close" />}
            onClick={() => setIsOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};
