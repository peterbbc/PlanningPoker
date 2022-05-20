import {
  getHumanMoneyFromStripeMoney,
  getMonthWithDayAndYearInLocalTime,
} from '../../../../packages/js-base';
import {
  ButtonLink,
  FlexBox,
  Paragraph,
  VerticalSpacing,
} from '../../../../packages/react-base';
import { Invoice, User } from '../../../../packages/types-planning-poker';
import React, { useEffect, useState } from 'react';
import { previewInvoice } from '../../../spaces/premium/data/previewInvoice';

import { MyInvoicesModal } from '../../MyInvociesModal/MyInvoicesModal';
import styles from '../MyAccount.module.scss';

interface NextInoviceProps {
  user: User;
  isPremium: boolean;
}

export const NextInovice = ({ user, isPremium }: NextInoviceProps) => {
  const [isInvoicesModalOpen, setIsInvoicesModalOpen] = useState(false);
  const [nextInvoice, setNextInvoice] = useState<Invoice | null>(null);

  const hasNextInvoice =
    user?.subscriptionStatus &&
    user.subscriptionStatus !== 'past_due' &&
    user.subscriptionStatus !== 'unpaid' &&
    user.subscriptionStatus !== 'canceled';
  useEffect(() => {
    if (hasNextInvoice) {
      previewInvoice({}).then(({ invoice }) => setNextInvoice(invoice));
    }
  }, [hasNextInvoice]);

  return (
    <>
      <div className={styles['subsection']}>
        <FlexBox justifyContent="space-between">
          {hasNextInvoice ? (
            <div>
              <h3 className={styles['section-subtitle']}>Next invoice</h3>
              {!nextInvoice ? (
                <Paragraph color="grey500">Loading...</Paragraph>
              ) : (
                <>
                  <p className={styles['section-value']}>
                    {/* TODO: remove the hardcoded fallback 9.99 at november 3rd 2020 */}
                    {getHumanMoneyFromStripeMoney(nextInvoice.total)}
                    {' on '}
                    {user.subscriptionCurrentPeriodEnd &&
                      getMonthWithDayAndYearInLocalTime(
                        user.subscriptionCurrentPeriodEnd,
                        -1,
                      )}
                  </p>
                  {!!nextInvoice.tax && (
                    <>
                      <VerticalSpacing spacing="spacing-xxs" />
                      <Paragraph color="grey500" size="small">
                        {`Including 21% VAT`}
                      </Paragraph>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <h3 className={styles['section-subtitle']}>Invoices</h3>
          )}
          <div>
            <ButtonLink onClick={() => setIsInvoicesModalOpen(true)}>
              View all invoices
            </ButtonLink>
          </div>
        </FlexBox>
        {user.subscriptionStatus === 'canceled' && (
          <>
            <VerticalSpacing spacing="spacing-l" />
            <Paragraph>
              You won´t pay more invoices as subscription is canceled.
            </Paragraph>

            <VerticalSpacing spacing="spacing-m" />

            {user.subscriptionCurrentPeriodEnd && (
              <Paragraph>
                {isPremium
                  ? 'Subscription will end at '
                  : 'Subscription ended at '}
                {getMonthWithDayAndYearInLocalTime(
                  user.subscriptionCurrentPeriodEnd,
                  -1,
                )}
                .
              </Paragraph>
            )}
            <VerticalSpacing spacing="spacing-l" />
          </>
        )}
      </div>

      {isInvoicesModalOpen && (
        <MyInvoicesModal onClose={() => setIsInvoicesModalOpen(false)} />
      )}
    </>
  );
};
