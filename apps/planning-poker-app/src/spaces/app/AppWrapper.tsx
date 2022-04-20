import { NotificationType } from '@we-agile-you/types-planning-poker';
import { uuidv4 } from '@we-agile-you/js-base';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { CookiesBanner } from '../../containers/CookiesBanner/CookiesBanner';
import { ContactModal } from '../../containers/ContactModal/ContactModal';
import { Notifications, useLocation } from '@we-agile-you/react-base';
import {
  AuthModal,
  AuthModalIsOpen,
} from '../../containers/auth-modals/AuthModal';
import { MyAccountModal } from '../../containers/my-account/MyAccountModal/MyAccountModal';
import { PricingModal } from '../../containers/premium/PricingModal/PricingModal';
import { PaymentFailedAlert } from '../../containers/premium/PaymentFailedAlert/PaymentFailedAlert';
import {
  EditDisplayNameModal,
  EditDisplayNameModalIsOpen,
} from '../../containers/EditDisplayNameModal/EditDisplayNameModal';
import { MyGamesModal } from '../../containers/MyGamesModal/MyGamesModal';
import InvitePlayersModal from '../../containers/poker/InvitePlayersModal/InvitePlayersModal';
import SettingsModal from '../../containers/poker/SettingsModal/SettingsModal';
import { ManageFacilitatorsModal } from '../../containers/ManageFacilitators/ManageFacilitatorsModal';
import { CreatePremiumModal } from '../../containers/premium/CreatePremiumModal/CreatePremiumModal';
import { StripeElementsProvider } from '../../vendors/stripe/StripeElementsProvider';
import { CreatePremiumSuccessModal } from '../../containers/premium/CreatePremiumSuccessModal/CreatePremiumSuccessModal';
import { useHandleCampaignUrl } from '../tracking/useHandleCampaignUrl';
import { NotAcceptedTermsAlert } from '../../containers/premium/NotAcceptedTermsAlert/NotAcceptedTermsAlert';
import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from '../../vendors/hotjar/identify';
import useCurrentUser from '../auth/hooks/useCurrentUser';
import { VotingHistoryModal } from '../../containers/VotingHistoryModal/VotingHistoryModal';

interface AppWrapperProps {
  children: ReactNode;
}

type AppContextType = {
  notifications: {
    showNotification: (notification: Partial<NotificationType>) => void;
  };
  contactModal: [
    boolean | null,
    React.Dispatch<React.SetStateAction<boolean | null>>,
  ];
  authModal: [
    AuthModalIsOpen,
    React.Dispatch<React.SetStateAction<AuthModalIsOpen>>,
  ];
  myAccountModal: [
    boolean | null,
    React.Dispatch<React.SetStateAction<boolean | null>>,
  ];
  manageFacilitatorsModal: [
    boolean | null,
    React.Dispatch<React.SetStateAction<boolean | null>>,
  ];
  pricingModal: [
    boolean | null,
    React.Dispatch<React.SetStateAction<boolean | null>>,
  ];
  createPremiumModal: [
    boolean | null,
    React.Dispatch<React.SetStateAction<boolean | null>>,
  ];
  editDisplayNameModal: [
    EditDisplayNameModalIsOpen,
    React.Dispatch<React.SetStateAction<EditDisplayNameModalIsOpen>>,
  ];
  myGamesModal: [
    boolean | null,
    React.Dispatch<React.SetStateAction<boolean | null>>,
  ];
  votingHistoryModal: [
    boolean | null,
    React.Dispatch<React.SetStateAction<boolean | null>>,
  ];
  invitePlayersModal: [
    boolean | null,
    React.Dispatch<React.SetStateAction<boolean | null>>,
  ];
  settingsModal: [
    boolean | null,
    React.Dispatch<React.SetStateAction<boolean | null>>,
  ];
  handleProceedToCreatePremium: (isPurchaseNow: boolean) => void;
};

export const AppContext = React.createContext<AppContextType>({
  notifications: { showNotification: (_notification) => {} },
  contactModal: [null, (_isOpen) => {}],
  authModal: [null, (_isOpen) => {}],
  myAccountModal: [null, (_isOpen) => {}],
  manageFacilitatorsModal: [null, (_isOpen) => {}],
  pricingModal: [null, (_isOpen) => {}],
  createPremiumModal: [null, (_isOpen) => {}],
  editDisplayNameModal: [null, (_isOpen) => {}],
  myGamesModal: [null, (_isOpen) => {}],
  votingHistoryModal: [null, (_isOpen) => {}],
  invitePlayersModal: [null, (_isOpen) => {}],
  settingsModal: [null, (_isOpen) => {}],
  handleProceedToCreatePremium: () => {},
});

