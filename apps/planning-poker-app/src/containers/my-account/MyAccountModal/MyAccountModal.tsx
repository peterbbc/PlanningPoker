import { Modal, ModalTitle } from '@we-agile-you/react-base';
import React, { useState } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { BillingDetailsStep } from '../BillingDetailsStep/BillingDetailsStep';

import { CancelSubscription } from '../CancelSubscription/CancelSubscription';
import { MyAccount } from '../MyAccount/MyAccount';
import { SwitchToYearly } from '../SwitchToYearly/SwitchToYearly';

type MyAccountModalStep =
  | 'my-account'
  | 'cancel-subscription'
  | 'switch-to-yearly'
  | 'billing-details';

interface MyAccountModalProps {
  onClose: () => void;
}

type MyAccountModalInnerContextType = {
  onClose: () => void;
  currentStep: MyAccountModalStep;
  setCurrentStep: (step: MyAccountModalStep) => void;
};
export const MyAccountModalInnerContext = React.createContext<MyAccountModalInnerContextType>(
  {
    onClose: () => {},
    currentStep: 'my-account',
    setCurrentStep: () => {},
  },
);

const titles = {
  'my-account': 'My account',
  'cancel-subscription': 'Cancel subscription',
  'switch-to-yearly': 'Switch to yearly and get 16% off',
  'billing-details': 'Update billing details',
};

export const MyAccountModal = ({ onClose }: MyAccountModalProps) => {
  const { isAnonymous } = useCurrentUser();
  const [step, setStep] = useState<MyAccountModalStep>('my-account');

  if (isAnonymous) {
    return null;
  }

  return (
    <Modal
      showBackButton={step !== 'my-account'}
      onClickBackButton={() => setStep('my-account')}
      width={step === 'billing-details' ? 'medium' : 'big'}
      onClose={onClose}
    >
      <ModalTitle>{titles[step]}</ModalTitle>
      <MyAccountModalInnerContext.Provider
        value={{
          onClose: onClose,
          currentStep: step,
          setCurrentStep: setStep,
        }}
      >
        {step === 'my-account' && <MyAccount />}
        {step === 'cancel-subscription' && <CancelSubscription />}
        {step === 'switch-to-yearly' && <SwitchToYearly />}
        {step === 'billing-details' && (
          <BillingDetailsStep
            onSaved={() => setStep('my-account')}
            onCancel={() => setStep('my-account')}
          />
        )}
      </MyAccountModalInnerContext.Provider>
    </Modal>
  );
};
