import React, { useEffect, useState } from 'react';
import {
  FlexBox,
  Paragraph,
  SubmitRow,
  Header4,
  VerticalSpacing,
  Span,
} from '../../../packages/react-base';
import {
  previewInvoice,
  PreviewInvoiceData,
} from '../../spaces/premium/data/previewInvoice';

import styles from './ManageFacilitators.module.scss';
import { updateCurrentUserSubscription } from '../../spaces/premium/data/updateCurrentUserSubscription';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { Loader } from '../../components/molecules/Loader/Loader';
import { isYearly } from '../../vendors/stripe/StripeElementsProvider';
import { getMonthWithDayInLocalTime } from '../../../packages/js-base';

interface ManageFacilitatorsQuantityProps {
  newFacilitatorsQuanity: number;
  onUpdated: () => void;
  onCancel: () => void;
}

export const ManageFacilitatorsQuantityConfirm = ({
  newFacilitatorsQuanity,
  onUpdated,
  onCancel,
}: ManageFacilitatorsQuantityProps) => {
  const { user, isTaxExempt } = useCurrentUser();

  const isYearlySubscription =
    user?.subscriptionPriceId && isYearly(user.subscriptionPriceId);

  const [
    previewInvoiceData,
    setPreviewInvoiceData,
  ] = useState<PreviewInvoiceData | null>(null);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);

  useEffect(() => {
    previewInvoice({
      newFacilitatorsQuanity,
    }).then(setPreviewInvoiceData);
  }, [newFacilitatorsQuanity]);

  const handleConfirm = () => {
    setIsUpdatingSubscription(true);
    updateCurrentUserSubscription({
      newFacilitatorsQuanity,
    })
      .then(() => {
        setIsUpdatingSubscription(false);
        onUpdated();
      })
      .catch((e) => {
        alert(e.message);
        setIsUpdatingSubscription(false);
      });
  };
  const price = isYearlySubscription
    ? isTaxExempt
      ? 300
      : 360
    : isTaxExempt
    ? 30
    : 36;

  if (!user || !previewInvoiceData) {
    return (
      <div className={styles['manage-facilitators-total']}>
        <Header4>Change plan</Header4>
        <VerticalSpacing spacing="spacing-xl" />
        <FlexBox justifyContent="center">
          <Loader message="Loading invoice preview..." />
        </FlexBox>
      </div>
    );
  }

  return (
    <div className={styles['manage-facilitators-total']}>
      <Header4>Change plan</Header4>
      <VerticalSpacing spacing="spacing-xl" />

      {user.subscriptionStatus === 'trialing' ? (
        <>
          <Paragraph>
            You are currently on trial period, so nothing will be charged untill
            trial period is over.<b></b>
          </Paragraph>
          <VerticalSpacing spacing="spacing-l" />
          <FlexBox justifyContent="space-between">
            <Span spanStyle="bold">{`New cost per ${
              isYearlySubscription ? 'year' : 'month'
            }: `}</Span>

            <Span spanStyle="bold">{`$${price} x ${newFacilitatorsQuanity} facilitator${
              newFacilitatorsQuanity > 1 ? 's' : ''
            }: $${newFacilitatorsQuanity * price}/${
              isYearlySubscription ? 'year' : 'month'
            }`}</Span>
          </FlexBox>
          <Paragraph color="grey500" align="right">
            {`Starting on 
                          ${
                            user.subscriptionCurrentPeriodEnd &&
                            getMonthWithDayInLocalTime(
                              user.subscriptionCurrentPeriodEnd,
                            )
                          }`}
          </Paragraph>
        </>
      ) : previewInvoiceData.isPayingNow && previewInvoiceData.invoice ? (
        <>
          {previewInvoiceData.invoice.lines?.data?.map((line, i) => (
            <>
              <FlexBox key={i} justifyContent="space-between">
                <Span>{line.description}</Span>
                <Span>
                  {line.amount < 0 && '-'}$
                  {(line.amount < 0 ? line.amount * -1 : line.amount) / 100}
                </Span>
              </FlexBox>
              <VerticalSpacing spacing="spacing-xs" />
            </>
          ))}
          <VerticalSpacing spacing="spacing-m" />
          <FlexBox justifyContent="space-between">
            <Span spanStyle="bold">Total to pay today:</Span>
            <Span spanStyle="bold">
              ${previewInvoiceData.invoice?.total / 100}
            </Span>
          </FlexBox>
          <VerticalSpacing spacing="spacing-xs" />
          <Paragraph align="right" color="grey500">
            {`Then $${newFacilitatorsQuanity * price}/${
              isYearlySubscription ? 'year' : 'month'
            }`}{' '}
          </Paragraph>
          {!isTaxExempt && (
            <Paragraph align="right" color="grey500">
              Including 21% VAT
            </Paragraph>
          )}
        </>
      ) : (
        <>
          <Paragraph>{`You have paid for ${user.subscriptionFacilitatorsQuantity} facilitators untill the end of billing period. We will reduce the quantity afterwards.`}</Paragraph>
          <VerticalSpacing spacing="spacing-xl" />
          <FlexBox justifyContent="space-between">
            <Span spanStyle="bold">{`New cost per ${
              isYearlySubscription ? 'year' : 'month'
            }: `}</Span>

            <Span spanStyle="bold">{`$${price} x ${newFacilitatorsQuanity} facilitator${
              newFacilitatorsQuanity > 1 ? 's' : ''
            }: $${newFacilitatorsQuanity * price}/${
              isYearlySubscription ? 'year' : 'month'
            }`}</Span>
          </FlexBox>
          <VerticalSpacing spacing="spacing-xs" />
          <Paragraph align="right" color="grey500">
            Total today: $0
          </Paragraph>
        </>
      )}

      <VerticalSpacing spacing="spacing-xl" />
      <SubmitRow
        cancelLabel="Cancel"
        onCancel={onCancel}
        onConfirm={handleConfirm}
        confirmLabel="Confirm plan change"
        align="right"
        isLoading={isUpdatingSubscription}
      />
    </div>
  );
};
