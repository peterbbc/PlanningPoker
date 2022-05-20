import {
  BurgerMenuItem,
  Button,
  HoritzontalSpacing,
  Icon,
  ProBadge,
  ProfileImage,
  Switch,
  VerticalSpacing,
} from '../../../packages/react-base';
import React from 'react';
import cx from 'classnames';
import { useAppContext } from '../../spaces/app/hooks/useAppContext';
import { updateCurrentUser } from '../../spaces/auth/data/user';
import { useAuthActions } from '../../spaces/auth/hooks/useAuthActions';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { DEFAULT_DISPLAY_NAME } from '../../spaces/poker-table/constants';

import styles from './BurgerMenu.module.scss';
import { LogoIcon } from '../../components/atoms/LogoIcon/LogoIcon';
import { Link } from '../../components/atoms/Link/Link';

interface BurgerMenuProps {
  onClose: () => void;
  isPoker?: boolean;
}

export const BurgerMenu = ({ onClose, isPoker }: BurgerMenuProps) => {
  const { user, isAnonymous, isPremium, isFacilitator } = useCurrentUser();
  const { signOut } = useAuthActions();

  const appContext = useAppContext();

  const setIsPricingModalOpen = appContext.pricingModal[1];
  const setIsOpenAuthType = appContext.authModal[1];
  const setIsMyAccountModalOpen = appContext.myAccountModal[1];
  const setIsContactModalOpen = appContext.contactModal[1];
  const setIsEditDisplayNameModalOpen = appContext.editDisplayNameModal[1];
  const setIsMyGamesModalOpen = appContext.myGamesModal[1];
  const setIsSettingsModalOpen = appContext.settingsModal[1];
  const setIsInviteModalOpen = appContext.invitePlayersModal[1];

  const isGuestOrRegistered = !!user?.displayName || !isAnonymous;

  const handleSpectatorToggleChange = (isChecked: boolean) => {
    updateCurrentUser({
      isSpectator: isChecked,
    });
  };

  return (
    <aside className={styles['burger-menu']}>
      <div className={styles['top']}>
        <div className={styles['spacer-top']} />
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
          <HoritzontalSpacing spacing="spacing-m" />
          <div>
            <div
              onClick={() => {
                setIsEditDisplayNameModalOpen(true);
                onClose();
              }}
              className={styles['display-name']}
            >
              <span className={styles['display-name-value']}>
                {user?.displayName || DEFAULT_DISPLAY_NAME}
              </span>
              <Icon icon="pencil" />
            </div>
            {(isPremium || isFacilitator) && (
              <div className={styles['display-name-label-wrapper']}>
                <span
                  className={styles['display-name-label-icon']}
                  role="img"
                  aria-label="crown"
                >
                  👑
                </span>{' '}
                <span className={styles['display-name-label']}>
                  {isPremium ? 'Premium' : 'Facilitator'}
                </span>
              </div>
            )}
            {isAnonymous && (
              <div className={styles['display-name-label-wrapper']}>
                <span className={styles['display-name-label']}>Guest user</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          {!isPremium && !isFacilitator && (
            <Button
              isBlock
              onClick={() => {
                setIsPricingModalOpen(true);
                onClose();
              }}
            >
              Go premium
            </Button>
          )}
          {isPoker && (
            <>
              <VerticalSpacing spacing="spacing-m" />
              <Button
                isBlock
                buttonStyle="secondary"
                icon={<Icon icon="invite" />}
                onClick={() => {
                  setIsInviteModalOpen(true);
                  onClose();
                }}
              >
                Invite players
              </Button>
            </>
          )}
        </div>

        <BurgerMenuItem
          label="My games"
          icon={<Icon icon="cards" />}
          onClick={() => {
            if (isPremium || isFacilitator) {
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

        <BurgerMenuItem
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

        {!isAnonymous && (
          <BurgerMenuItem
            onClick={() => {
              setIsMyAccountModalOpen(true);
              onClose();
            }}
            label="My account"
            icon={<Icon icon="cog" />}
          />
        )}

        <div className={styles['divider']} />

        {isPoker && (
          <>
            <BurgerMenuItem
              label="Current game settings"
              icon={<Icon icon="cog" />}
              onClick={() => {
                setIsSettingsModalOpen(true);
                onClose();
              }}
            />
            <div className={styles['divider']} />
          </>
        )}
        {/* ----- Join us block */}
        {isAnonymous && (
          <>
            <BurgerMenuItem
              label="Login"
              icon={<Icon icon="login" />}
              onClick={() => {
                setIsOpenAuthType('sign-in');
                onClose();
              }}
            />
            <BurgerMenuItem
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
        <BurgerMenuItem
          label="Contact us"
          icon={<Icon icon="comment" />}
          onClick={() => {
            setIsContactModalOpen(true);
            onClose();
          }}
        />
        <a className={styles['item-link']} href="/legal-notice" target="_blank">
          <BurgerMenuItem label="Legal notice" icon={<Icon icon="shield" />} />
        </a>
        <a className={styles['item-link']} href="/faqs">
          <BurgerMenuItem label="FAQs" icon={<Icon icon="hilfe" />} />
        </a>
        {(isPoker || isGuestOrRegistered) && (
          <div className={styles['divider']} />
        )}
        {isPoker && (
          <Link to="/">
            <BurgerMenuItem
              label="Go to home page"
              icon={<LogoIcon color="grey500" />}
            />
          </Link>
        )}
        {/* ----- Signout block */}
        {isGuestOrRegistered && (
          <>
            <BurgerMenuItem
              label="Sign out"
              icon={<Icon icon="union" />}
              onClick={signOut}
            />
          </>
        )}
        <div
          className={cx(
            styles['spacer-bottom'],
            isPoker && styles['spacer-bottom--poker'],
          )}
        />
      </div>
    </aside>
  );
};
