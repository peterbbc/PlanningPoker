import { getMonthWithDayAndYearInLocalTime } from '../../../../../packages/js-base';
import { getTaxFromBillingDetails } from '../../../../../packages/js-base';
import {
  FlexBox,
  Paragraph,
  Span,
  VerticalSpacing,
} from '../../../../../packages/react-base';
import React from 'react';
import { BillingDetailsValue } from '../../../../components/organisms/BillingDetailsForm/BillingDetailsForm';
import {
  BillingType,
  BillingTypeRadio,
} from './BillingTypeRadio/BillingTypeRadio';

import styles from './Resume.module.scss';

interface ResumeProps {
  isPurchaseNow: boolean;
  billingDetails: BillingDetailsValue | null;
  billingType: BillingType;
  onChangeBillingType: (type: BillingType) => void;
  facilitatorsQuanitity: number | null;
}

export const Resume = ({
  isPurchaseNow,
  billingDetails,
  billingType,
  onChangeBillingType,
  facilitatorsQuanitity,
}: ResumeProps) => {
  const startingDate = getMonthWithDayAndYearInLocalTime(new Date(), 15);
  const tax = billingDetails ? getTaxFromBillingDetails(billingDetails) : 0;

  let unitPrice = billingType === 'yearly' ? 300 : 30;

  if (tax) {
    unitPrice = unitPrice + (tax / 100) * unitPrice;
  }

  const displayUnitPrice = Number.isInteger(unitPrice)
    ? unitPrice
    : (Math.round(unitPrice * 100) / 100).toFixed(2);

  let totalDisplayPrice;
  if (!!facilitatorsQuanitity) {
    const totalPrice = unitPrice * facilitatorsQuanitity;

    totalDisplayPrice = Number.isInteger(totalPrice)
      ? totalPrice
      : (Math.round(totalPrice * 100) / 100).toFixed(2);
  } else {
    totalDisplayPrice = '-';
  }

  return (
    <div className={styles.resume}>
      <Paragraph fontWeight="bold">Premium plan</Paragraph>
      <VerticalSpacing spacing="spacing-l" />
      <Paragraph size="small" fontWeight="bold">
        Billing cycle
      </Paragraph>
      <VerticalSpacing spacing="spacing-l" />
      <BillingTypeRadio value={billingType} onChange={onChangeBillingType} />

      <VerticalSpacing spacing="spacing-l" />
      <div className={styles.seperator} />
      <VerticalSpacing spacing="spacing-l" />
      <div>
        <FlexBox justifyContent="space-between">
          <Span size="small">{`$${displayUnitPrice} x ${
            facilitatorsQuanitity || '-'
          } Facilitator${
            facilitatorsQuanitity && facilitatorsQuanitity > 1 ? 's' : ''
          }`}</Span>
          <Span size="small">{`$${totalDisplayPrice}`}</Span>
        </FlexBox>
      </div>
      <VerticalSpacing spacing="spacing-l" />
      <div className={styles.seperator} />
      <VerticalSpacing spacing="spacing-l" />
      {isPurchaseNow ? (
        <div>
          <FlexBox justifyContent="space-between">
            <Span spanStyle="bold" size="small">
              Total today:
            </Span>
            <Span spanStyle="bold" size="small">{`$${totalDisplayPrice}`}</Span>
          </FlexBox>
          {tax && (
            <>
              <VerticalSpacing spacing="spacing-xxs" />
              <FlexBox justifyContent="end">
                <Span color="grey600" size="small">
                  {`Including ${tax}% VAT`}
                </Span>
              </FlexBox>
            </>
          )}
          <VerticalSpacing spacing="spacing-m" />
          <FlexBox justifyContent="space-between">
            <Span size="small">Then:</Span>
            <Span size="small">
              {billingType === 'yearly'
                ? `$${totalDisplayPrice}/year`
                : `$${totalDisplayPrice}/month`}
            </Span>
          </FlexBox>
        </div>
      ) : (
        <div className={styles.totals}>
          <FlexBox justifyContent="space-between">
            <Span spanStyle="bold" size="small">
              Total today:
            </Span>
            <Span spanStyle="bold" size="small">
              $0
            </Span>
          </FlexBox>
          <VerticalSpacing spacing="spacing-s" />
          <FlexBox justifyContent="space-between">
            <Span size="small">After trial:</Span>
            <div>
              <Span size="small">
                {billingType === 'yearly'
                  ? `$${totalDisplayPrice}/year`
                  : `$${totalDisplayPrice}/month`}
              </Span>
            </div>
          </FlexBox>
          {tax && (
            <>
              <VerticalSpacing spacing="spacing-xxs" />
              <FlexBox justifyContent="end">
                <Span color="grey600" size="small">
                  {`Including ${tax}% VAT`}
                </Span>
              </FlexBox>
            </>
          )}
          <VerticalSpacing spacing="spacing-xxs" />
          <FlexBox justifyContent="end">
            <Span color="grey600" size="small">
              Starting {startingDate}
            </Span>
          </FlexBox>
          <br />
        </div>
      )}
    </div>
  );
};
