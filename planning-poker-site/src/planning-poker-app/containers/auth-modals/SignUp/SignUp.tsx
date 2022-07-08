import {
  Button,
  ButtonLink,
  FormCheckbox,
  FormGroup,
  FormInput,
  HoritzontalSpacing,
  InlineAlert,
  useLocation,
  VerticalSpacing,
} from '../../../../packages/react-base';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  DISPLAY_NAME_MAX_LENGTH,
  AuthActionType,
} from '../../../spaces/auth/constants';
import { linkEmailCredentialToCurrentUser } from '../../../spaces/auth/data/auth';
import { updateCurrentUserWhenRegistered } from '../../../spaces/auth/data/user';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';

import styles from '../Auth.module.scss';

interface SignupProps {
  onClickSignin: () => void;
  onSuccess: () => void;
  isSubscribingToPremium: boolean;
}

const Signup: React.FC<SignupProps> = ({
  onClickSignin,
  onSuccess,
  isSubscribingToPremium,
}) => {
  const { user } = useCurrentUser();
  const location = useLocation();

  const inviteEmail = window.localStorage?.getItem('invite-email');

  const initialEmail =
    location?.pathname?.includes('facilitator-invite') &&
    typeof inviteEmail === 'string'
      ? inviteEmail
      : '';

  const [email, setEmail] = useState<string>(initialEmail);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.focus();
    }
  }, [inputRef]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (password.length < 6 || password.length > 32) {
      setErrorMessage('Password must be between 6 and 32 characters');
      return;
    }

    if (password !== repeatPassword) {
      setErrorMessage('Passwords are not the same');
      return;
    }

    if (!isAgreedToTerms) {
      setErrorMessage('Please accept our terms and conditions');
      return;
    }

    setErrorMessage(false);
    setIsLoading(true);

    linkEmailCredentialToCurrentUser(email, password)
      .then(function (res) {
        const user = res?.user;

        if (user) {
          dispatch({
            type: AuthActionType.USER_SIGNED_IN,
            uid: user.uid,
            email: user.email,
            isAnonymous: user.isAnonymous,
          });
        }

        updateCurrentUserWhenRegistered({ displayName })
          .then(() => {
            setIsLoading(false);
            setErrorMessage(false);

            onSuccess();
          })
          .catch((error) => {
            setIsLoading(false);
            setErrorMessage(error.message);
          });
      })
      .catch((error) => {
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

  const handleRepeatPasswordChange = (value: string) => {
    setRepeatPassword(value);
  };

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <FormInput
        value={email}
        name="email"
        type="email"
        label="Email"
        ref={inputRef}
        onChange={handleEmailChange}
        required
      />
      <FormInput
        value={password}
        label="Password"
        onChange={handlePasswordChange}
        autoComplete="new-password"
        type="password"
        name="pwd"
        required
      />

      <FormInput
        value={repeatPassword}
        label="Repeat password"
        onChange={handleRepeatPasswordChange}
        type="password"
        name="repeat-pwd"
        autoComplete="repeat-password"
        required
      />

      <FormInput
        value={displayName}
        label="Your display name"
        onChange={handleDisplayNameChange}
        type="text"
        name="display-name"
        autoComplete="display-name"
        maxLength={DISPLAY_NAME_MAX_LENGTH}
        required
      />

      <FormGroup isSubmit>
        {errorMessage && (
          <>
            <InlineAlert content={errorMessage} />
            <VerticalSpacing spacing="spacing-m" />
          </>
        )}
        <FormCheckbox
          isChecked={isAgreedToTerms}
          id="terms"
          label={
            <span>
              I agree to the{' '}
              <a href="/legal-notice" target="_blank">
                Legal notice
              </a>
              . For more information about privacy practices, see the{' '}
              <a href="/privacy-policy" target="_blank">
                Privacy Policy
              </a>
              .
            </span>
          }
          onChange={setIsAgreedToTerms}
        />
        <Button buttonType="submit" isLoading={isLoading} isBlock>
          {isSubscribingToPremium
            ? 'Signup and proceed to checkout'
            : 'Sign Up'}
        </Button>
      </FormGroup>
      <div className={styles.formActions}>
        <div>
          <span>Already have an account? </span>
          <HoritzontalSpacing spacing="spacing-xs" />
          <ButtonLink onClick={onClickSignin}>Login</ButtonLink>
        </div>
      </div>
    </form>
  );
};

export default Signup;
