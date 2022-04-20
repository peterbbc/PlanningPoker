import {
  Button,
  ButtonLink,
  FlexBox,
  Header4,
  HoritzontalSpacing,
  Icon,
  Paragraph,
  Span,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React from 'react';
import cx from 'classnames';
import { BasicFeatures } from '../Features/BasicFeatures';
import { PremiumFeatures } from '../Features/PremiumFeatures';

import styles from './Plan.module.scss';
import useCurrentUser from '../../../../spaces/auth/hooks/useCurrentUser';
import { useAppContext } from '../../../../spaces/app/hooks/useAppContext';
import { Link } from '../../../../components/atoms/Link/Link';
type Plan = 'basic' | 'premium';

interface PlanProps {
  plan: Plan;
  onClose: () => void;
  isLoading?: boolean;
  onProceed: (purchaseNow: boolean) => void;
}

const plans = {
  basic: {
    title: 'Basic',
    subtitle:
      'For making planning poker sessions fun and efficient. Limited functionality.',
    price: 0,
  },
  premium: {
    title: 'Premium',
    subtitle:
      'Best for organizations with one or multiple teams. Full functionality.',
    price: 30,
  },
};

export const Plan = ({ plan, isLoading, onProceed, onClose }: PlanProps) => {
  const { isPremium } = useCurrentUser();
  const setIsMyAccountModalOpen = useAppContext().myAccountModal[1];
  const isCurrentPlan =
    (plan === 'basic' && !isPremium) || (plan === 'premium' && isPremium);

  return (
    <div
      className={cx(
        styles['plan'],
        plan === 'premium' && styles['plan--is-premium'],
      )}
    >
      <VerticalSpacing spacing="spacing-l" />
      <Header4>{plans[plan].title}</Header4>
      <VerticalSpacing spacing="spacing-xs" />
      <Paragraph>{plans[plan].subtitle}</Paragraph>
      <VerticalSpacing spacing="spacing-l" />
      <FlexBox alignItems="center" className={styles['price-container']}>
        <div className={styles['price']}>${plans[plan].price}</div>
        <HoritzontalSpacing spacing="spacing-xs" />
        {plan === 'premium' && (
          <>
            <div>
              <Paragraph fontWeight="bold">
                <span>per </span>
                <Span
                  tooltip="Users who can create premium games, usually scrum masters."
                  spanStyle="bold"
                >
                  facilitator
                </Span>
                <span> / month</span>
              </Paragraph>
              <VerticalSpacing spacing="spacing-xxs" />
              <Paragraph color="grey600">or 300$ billed yearly</Paragraph>
            </div>
            <div className={styles['price-help']}>
              <Span
                color="grey600"
                tooltipPosition="bottom-left"
                spanStyle="regular"
                hideUnderline
                tooltip={
                  <div className={styles['info-dropdown']}>
                    <Paragraph size="small" color="white" align="left">
                      One facilitator is usually enough for small organizations,
                      big ones might want one for each scrum master or team
                      manager.
                    </Paragraph>
                    <VerticalSpacing spacing="spacing-s" />
                    <Paragraph size="small" color="white" align="left">
                      Invited players can always play for free.
                    </Paragraph>
                  </div>
                }
              >
                <Icon icon="info" />
              </Span>
            </div>
          </>
        )}
      </FlexBox>
      <VerticalSpacing spacing="spacing-l" />
      <div className={styles['cta-container']}>
        {isCurrentPlan ? (
          <Link to="new-game" className={styles['cta-new-game']}>
            <Button
              isBlock
              buttonStyle={plan === 'premium' ? 'secondary' : 'tertiary'}
            >
              {plan === 'premium'
                ? 'Create a premium game now'
                : 'Create a free game now'}
            </Button>
          </Link>
        ) : plan === 'premium' ? (
          <>
            <Button
              isLoading={isLoading}
              isBlock
              onClick={() => onProceed(false)}
            >
              Start a 15-day trial
            </Button>
            <Paragraph color="grey500">
              or{' '}
              <ButtonLink
                isDisabled={isLoading}
                onClick={() => onProceed(true)}
              >
                purchase now
              </ButtonLink>
            </Paragraph>
          </>
        ) : (
          <>
            <Button
              isLoading={isLoading}
              isBlock
              onClick={() => {
                onClose();
                setIsMyAccountModalOpen(true);
              }}
              buttonStyle="tertiary"
            >
              Go back to free plan
            </Button>
          </>
        )}
      </div>
      <VerticalSpacing spacing="spacing-l" />
      <Paragraph fontWeight="bold">
        {plan === 'basic' ? 'Free with limits' : 'Everything in Basic, plus'}
      </Paragraph>
      <VerticalSpacing spacing="spacing-m" />
      {plan === 'basic' ? <BasicFeatures /> : <PremiumFeatures />}
      <VerticalSpacing spacing="spacing-l" />
    </div>
  );
};
