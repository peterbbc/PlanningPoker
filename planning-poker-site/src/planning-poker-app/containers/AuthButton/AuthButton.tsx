import {
  ButtonDropdown,
  ButtonLink,
  HoritzontalSpacing,
  ProfileImage,
} from '../../../packages/react-base';
import React, { useState } from 'react';

import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { DEFAULT_DISPLAY_NAME } from '../../spaces/poker-table/constants';
import { AuthDropdown } from './AuthDropdown/AuthDropdown';
import styles from './AuthButton.module.scss';
import { useAppContext } from '../../spaces/app/hooks/useAppContext';

interface AuthButtonProps {
  buttonColor: 'light' | 'primary';
}

export const AuthButton: React.FC<AuthButtonProps> = ({ buttonColor }) => {
  const { user, isAnonymous } = useCurrentUser();
  const setIsOpenAuthType = useAppContext().authModal[1];
  const [isOpen, setIsOpen] = useState(false);

  if (user === null) return null;

  if (isAnonymous && !user.displayName) {
    return (
      <div className={styles['dropdown-logout']}>
        <ButtonLink
          onClick={() => setIsOpenAuthType('sign-up')}
          buttonColor={buttonColor}
        >
          Sign Up
        </ButtonLink>
        <HoritzontalSpacing spacing="spacing-xl" />
        <ButtonLink
          onClick={() => setIsOpenAuthType('sign-in')}
          buttonColor={buttonColor}
          fontWeight={buttonColor === 'light' ? 'normal' : 'bold'}
        >
          Login
        </ButtonLink>
      </div>
    );
  }

  return (
    <ButtonDropdown
      align="bottom"
      isLight={buttonColor === 'light'}
      isOpen={isOpen}
      onIsOpenChange={(isOpen) => setIsOpen(isOpen)}
      dropdown={<AuthDropdown onClose={() => setIsOpen(false)} />}
      translate="no"
    >
      <span className={styles['display-name-picture']}>
        <ProfileImage
          src={user?.profilePictureUrl}
          alt={user?.displayName || DEFAULT_DISPLAY_NAME}
        />
      </span>
      <span className={styles.name}>
        {user?.displayName || DEFAULT_DISPLAY_NAME}
      </span>
    </ButtonDropdown>
  );
};
