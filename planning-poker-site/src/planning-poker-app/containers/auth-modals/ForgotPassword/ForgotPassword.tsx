import {
  Button,
  ButtonLink,
  FormGroup,
  FormInput,
  InlineAlert,
  VerticalSpacing,
} from '../../../../packages/react-base';
import React, { FormEvent, useState } from 'react';
import { sendPasswordResetEmail } from '../../../spaces/auth/data/auth';

import styles from '../Auth.module.scss';

interface ForgotPasswordProps {
  onClickSignin: () => void;
  onClickSignup: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onClickSignin,
  onClickSignup,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSucccess, setIsSucccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    sendPasswordResetEmail(email)
      .then(() => {
        setIsSucccess(true);
        setIsLoading(false);
      })
      .catch(function (error) {
        setIsLoading(false);
        setErrorMessage(error.message);
      });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  return (
    <>
      {isSucccess ? (
        <div className={styles.successMessage}>
          <p>
            We have sent an email to <b>{email}</b>.
          </p>
          <p>Check your inbox and follow the instructions.</p>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <FormInput
            value={email}
            name="email"
            type="email"
            label="Email to send recovery link"
            onChange={handleEmailChange}
            required
          />
          <FormGroup isSubmit>
            {errorMessage && (
              <>
                <InlineAlert content={errorMessage} />
                <VerticalSpacing spacing="spacing-m" />
              </>
            )}
            <Button buttonType="submit" isLoading={isLoading} isBlock>
              Send recovery link
            </Button>
          </FormGroup>
          <div className={styles.formActions}>
            <div>
              <ButtonLink onClick={onClickSignup}>Create account</ButtonLink>
            </div>
            <div>
              <ButtonLink onClick={onClickSignin}>Login</ButtonLink>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default ForgotPassword;
