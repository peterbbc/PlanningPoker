import { createCustomer } from './../data/createCustomer';
import { useAppContext } from './../../app/hooks/useAppContext';
import { useState, useCallback, useEffect } from 'react';
import useCurrentUser from '../../auth/hooks/useCurrentUser';
export const useProceedToPayment = () => {
  const [isWaitingSignUp, setIsWaitingSignUp] = useState(false);
  const [isPurchaseNow, setIsPurchaseNow] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useAppContext().authModal;
  const { handleProceedToCreatePremium } = useAppContext();
  const { isAnonymous, user, uid } = useCurrentUser();

  const isPremium =
    user?.subscriptionStatus === 'active' ||
    user?.subscriptionStatus === 'trialing';

  const customerId = user ? user.customerId : null;

  const proceedToPayment = useCallback(
    (isNewUser: boolean) => {
      if (isPremium) {
        alert('You are already a premium user!');

        return;
      }

      if (isAnonymous) {
        alert('Please login with a registered account first');

        return;
      }

      if (!isLoading && (isNewUser || typeof customerId === 'undefined')) {
        setIsLoading(true);

        createCustomer()
          .catch((error) => {
            console.error(error);

            if (error.name === 'NO-EMAIL') {
              alert(`Unexpected error, please sign out and sign in again.`);
            }

            alert(`Unexpected error, ${error.message}.`);
          })
          .then(() => {
            handleProceedToCreatePremium(!!isPurchaseNow);
          })
          .finally(() => setIsLoading(false));
      } else {
        handleProceedToCreatePremium(!!isPurchaseNow);
      }
    },
    [
      isPremium,
      isLoading,
      uid,
      customerId,
      isAnonymous,
      isPurchaseNow,
      handleProceedToCreatePremium,
    ],
  );

  useEffect(() => {
    if (isAnonymous === false && isWaitingSignUp && !isLoading) {
      proceedToPayment(true);
    }
  }, [isWaitingSignUp, isAnonymous, proceedToPayment, isLoading]);

  useEffect(() => {
    if (!isAuthModalOpen && isWaitingSignUp) {
      setIsWaitingSignUp(false);
    }
  }, [isAuthModalOpen, isWaitingSignUp]);

  return {
    isLoading,
    handlePlansProceedClick: useCallback(
      (isPurchaseNow: boolean) => {
        const isRegistered = isAnonymous === false;

        setIsPurchaseNow(isPurchaseNow);

        if (isRegistered) {
          proceedToPayment(false);
        } else {
          setIsWaitingSignUp(true);
          setIsAuthModalOpen('sign-up');
        }
      },
      [proceedToPayment, isAnonymous],
    ),
  };
};
