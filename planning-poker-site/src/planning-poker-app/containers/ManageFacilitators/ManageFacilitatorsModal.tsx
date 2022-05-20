import { InlineAlert, Modal, ModalTitle } from '../../../packages/react-base';
import { User } from '../../../packages/types-planning-poker';
import React, { useEffect, useState } from 'react';
import { Loading } from '../../components/molecules/Loading/Loading';
import { subscribeToUser, updateUser } from '../../spaces/auth/data/user';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from '../../vendors/hotjar/identify';
import { isDeprecatedPirce } from '../../vendors/stripe/StripeElementsProvider';
import { InviteFacilitator } from './InviteFaciltator';

import { ManageFacilitators } from './ManageFacilitators';
import { ManageFacilitatorsQuantity } from './ManageFacilitatorsQuantity';
import { ManageFacilitatorsQuantityConfirm } from './ManageFacilitatorsQuantityConfirm';

interface ManageFacilitatorsModalProps {
  onClose: () => void;
}
export const ManageFacilitatorsModal = ({
  onClose,
}: ManageFacilitatorsModalProps) => {
  const [step, setStep] = useState<
    'manage' | 'invite' | 'update-plan' | 'update-plan-confirm'
  >('manage');
  const { user, uid, isPremium } = useCurrentUser();
  const [quantity, setQuantity] = useState<number | null | undefined>(null);
  const [premiumUser, setPremiumUser] = useState<User | null>(null);
  const [premiumUserUid, setPremiumUserUid] = useState<string | null>(null);

  const isDeprecated =
    premiumUser?.subscriptionPriceId &&
    isDeprecatedPirce(premiumUser?.subscriptionPriceId);

  const subscriptionQuantity =
    premiumUser?.subscriptionScheduledQuanity ||
    premiumUser?.subscriptionFacilitatorsQuantity ||
    1;

  useEffect(() => {
    if (premiumUserUid) return;

    if (isPremium && uid) {
      setPremiumUserUid(uid);

      return;
    }

    if (user?.canManageFacilitators && user?.facilitatorProvidedByUid) {
      setPremiumUserUid(user.facilitatorProvidedByUid);
    }
  }, [isPremium, user, uid, premiumUserUid]);

  useEffect(() => {
    if (!user) return;
    if (isPremium === false && !user.canManageFacilitators) {
      onClose();
    }
  }, [isPremium, user]);

  useEffect(() => {
    if (!premiumUserUid) return;

    return subscribeToUser(premiumUserUid, setPremiumUser);
  }, [premiumUserUid]);

  const isPremiumUserLoading = !premiumUser;
  const premiumUserFacilitators = premiumUser?.facilitators;
  useEffect(() => {
    if (
      !isPremiumUserLoading &&
      uid &&
      premiumUserUid &&
      uid === premiumUserUid &&
      !premiumUserFacilitators
    ) {
      updateUser(premiumUserUid, { facilitators: [uid] });
    }
  }, [uid, premiumUserUid, premiumUserFacilitators, isPremiumUserLoading]);

  useEffect(() => {
    if (!uid) return;

    hotjarIdentify(HOTJAR_IDENTIFY_KEYS.OPENED_MANAGE_FACILITATORS_MODAL, uid);
  }, [uid]);

  useEffect(() => {
    if (typeof subscriptionQuantity === 'number' && quantity === null) {
      setQuantity(subscriptionQuantity);
    }
  }, [subscriptionQuantity, quantity]);

  const sheduledQuantity = user?.subscriptionScheduledQuanity;

  const handleBackButton = () => {
    setStep('manage');

    if (typeof subscriptionQuantity === 'number') {
      setQuantity(subscriptionQuantity);
    }
  };

  if (isDeprecated) {
    return (
      <Modal onClose={onClose} width="medium-big">
        <ModalTitle>Manage facilitators</ModalTitle>
        <InlineAlert
          title="You have an old legacy subscription"
          content="Your subscription is compatible with having more than 1 facilitator. If you want this feature please cancel it and create a new premium plan."
        />
      </Modal>
    );
  }

  return (
    <Modal
      onClose={onClose}
      width="medium-big"
      showBackButton={step !== 'manage'}
      onClickBackButton={handleBackButton}
    >
      {premiumUser ? (
        <div>
          {step === 'manage' && (
            <ManageFacilitators
              onInvite={() => setStep('invite')}
              sheduledQuantity={sheduledQuantity}
              onUpdatePlanClick={() => {
                setStep('update-plan');
              }}
              premiumUser={premiumUser}
            />
          )}
          {step === 'invite' && (
            <>
              <ModalTitle>Invite new facilitator</ModalTitle>
              <InviteFacilitator
                onCancel={() => setStep('manage')}
                onSuccess={() => setStep('manage')}
                premiumUser={premiumUser}
              />
            </>
          )}
          {step === 'update-plan' &&
            quantity !== null &&
            typeof subscriptionQuantity === 'number' && (
              <ManageFacilitatorsQuantity
                subscriptionQuantity={subscriptionQuantity}
                sheduledQuantity={sheduledQuantity}
                quantity={quantity}
                onChangeQuantity={setQuantity}
                onConfirm={() => setStep('update-plan-confirm')}
                premiumUser={premiumUser}
              />
            )}
          {step === 'update-plan-confirm' && quantity && (
            <ManageFacilitatorsQuantityConfirm
              newFacilitatorsQuanity={quantity}
              onCancel={() => setStep('manage')}
              onUpdated={() => setStep('manage')}
            />
          )}
        </div>
      ) : (
        <Loading message="Just 1 second...." />
      )}
    </Modal>
  );
};