export const AppWrapper = ({ children }: AppWrapperProps) => {
  const [openNotifications, setOpenNotifiactions] = useState<
    NotificationType[]
  >([]);
  const [isContactOpen, setIsContactOpen] = useState<boolean | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<AuthModalIsOpen>(null);
  const [isMyAccountModalOpen, setIsMyAccountModalOpen] = useState<
    boolean | null
  >(null);
  const [isManageFacilitatorsModalOpen, setIsManageFacilitatorsModalOpen] =
    useState<boolean | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean | null>(
    null,
  );
  const [isCreatePremiumModalOpen, setIsCreatePremiumModalOpen] = useState<
    boolean | null
  >(null);
  const [isCreatePremiumSuccessModalOpen, setIsCreatePremiumSuccessModalOpen] =
    useState<boolean | null>(null);
  const [isEditDisplayNameModalOpen, setIsEditDisplayNameModalOpen] =
    useState<EditDisplayNameModalIsOpen>(null);
  const [isMyGamesModalOpen, setIsMyGamesModalOpen] = useState<boolean | null>(
    null,
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean | null>(
    null,
  );
  const [isVotingHistoryModalOpen, setIsVotingHistoryModalOpen] = useState<
    boolean | null
  >(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<
    boolean | null
  >(null);
  const [isPurchaseNow, setIsPurchaseNow] = useState<boolean | null>(null);
  const { uid } = useCurrentUser();

  const pathname = useLocation().pathname;

  useEffect(() => {
    if (pathname === '/manage-account/') {
      setIsMyAccountModalOpen(true);
    }
  }, [pathname]);

  useHandleCampaignUrl();

  const showNotification = (notification: Partial<NotificationType>) => {
    setOpenNotifiactions([
      ...openNotifications,
      {
        style: notification.style || 'success',
        title: notification.title || '',
        content: notification.content || '',
        uuid: uuidv4(),
      },
    ]);
  };

  const handleProceedToCreatePremium = useCallback(
    (isPurchaseNow: boolean) => {
      setIsPurchaseNow(isPurchaseNow);
      setIsCreatePremiumModalOpen(true);
      setIsPricingModalOpen(false);
      hotjarIdentify(HOTJAR_IDENTIFY_KEYS.PROCEEDED_TO_PAYMENT, uid);
    },
    [uid],
  );

  return (
    <>
      <AppContext.Provider
        value={{
          contactModal: [isContactOpen, setIsContactOpen],
          notifications: { showNotification },
          authModal: [isAuthModalOpen, setIsAuthModalOpen],
          myAccountModal: [isMyAccountModalOpen, setIsMyAccountModalOpen],
          manageFacilitatorsModal: [
            isManageFacilitatorsModalOpen,
            setIsManageFacilitatorsModalOpen,
          ],
          pricingModal: [isPricingModalOpen, setIsPricingModalOpen],
          createPremiumModal: [
            isCreatePremiumModalOpen,
            setIsCreatePremiumModalOpen,
          ],
          editDisplayNameModal: [
            isEditDisplayNameModalOpen,
            (is) => {
              setIsEditDisplayNameModalOpen(is);
            },
          ],
          myGamesModal: [isMyGamesModalOpen, setIsMyGamesModalOpen],
          invitePlayersModal: [isInviteModalOpen, setIsInviteModalOpen],
          settingsModal: [isSettingsModalOpen, setIsSettingsModalOpen],
          votingHistoryModal: [
            isVotingHistoryModalOpen,
            setIsVotingHistoryModalOpen,
          ],
          handleProceedToCreatePremium,
        }}
      >
        {children}

        <CookiesBanner />

        <PaymentFailedAlert />
        <NotAcceptedTermsAlert />

        {isContactOpen && (
          <ContactModal onClose={() => setIsContactOpen(false)} />
        )}

        <Notifications
          openNotifications={openNotifications}
          setOpenNotifiactions={setOpenNotifiactions}
        />

        {isPricingModalOpen && (
          <PricingModal onClose={() => setIsPricingModalOpen(false)} />
        )}

        {isCreatePremiumModalOpen && (
          <StripeElementsProvider>
            <CreatePremiumModal
              onClose={() => setIsCreatePremiumModalOpen(false)}
              isPurchaseNow={!!isPurchaseNow}
              onGoBack={() => {
                setIsCreatePremiumModalOpen(false);
                setIsPricingModalOpen(true);
              }}
              onPaymentSuccess={() => {
                setIsCreatePremiumModalOpen(false);
                setIsCreatePremiumSuccessModalOpen(true);
              }}
            />
          </StripeElementsProvider>
        )}

        {isCreatePremiumSuccessModalOpen && (
          <CreatePremiumSuccessModal
            onClose={() => setIsCreatePremiumSuccessModalOpen(false)}
          />
        )}

        {isMyAccountModalOpen && (
          <MyAccountModal onClose={() => setIsMyAccountModalOpen(false)} />
        )}

        {isManageFacilitatorsModalOpen && (
          <ManageFacilitatorsModal
            onClose={() => setIsManageFacilitatorsModalOpen(false)}
          />
        )}

        {isEditDisplayNameModalOpen && (
          <EditDisplayNameModal
            onClose={() => setIsEditDisplayNameModalOpen(false)}
            isPromptedModal={isEditDisplayNameModalOpen === 'prompted'}
          />
        )}

        {isAuthModalOpen && (
          <AuthModal
            authType={isAuthModalOpen || 'sign-up'}
            onChangeAuthType={setIsAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}

        {isMyGamesModalOpen && (
          <MyGamesModal onClose={() => setIsMyGamesModalOpen(false)} />
        )}

        {isInviteModalOpen && (
          <InvitePlayersModal onClose={() => setIsInviteModalOpen(false)} />
        )}

        {isVotingHistoryModalOpen && (
          <VotingHistoryModal
            onClose={() => setIsVotingHistoryModalOpen(false)}
          />
        )}

        {isSettingsModalOpen && (
          <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />
        )}
      </AppContext.Provider>
    </>
  );
};
