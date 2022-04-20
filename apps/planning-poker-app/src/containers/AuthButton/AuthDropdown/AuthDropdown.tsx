import {
  Button,
  DropdownItem,
  HoritzontalSpacing,
  Icon,
  ProBadge,
  ProfileImage,
  Switch,
} from '@we-agile-you/react-base';
import React from 'react';

import { updateCurrentUser } from '../../../spaces/auth/data/user';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { DEFAULT_DISPLAY_NAME } from '../../../spaces/poker-table/constants';
import styles from './AuthDropdown.module.scss';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';
import { useAuthActions } from '../../../spaces/auth/hooks/useAuthActions';
import { Crown } from '../../../components/atoms/Crown/Crown';

interface AuthDropdownProps {
  onClose: () => void;
}
export const AuthDropdown = ({ onClose }: AuthDropdownProps) => {
  const { user, isAnonymous, isPremium, isFacilitator } = useCurrentUser();
  const { signOut } = useAuthActions();

  const appContext = useAppContext();

  const setIsPricingModalOpen = appContext.pricingModal[1];
  const setIsOpenAuthType = appContext.authModal[1];
  const setIsMyAccountModalOpen = appContext.myAccountModal[1];
  const setIsManageFacilitatorsModal = appContext.manageFacilitatorsModal[1];
  const setIsContactModalOpen = appContext.contactModal[1];
  const setIsEditDisplayNameModalOpen = appContext.editDisplayNameModal[1];
  const setIsMyGamesModalOpen = appContext.myGamesModal[1];

  const isGuestOrRegistered = !!user?.displayName || !isAnonymous;

  const handleSpectatorToggleChange = (isChecked: boolean) => {
    updateCurrentUser({
      isSpectator: isChecked,
    });
  };

  return (
    <div className={styles['dropdown']}>
      {isGuestOrRegistered && (
        <>
          <div className={styles['display-name-box']}>
            <ProfileImage
              size="xl"
              src={user?.profilePictureUrl}
              alt={user?.displayName || DEFAULT_DISPLAY_NAME}
              onClick={() => {
                setIsEditDisplayNameModalOpen(true);
                onClose();
              }}
            />
            <div className={styles['display-name-wrapper']}>
              <div
                className={styles['display-name']}
                onClick={() => {
                  setIsEditDisplayNameModalOpen(true);
                  onClose();
                }}
              >
                <span className={styles['display-name-value']}>
                  {user?.displayName || DEFAULT_DISPLAY_NAME}{' '}
                </span>
                <Icon icon="pencil" />
              </div>
              {(isPremium || isFacilitator) && (
                <div className={styles['display-name-label-wrapper']}>
                  <span className={styles['display-name-label-icon']}>
                    <Crown type="user" />
                  </span>
                  <span className={styles['display-name-label']}>
                    {isPremium ? 'Premium' : 'Facilitator'}
                  </span>
                </div>
              )}
              {isAnonymous && (
                <div className={styles['display-name-label-wrapper']}>
                  <span className={styles['display-name-label']}>
                    Guest user
                  </span>
                </div>
              )}
            </div>
          </div>
          {!isPremium && !isFacilitator && (
            <div className={styles['go-unlimited-box']}>
              <Button
                onClick={() => {
                  setIsPricingModalOpen(true);
                  onClose();
                }}
                isBlock
              >
                Go premium
              </Button>
            </div>
          )}

          <div className={styles['divider']} />

          <DropdownItem
            label="My games"
            icon={<Icon icon="cards" />}
            onClick={() => {
              if (isFacilitator) {
                setIsMyGamesModalOpen(true);
              } else {
                setIsPricingModalOpen(true);
              }
              onClose();
            }}
            rightContent={
              <div>
                <ProBadge />
                <HoritzontalSpacing spacing="spacing-s" />
              </div>
            }
          />

          <DropdownItem
            label="Spectator mode"
            icon={<Icon icon="eye2" />}
            rightContent={
              <div>
                <Switch isChecked={!!user?.isSpectator} />
                <HoritzontalSpacing spacing="spacing-xxs" />
              </div>
            }
            onClick={() => handleSpectatorToggleChange(!user?.isSpectator)}
          />
        </>
      )}
      {!isAnonymous && (
        <DropdownItem
          onClick={() => {
            setIsMyAccountModalOpen(true);
            onClose();
          }}
          label="My account"
          icon={<Icon icon="cog" />}
        />
      )}
      {(isPremium || user?.canManageFacilitators) && (
        <DropdownItem
          onClick={() => {
            setIsManageFacilitatorsModal(true);
            onClose();
          }}
          label="Manage facilitators"
          icon={<Icon icon="manage-facilitators" />}
        />
      )}
      {!isAnonymous && <div className={styles['divider']} />}
      {/* ----- Join us block */}
      {isAnonymous && user?.displayName && (
        <>
          <DropdownItem
            label="Login"
            icon={<Icon icon="login" />}
            onClick={() => {
              setIsOpenAuthType('sign-in');
              onClose();
            }}
          />
          <DropdownItem
            label="Sign up"
            icon={<Icon icon="user-new" />}
            onClick={() => {
              setIsOpenAuthType('sign-up');
              onClose();
            }}
          />
          <div className={styles['divider']} />
        </>
      )}
      {/* ----- Permanent block */}
      <DropdownItem
        label="Contact us"
        icon={<Icon icon="comment" />}
        onClick={() => {
          setIsContactModalOpen(true);
          onClose();
        }}
      />
      <a className={styles['item-link']} href="/legal-notice" target="_blank">
        <DropdownItem label="Legal notice" icon={<Icon icon="shield" />} />
      </a>
      <a className={styles['item-link']} href="/faqs" target="_blank">
        <DropdownItem label="FAQs" icon={<Icon icon="hilfe" />} />
      </a>
      {/* ----- Signout block */}
      {isGuestOrRegistered && (
        <>
          <div className={styles['divider']} />
          <DropdownItem
            label="Sign out"
            icon={<Icon icon="union" />}
            onClick={signOut}
          />
        </>
      )}
    </div>
  );
};
