import { Button } from '@we-agile-you/react-base';
import React, { useContext, useState } from 'react';
import { cancelCurrentUserSubscription } from '../../../spaces/premium/data/cancelCurrentUserSubscription';

import { MyAccountModalInnerContext } from '../MyAccountModal/MyAccountModal';
import styles from './CancelSubscription.module.scss';
import { Feedback } from './Feedback';
import { CancelReason, ReasonPicker } from './ReasonPicker';

type CancelStep = 'select-reason' | 'feedback' | 'canceled';

export const CancelSubscription = () => {
  const [step, setStep] = useState<CancelStep>('select-reason');
  const [reason, setReason] = useState<CancelReason | null>(null);
  const [isCancelingSubscription, setIsCancelingSubscription] = useState(false);
  const { onClose } = useContext(MyAccountModalInnerContext);

  const handleConfirmCancelClick = (feedback: string) => {
    setIsCancelingSubscription(true);
    cancelCurrentUserSubscription({ reason, feedback })
      .then(() => {
        // TODO: delete premium customer
        // TODO: delete tables?
        setIsCancelingSubscription(false);
        setStep('canceled');
      })
      .catch(() => {
        // TODO: re-authenticate if required
        setIsCancelingSubscription(false);
      });
  };

  const handlePickReason = (reason: CancelReason) => {
    setReason(reason);
    setStep('feedback');
  };

  return (
    <div className={styles.wrapper}>
      {step === 'canceled' && (
        <div className={styles['canceled-container']}>
          <p>You have successfully canceled your subscription.</p>
          <Button onClick={() => onClose()}>Close</Button>
        </div>
      )}

      {step === 'select-reason' && (
        <ReasonPicker onSelectReason={handlePickReason} />
      )}

      {step === 'feedback' && reason && (
        <Feedback
          reason={reason}
          onConfirmCancelClick={handleConfirmCancelClick}
          isCancelingSubscription={isCancelingSubscription}
        />
      )}
    </div>
  );
};
