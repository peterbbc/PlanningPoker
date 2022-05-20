import {
  Button,
  ButtonLink,
  FormGroup,
  FormInput,
  InlineAlert,
  VerticalSpacing,
} from '../../../../packages/react-base';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { signInWithEmailAndPassword } from '../../../spaces/auth/data/auth';

import styles from '../Auth.module.scss';

interface SigninProps {
  onSuccess: () => void;
  onClickSignup: () => void;
  onClickForgotPassword: () => void;
  isSubscribingToPremium: boolean;
}

const SignIn: React.FC<SigninProps> = ({
  onSuccess,
  onClickSignup,
  onClickForgotPassword,
  isSubscribingToPremium,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.focus();
    }
  }, [inputRef]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    signInWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoading(false);
        onSuccess();
      })
      .catch(function (error) {
        setIsLoading(false);
        setErrorMessage(error.message);
      });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <FormInput
        value={email}
        name="email"
        type="email"
        label="Email"
        onChange={handleEmailChange}
        ref={inputRef}
        required
      />
      <FormInput
        value={password}
        label="Password"
        onChange={handlePasswordChange}
        type="password"
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
          {isSubscribingToPremium ? 'Login and proceed to checkout' : 'Login'}
        </Button>
      </FormGroup>
      <div className={styles['form-actions']}>
        <div>
          <ButtonLink onClick={onClickSignup}>Create account</ButtonLink>
        </div>
        <div>
          <ButtonLink onClick={onClickForgotPassword}>Forgot?</ButtonLink>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
