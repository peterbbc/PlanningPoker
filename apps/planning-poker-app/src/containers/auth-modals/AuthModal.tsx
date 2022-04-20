import { Modal, ModalTitle } from '@we-agile-you/react-base';
import React from 'react';

import ForgotPassword from './ForgotPassword/ForgotPassword';
import SignIn from './SignIn/SignIn';
import Signup from './SignUp/SignUp';

export type AuthModalType = 'sign-in' | 'sign-up' | 'forgot-password';

const titles = {
  'sign-in': 'Sign in',
  'sign-up': 'Sign up',
  'forgot-password': 'Forgot password',
};

export type AuthModalIsOpen = AuthModalType | false | null;

interface AuthModalProps {
  isSubscribingToPremium?: boolean;
  authType: AuthModalType;
  onChangeAuthType: (authType: AuthModalType) => void;
  onClose: () => void;
}

export const AuthModal = ({
  isSubscribingToPremium,
  authType,
  onChangeAuthType,
  onClose,
}: AuthModalProps) => {
  return (
    <Modal width="medium-small" onClose={onClose}>
      <ModalTitle>{titles[authType]}</ModalTitle>
      {authType === 'sign-up' && (
        <Signup
          onClickSignin={() => onChangeAuthType('sign-in')}
          onSuccess={onClose}
          isSubscribingToPremium={!!isSubscribingToPremium}
        />
      )}
      {authType === 'sign-in' && (
        <SignIn
          onClickSignup={() => onChangeAuthType('sign-up')}
          onClickForgotPassword={() => onChangeAuthType('forgot-password')}
          onSuccess={onClose}
          isSubscribingToPremium={!!isSubscribingToPremium}
        />
      )}
      {authType === 'forgot-password' && (
        <ForgotPassword
          onClickSignup={() => onChangeAuthType('sign-up')}
          onClickSignin={() => onChangeAuthType('sign-in')}
        />
      )}
    </Modal>
  );
};
