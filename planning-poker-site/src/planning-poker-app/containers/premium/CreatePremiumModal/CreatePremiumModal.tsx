import {
  FlexBox,
  Modal,
  Button,
  VerticalSpacing,
  InlineAlert,
  Stepper,
  ModalTitle,
} from '../../../../packages/react-base';
import React, { useEffect, useState } from 'react';
import { Loader } from '../../../components/molecules/Loader/Loader';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';

import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from '../../../vendors/hotjar/identify';
import { Facilitators } from './steps/Facilitators/Facilitators';

import styles from './CreatePremiumModal.module.scss';
import {
  NO_COUNTRY_MESSAGE,
  INVALID_VAT_MESSAGE_2,
  saveBillingDetails,
} from '../actions/saveBillingDetails';
import {
  getTaxForCountry,
  isEuCountry,
} from '../../../../packages/js-base';
import { BillingDetails } from './steps/BillingDetails/BillingDetails';
import { Resume } from './Resume/Resume';
import { Payment } from './steps/Payment/Payment';
import { savePaymentMethod } from '../actions/savePaymentMethod';
import { StripeCardElement } from '@stripe/stripe-js';
import { useStripe } from '@stripe/react-stripe-js';
import { useCreateSubscription } from '../../../spaces/premium/hooks/useCreateSubscription';
import { BillingType } from './Resume/BillingTypeRadio/BillingTypeRadio';
import { BillingDetailsValue } from '../../../components/organisms/BillingDetailsForm/BillingDetailsForm';
import { updateCurrentUser } from '../../../spaces/auth/data/user';

interface CreatePremiumModalProps {
  isPurchaseNow: boolean;
  onClose: () => void;
  onGoBack: () => void;
  onPaymentSuccess: () => void;
}

const STEPS = [
  {
    value: 'facilitators',
    label: 'Adjust Facilitators',
    isClickable: true,
  },
  {
    value: 'billing',
    label: 'Billing Details',
    isClickable: true,
  },
  {
    value: 'payment',
    label: 'Payment Details',
    isClickable: false,
  },
];
export const CARD_INCOMPLETE_ERROR_MESSAGE = 'Please complete card details.';

const CTA_LABELS = {
  facilitators: 'Next: Billing details',
  billing: 'Next: Payment details',
  payment: 'Purchase',
};

type CreatePremiumModalStep = 'facilitators' | 'billing' | 'payment';

