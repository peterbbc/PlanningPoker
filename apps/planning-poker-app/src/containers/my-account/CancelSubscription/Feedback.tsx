import { Button, FormTextarea } from '@we-agile-you/react-base';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { MyAccountModalInnerContext } from '../MyAccountModal/MyAccountModal';
import styles from './CancelSubscription.module.scss';
import { CancelReason } from './ReasonPicker';

interface FeedbackProps {
  reason: CancelReason;
  isCancelingSubscription: boolean;
  onConfirmCancelClick: (feedback: string) => void;
}

export const Feedback = ({
  isCancelingSubscription,
  onConfirmCancelClick,
}: FeedbackProps) => {
  const [feedback, setFeedback] = useState('');
  const { setCurrentStep } = useContext(MyAccountModalInnerContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCancelClick = () => {
    onConfirmCancelClick(feedback);
  };

  const textareaElement = textareaRef.current;

  useEffect(() => {
    if (textareaElement) {
      textareaElement.focus();
    }
  }, [textareaElement]);

  return (
    <div>
      <p className={styles['message-title']}>Please, help us improve !</p>
      <p className={styles['message']}>
        Help us improve our product by giving us the reason you wish to
        unsubscribe
      </p>
      <FormTextarea
        autoFocus
        label="Feedback"
        value={feedback}
        onChange={(value) => setFeedback(value)}
      />
      <Button
        buttonColor="danger"
        onClick={handleCancelClick}
        isLoading={isCancelingSubscription}
        isBlock
      >
        Cancel subscription
      </Button>
      <p className={styles['button-message']}>*You can not undo this action</p>
      <Button onClick={() => setCurrentStep('my-account')} isBlock>
        Continue premium
      </Button>
    </div>
  );
};
