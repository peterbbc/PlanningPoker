import {
  Paragraph,
  VerticalSpacing,
  InputNumber,
  SubmitRow,
  FlexBox,
  InlineAlert,
  Header4,
  Span,
  Icon,
  HoritzontalSpacing,
} from '../../../packages/react-base';
import { User } from '../../../packages/types-planning-poker';
import React, { useState } from 'react';
import { useSubscribeToInvites } from '../../spaces/premium/hooks/useSubscribeToInvites';
import { isYearly } from '../../vendors/stripe/StripeElementsProvider';

import styles from './ManageFacilitators.module.scss';

interface ManageFacilitatorsQuantityProps {
  subscriptionQuantity: number;
  sheduledQuantity?: number;
  quantity?: number;
  onChangeQuantity: (quanity: number | undefined) => void;
  onConfirm: () => void;
  premiumUser: User;
}

export const ManageFacilitatorsQuantity = ({
  subscriptionQuantity,
  sheduledQuantity,
  quantity,
  onChangeQuantity,
  onConfirm,
  premiumUser,
}: ManageFacilitatorsQuantityProps) => {
  const invites = useSubscribeToInvites(premiumUser.uid);
  const [error, setError] = useState<Error | null>(null);

  if (!premiumUser?.subscriptionPriceId) return null;

  const isYearlySubscription = isYearly(premiumUser.subscriptionPriceId);
  const isIncreasingQuanitity =
    typeof quantity === 'number' && subscriptionQuantity < quantity;
  const isDecreasingQuanitity =
    typeof quantity === 'number' && subscriptionQuantity > quantity;
  const price = isYearlySubscription ? 300 : 30;

  const handleConfirm = async () => {
    if (typeof quantity === 'number' && quantity >= 1) {
      onConfirm();
    }
  };

  const totalInvites = invites?.length;
  const totalFacilitators = premiumUser.facilitators?.length;

  const minimumQuantity =
    typeof totalInvites === 'number' &&
    typeof totalFacilitators === 'number' &&
    totalInvites + totalFacilitators;

  const handleQuantityChange = (value: number | null) => {
    if (
      typeof minimumQuantity === 'number' &&
      typeof value === 'number' &&
      value < minimumQuantity
    ) {
      setError(new Error("You don't have enough empty seats."));
    } else {
      setError(null);
    }

    onChangeQuantity(value || undefined);
  };

  return (
    <div className={styles.manageFacilitatorsTotal}>
      <Header4>Change plan</Header4>
      <VerticalSpacing spacing="spacing-xs" />
      <Paragraph>
        You have a plan with <b>{subscriptionQuantity} facilitators</b>
      </Paragraph>
      <VerticalSpacing spacing="spacing-l" />
      <Paragraph fontWeight="bold">
        How many facilitators do you need?
      </Paragraph>
      <VerticalSpacing spacing="spacing-l" />
      {typeof sheduledQuantity === 'number' && (
        <>
          <VerticalSpacing spacing="spacing-m" />
          <InlineAlert
            style="info"
            title="You have sheduled a reduce of faciltiartors"
            content={`Now you have ${subscriptionQuantity} facilitators but on next billing period you will switch to ${sheduledQuantity} faciltiators`}
          />
        </>
      )}
      <div>
        <InputNumber
          value={quantity}
          required
          min={1}
          onChange={handleQuantityChange}
        />
      </div>
      <VerticalSpacing spacing="spacing-l" />
      {typeof quantity === 'number' && (
        <FlexBox justifyContent="space-between">
          <Span spanStyle="bold">{`${
            isIncreasingQuanitity || isDecreasingQuanitity ? 'New' : 'Current'
          } cost per ${isYearlySubscription ? 'year' : 'month'}: `}</Span>

          <Span spanStyle="bold">{`$${price} x ${quantity} facilitator${
            quantity > 1 ? 's' : ''
          }: $${quantity * price}/${
            isYearlySubscription ? 'year' : 'month'
          }`}</Span>
        </FlexBox>
      )}
      {error && (
        <>
          <VerticalSpacing spacing="spacing-xl" />
          <InlineAlert
            title={error.message}
            content="Please go back and remove some facilitator or invite and try again."
          />
        </>
      )}
      {(isIncreasingQuanitity || isDecreasingQuanitity) && (
        <>
          <VerticalSpacing spacing="spacing-xl" />
          <div className={styles.changePreview}>
            <FlexBox justifyContent="space-between">
              {isIncreasingQuanitity ? (
                <FlexBox
                  alignItems="center"
                  className={styles.changePreview__flexbox}
                >
                  <Span spanStyle="bold">1 upgrade</Span>
                  <HoritzontalSpacing spacing="spacing-s" />
                  <div className={styles.upgradeIcon}>
                    <Icon icon="upgrade" />
                  </div>
                </FlexBox>
              ) : (
                <FlexBox
                  alignItems="center"
                  className={styles.changePreview__flexbox}
                >
                  <Span spanStyle="bold">1 downgrade</Span>
                  <HoritzontalSpacing spacing="spacing-s" />
                  <div className={styles.downgradeIcon}>
                    <Icon icon="downgrade" />
                  </div>
                </FlexBox>
              )}
              <SubmitRow
                isDisabled={!!error}
                confirmLabel="Next: preview invoice"
                cancelLabel="Cancel"
                onCancel={() => onChangeQuantity(subscriptionQuantity)}
                onConfirm={handleConfirm}
              />
            </FlexBox>
          </div>
        </>
      )}
    </div>
  );
};
