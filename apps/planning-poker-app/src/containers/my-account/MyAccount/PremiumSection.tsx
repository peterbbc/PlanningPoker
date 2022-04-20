import {
  Button,
  FlexBox,
  HoritzontalSpacing,
  Span,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import { User } from '@we-agile-you/types-planning-poker';
import React from 'react';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';

import styles from '../MyAccount.module.scss';
import { ActiveSince } from './ActiveSince';
import { BillingDetails } from './BillingDetails';
import { Facilitators } from './Facilitators';
import { NextInovice } from './NextInvocie';
import { PaymentMethod } from './PaymentMethod';
import { SubscriptionActions } from './SubscriptionActions';
import { SusbcriptionTitle } from './SusbcriptionTitle';
import { SwitchToYearlyBanner } from './SwitchToYearlyBanner';

interface PremiumSectionProps {
  user: User;
  isPremium: boolean;
  isFacilitator: boolean;
}

export const PremiumSection = ({
  user,
  isPremium,
  isFacilitator,
}: PremiumSectionProps) => {
  const setIsPricingModalOpen = useAppContext().pricingModal[1];
  const setIsMyAccountModalOpen = useAppContext().myAccountModal[1];

  switch (user.subscriptionStatus) {
    case 'trialing':
    case 'active':
      return (
        <div>
          <VerticalSpacing spacing="spacing-xxl-4" />
          <SusbcriptionTitle user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <SwitchToYearlyBanner user={user} isPremium={isPremium} />
          <ActiveSince user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <Facilitators user={user} />
          <VerticalSpacing spacing="spacing-l" />
          <NextInovice user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <PaymentMethod user={user} />
          <VerticalSpacing spacing="spacing-l" />
          <BillingDetails />
          <VerticalSpacing spacing="spacing-l" />
          <SubscriptionActions user={user} />
          <VerticalSpacing spacing="spacing-l" />
        </div>
      );
    case 'canceled':
      return (
        <div>
          <VerticalSpacing spacing="spacing-xxl-4" />
          <SusbcriptionTitle user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <ActiveSince user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <NextInovice user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <SubscriptionActions user={user} />
          <VerticalSpacing spacing="spacing-l" />
        </div>
      );
    case 'unpaid':
      return (
        <div>
          <VerticalSpacing spacing="spacing-xxl-4" />
          <SusbcriptionTitle user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <ActiveSince user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <NextInovice user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <PaymentMethod user={user} />
          <VerticalSpacing spacing="spacing-l" />
          <BillingDetails />
        </div>
      );
    case 'past_due':
      return (
        <div>
          <VerticalSpacing spacing="spacing-xxl-4" />
          <SusbcriptionTitle user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <ActiveSince user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <NextInovice user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <PaymentMethod user={user} />
          <VerticalSpacing spacing="spacing-l" />
          <BillingDetails />
          <VerticalSpacing spacing="spacing-l" />
          <SubscriptionActions user={user} />
        </div>
      );
    case 'incomplete':
      return (
        <div>
          <VerticalSpacing spacing="spacing-xxl-4" />
          <SusbcriptionTitle user={user} isPremium={isPremium} />
          <VerticalSpacing spacing="spacing-l" />
          <PaymentMethod user={user} />
          <VerticalSpacing spacing="spacing-l" />
          <BillingDetails />
        </div>
      );
    default:
      if (isPremium) return null;

      if (isFacilitator) {
        return (
          <>
            <VerticalSpacing spacing="spacing-xl" />
            <FlexBox alignItems="center">
              <span
                role="img"
                aria-label="crown"
                className={styles['display-name-label-icon']}
              >
                👑
              </span>
              <HoritzontalSpacing spacing="spacing-s" />
              <Span spanStyle="bold">You are a facilitator</Span>
            </FlexBox>
          </>
        );
      }

      return (
        <div>
          <VerticalSpacing spacing="spacing-xxl-4" />

          <div className={styles['go-unlimited-box']}>
            <Button
              isBlock
              onClick={() => {
                setIsMyAccountModalOpen(false);
                setIsPricingModalOpen(true);
              }}
            >
              Go premium
            </Button>
          </div>
        </div>
      );
  }
};
