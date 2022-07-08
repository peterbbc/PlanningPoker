import { Button, FormInput, Modal, ModalTitle } from '../../../packages/react-base';
import { navigate } from '@reach/router';
import React, { FormEvent, useState } from 'react';
import { Link } from '../../components/atoms/Link/Link';
import {
  deleteAccount,
  reauthenticateWithPassword,
} from '../../spaces/auth/data/auth';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { cancelCurrentUserSubscription } from '../../spaces/premium/data/cancelCurrentUserSubscription';
import styles from './DeleteAccountModal.module.scss';

interface DeleteAccountModalProps {
  onClose: () => void;
}

export const DeleteAccountModal = ({ onClose }: DeleteAccountModalProps) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const { isAnonymous, isPremium } = useCurrentUser();

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);

    if (isPremium) {
      try {
        await cancelCurrentUserSubscription({ reason: 'delete-account' });
      } catch (e) {}
    }

    await deleteAccount();

    navigate('/', { replace: true });
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    reauthenticateWithPassword(password)
      .then(() => {
        setIsLoading(false);
        setIsReauthenticated(true);
      })
      .catch(function (error) {
        setIsLoading(false);
        setErrorMessage(error.message);
      });
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  function handleOnCloseModal() {
    onClose();
  }

  return (
    <Modal onClose={handleOnCloseModal}>
      <ModalTitle>Delete your account</ModalTitle>
      {isAnonymous ? (
        <div className={styles.center}>
          You have successfully deleted your account. <br />
          <Link to="/">Go to homepage</Link>
        </div>
      ) : isReauthenticated ? (
        <div className={styles.center}>
          <Button
            buttonColor="danger"
            onClick={handleDeleteAccount}
            isLoading={isDeletingAccount}
          >
            Delete my account
          </Button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <p className={styles.p}>
            Please type your password again to proceed to account deletion.
          </p>
          <FormInput
            value={password}
            label="Password"
            onChange={handlePasswordChange}
            type="password"
            required
          />
          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
          <Button buttonType="submit" isLoading={isLoading} isBlock>
            Continue
          </Button>
        </form>
      )}
    </Modal>
  );
};
