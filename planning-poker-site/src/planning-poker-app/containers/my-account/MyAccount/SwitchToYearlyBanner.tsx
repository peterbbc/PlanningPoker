import {
  ButtonLink,
  FlexBox,
  HoritzontalSpacing,
  Span,
  VerticalSpacing,
} from '../../../../packages/react-base';
import { User } from '../../../../packages/types-planning-poker';
import React, { useContext } from 'react';
import { STRIPE_PRICES_IDS } from '../../../vendors/stripe/StripeElementsProvider';

import styles from '../MyAccount.module.scss';
import { MyAccountModalInnerContext } from '../MyAccountModal/MyAccountModal';
import offer from './offer.svg';

interface SwitchToYearlyBannerProps {
  user: User;
  isPremium: boolean;
}

export const SwitchToYearlyBanner = ({
  user,
  isPremium,
}: SwitchToYearlyBannerProps) => {
  const { setCurrentStep } = useContext(MyAccountModalInnerContext);

  const priceId = user.subscriptionPriceId;

  if (
    !isPremium ||
    priceId === STRIPE_PRICES_IDS.yearly ||
    priceId === STRIPE_PRICES_IDS.montlhyDeprecated
  )
    return null;

  return (
    <>
      <FlexBox
        justifyContent="space-between"
        alignItems="center"
        className={styles['switch-to-yearly']}
      >
        <FlexBox alignItems="center">
          <FlexBox
            alignItems="center"
            justifyContent="center"
            className={styles['switch-to-yearly__icon']}
          >
            <img src={offer} alt="Percentage icon" />
          </FlexBox>
          <Span spanStyle="bold">Switch to yearly and get 16% off</Span>
        </FlexBox>
        <ButtonLink
          className={styles['switch-to-yearly__cta']}
          onClick={() => setCurrentStep('switch-to-yearly')}
        >
          Switch to yearly
        </ButtonLink>
        <HoritzontalSpacing spacing="spacing-m" />
      </FlexBox>
      <VerticalSpacing spacing="spacing-l" />
    </>
  );
};
