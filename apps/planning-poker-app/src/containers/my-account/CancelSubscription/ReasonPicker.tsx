import { Button } from '@we-agile-you/react-base';
import React from 'react';

import styles from './CancelSubscription.module.scss';

export type CancelReason =
  | 'free-plan'
  | 'not-meet-needs'
  | 'cheaper-app'
  | 'better-app'
  | 'other';

interface ReasonPickerProps {
  onSelectReason: (reason: CancelReason) => void;
}

export const ReasonPicker = ({ onSelectReason }: ReasonPickerProps) => {
  return (
    <div>
      <p className={styles['message-title']}>Please, help us improve !</p>
      <p className={styles['message']}>
        Help us improve our product by giving us the reason you wish to
        unsubscribe
      </p>

      <Button
        isBlock
        buttonStyle="secondary"
        className={styles['reason-button']}
        onClick={() => onSelectReason('better-app')}
      >
        I have found a better app
      </Button>
      <Button
        isBlock
        buttonStyle="secondary"
        className={styles['reason-button']}
        onClick={() => onSelectReason('cheaper-app')}
      >
        I have found a cheaper/free app
      </Button>
      <Button
        isBlock
        buttonStyle="secondary"
        className={styles['reason-button']}
        onClick={() => onSelectReason('free-plan')}
      >
        I will go back to free plan
      </Button>
      <Button
        isBlock
        buttonStyle="secondary"
        className={styles['reason-button']}
        onClick={() => onSelectReason('not-meet-needs')}
      >
        The app doesn't meet my needs
      </Button>
      <Button
        isBlock
        buttonStyle="secondary"
        className={styles['reason-button']}
        onClick={() => onSelectReason('other')}
      >
        Other reasons / I don't want to anwser
      </Button>
    </div>
  );
};