export const CreatePremiumModal = ({
  onClose,
  isPurchaseNow,
  onGoBack,
  onPaymentSuccess,
}: CreatePremiumModalProps) => {
  const [step, setStep] = useState<CreatePremiumModalStep>('facilitators');
  const [facilitatorsQuanitity, setFacilitatorsQuanitity] = useState<
    number | null
  >(1);
  const [billingType, setBillingType] = useState<BillingType>('monthly');
  const [isLoading, setIsLoading] = useState<string | boolean>(false);
  const [isCardComplete, setIsCardComplete] = useState<boolean | null>(false);
  const [isPaymentStepAvailable, setIsPaymentStepAvailable] = useState(false);
  const [billingDetails, setBillingDetails] =
    useState<BillingDetailsValue | null>(null);
  const [billingDetailsError, setBillingDetailsError] = useState<Error | null>(
    null,
  );
  const stripe = useStripe();
  const [paymentError, setPaymentError] = useState<Error | null>(null);

  const { createSubscription, retryInvoiceWithNewPaymentMethod } =
    useCreateSubscription();
  const { user, uid } = useCurrentUser();

  const customerId = user ? user.customerId : null;
  const customerAcceptedTerms = user?.customerAcceptedTerms || null;
  const hasCanceled = user?.subscriptionStatus === 'canceled';

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!uid) return;

    hotjarIdentify(HOTJAR_IDENTIFY_KEYS.OPENED_CREATE_PREMIUM_MODAL, uid);
  }, [uid]);

  useEffect(() => {
    // safety clear cache for when component gets mounted
    // If user refreshed page or something we will creat e anew subscription
    // and thats ok because current one isnt paid yet
    localStorage.removeItem('latestInvoiceId');
    localStorage.removeItem('latestInvoicePaymentIntentStatus');
  }, []);

  useEffect(() => {
    if (user && billingDetails === null) {
      setBillingDetails({
        name: user?.customerName || '',
        email: user?.customerEmail || '',
        address: user?.customerAddress || null,
        isParticular: !!user?.customerIsParticular,
        vatid:
          typeof user.customerTaxId === 'string'
            ? user.customerTaxId
            : user.customerTaxId?.value || '',
      });
    }
  }, [user, billingDetails]);

  const handleModalBackButtonClick = () => {
    if (step === 'payment') {
      setStep('billing');
    }
    if (step === 'billing') {
      setStep('facilitators');
    }
    if (step === 'facilitators') {
      onGoBack();
    }
  };

  const handleFacilitatorsSubmit = () => {
    setStep('billing');
  };

  const handleBillingDetailsSubmit = async () => {
    setBillingDetailsError(null);

    if (!billingDetails) return;

    setIsLoading(true);

    try {
      await saveBillingDetails(billingDetails);
      setIsPaymentStepAvailable(true);
      setStep('payment');
    } catch (e: any) {
      setIsPaymentStepAvailable(false);
      setBillingDetailsError(
        new Error(
          e?.message === INVALID_VAT_MESSAGE_2
            ? INVALID_VAT_MESSAGE_2
            : `Error saving VAT id. ${
                e.message ? `Reason: "${e.message}"` : ''
              }`,
        ),
      );
    }

    setIsLoading(false);
  };

  const handlePaymenSubmitSuccess = () => {
    onPaymentSuccess();
  };

  const handlePaymenSubmit = async (cardElement: StripeCardElement | null) => {
    setIsLoading(true);
    setPaymentError(null);

    try {
      if (!cardElement || !stripe) {
        throw new Error(
          'Something went wrong loading resources, please refresh page and try again.',
        );
      }

      if (!isCardComplete) {
        throw new Error(CARD_INCOMPLETE_ERROR_MESSAGE);
      }

      if (!customerAcceptedTerms) {
        updateCurrentUser({ customerAcceptedTerms: 'v1' });
      }

      const paymentMethodId = await savePaymentMethod(cardElement, stripe);

      // If a previous payment was attempted, retry last invoice  -------------------------
      const latestInvoicePaymentIntentStatus = localStorage.getItem(
        'latestInvoicePaymentIntentStatus',
      );
      if (
        latestInvoicePaymentIntentStatus === 'requires_payment_method' ||
        latestInvoicePaymentIntentStatus === 'requires_action'
      ) {
        setIsLoading('Validating payment method...');
        // Update the payment method and retry invoice payment
        const invoiceId = localStorage.getItem('latestInvoiceId');

        try {
          await retryInvoiceWithNewPaymentMethod({
            paymentMethodId,
            invoiceId: invoiceId,
            customerId,
          });

          setIsLoading(false);
          handlePaymenSubmitSuccess();
        } catch (error: any) {
          console.error(error);
          setIsLoading(false);
          setPaymentError(
            new Error(
              error?.message ||
                `Unexpected error happened when retrying the payment. Code: ${error?.error?.decline_code}`,
            ),
          );
        }

        return;
      }

      // Create premium plan  -------------------------------------------------------------
      setIsLoading('Creating premium plan...');
      try {
        if (!customerId) {
          throw new Error('Unexpected error: no customer id');
        }
        if (!facilitatorsQuanitity) {
          throw new Error('Unexpected error: no facilitators quanitity');
        }
        await createSubscription({
          customerId,
          paymentMethodId,
          billingType,
          isPurchaseNow,
          facilitatorsQuanitity,
        });

        setIsLoading(false);
        handlePaymenSubmitSuccess();
      } catch (error: any) {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        console.error(error);
        setIsLoading(false);
        setPaymentError(
          new Error(
            error?.message && error?.message !== 'INTERNAL'
              ? error?.message
              : `Unexpected error happened when creating your premium plan.`,
          ),
        );
      }
    } catch (e: any) {
      setIsLoading(false);
      setPaymentError(e);
    }
  };

  const euVAT = billingDetails?.address?.country && getTaxForCountry();

  return (
    <Modal
      onClose={handleClose}
      showBackButton={true}
      onClickBackButton={handleModalBackButtonClick}
      width="bigger"
      titleTopBar={
        step === 'payment' &&
        (hasCanceled ? 'Reactivate premium plan' : 'Create premium plan')
      }
    >
      <ModalTitle>Create premium account</ModalTitle>
      {customerId ? (
        <div className={styles.wrapper}>
          <div>
            <Stepper
              steps={STEPS.map((step) => {
                if (step.value === 'facilitators') {
                  return { ...step, isClickable: true };
                }
                if (step.value === 'billing') {
                  return { ...step, isClickable: !!facilitatorsQuanitity };
                }
                if (step.value === 'payment') {
                  return { ...step, isClickable: isPaymentStepAvailable };
                }

                return step;
              })}
              activeStep={step}
              onClickStep={(step) => setStep(step as CreatePremiumModalStep)}
            />
            <VerticalSpacing spacing="spacing-xxl" />
            {step === 'facilitators' && (
              <>
                <Facilitators
                  facilitatorsQuanitity={facilitatorsQuanitity}
                  onFacilitatorsQuanitityChange={setFacilitatorsQuanitity}
                  onSubmit={handleFacilitatorsSubmit}
                />
              </>
            )}
            {step === 'billing' && billingDetails && (
              <>
                <BillingDetails
                  billingDetails={billingDetails}
                  onChangeBillingDetails={setBillingDetails}
                  onSubmit={handleBillingDetailsSubmit}
                  isCountryOnError={
                    billingDetailsError?.message === NO_COUNTRY_MESSAGE
                      ? billingDetailsError?.message
                      : false
                  }
                />
              </>
            )}
            {step === 'payment' && (
              <Payment
                isDisabled={!!isLoading}
                onChangeCardComplete={setIsCardComplete}
                onSubmit={handlePaymenSubmit}
                errorMessage={paymentError?.message}
              />
            )}
          </div>
          <div>
            <Resume
              isPurchaseNow={isPurchaseNow}
              facilitatorsQuanitity={facilitatorsQuanitity}
              billingType={billingType}
              onChangeBillingType={setBillingType}
              billingDetails={billingDetails}
            />
            {billingDetails?.isParticular === false &&
              billingDetails?.address?.country &&
              isEuCountry(billingDetails?.address?.country) &&
              !billingDetails.vatid && (
                <>
                  <VerticalSpacing spacing="spacing-m" />
                  <InlineAlert
                    style="info"
                    size="small"
                    content={`Failure to supply a Value Added Tax (VAT) number requires us to add ${euVAT}% to your total bill.`}
                  />
                </>
              )}
            {billingDetails?.isParticular && (
              <>
                <VerticalSpacing spacing="spacing-m" />
                <InlineAlert
                  style="info"
                  content={`If it is not a business purchase we are required to add 21% VAT to your total bill.`}
                />
              </>
            )}

            {billingDetailsError?.message &&
              billingDetailsError?.message !== NO_COUNTRY_MESSAGE && (
                <>
                  <VerticalSpacing spacing="spacing-m" />
                  <InlineAlert
                    content={
                      billingDetailsError.message === INVALID_VAT_MESSAGE_2
                        ? `${INVALID_VAT_MESSAGE_2} It should start with your country code: ${billingDetails?.address?.country}`
                        : billingDetailsError.message
                    }
                  />
                </>
              )}
            <VerticalSpacing spacing="spacing-xxl" />

            <div className={styles.nextCtaContainer}>
              <Button
                form={`${step}-form`}
                isLoading={!!isLoading}
                buttonType="submit"
                isBlock
              >
                {CTA_LABELS[step]}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <FlexBox justifyContent="center">
          <Loader message="Loading checkout..." />
        </FlexBox>
      )}

      <VerticalSpacing spacing="spacing-xl" />
    </Modal>
  );
};
