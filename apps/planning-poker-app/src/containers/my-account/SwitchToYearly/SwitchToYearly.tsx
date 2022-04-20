import { getMonthWithDayInLocalTime } from '@we-agile-you/js-base';
import {
  FlexBox,
  InlineAlert,
  Span,
  SubmitRow,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React, { useContext, useEffect, useState } from 'react';
import { Invoice } from '@we-agile-you/types-planning-poker';
import { Loader } from '../../../components/molecules/Loader/Loader';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useNotification } from '../../../spaces/notifications/useNotification';
import { previewInvoice } from '../../../spaces/premium/data/previewInvoice';
import { updateCurrentUserSubscription } from '../../../spaces/premium/data/updateCurrentUserSubscription';
import { MyAccountModalInnerContext } from '../MyAccountModal/MyAccountModal';

import styles from './SwitchToYearly.module.scss';

export const SwitchToYearly = () => {
  const { setCurrentStep } = useContext(MyAccountModalInnerContext);
  const { showNotification } = useNotification();
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const { user, isTaxExempt } = useCurrentUser();

  useEffect(() => {
    setIsLoadingInvoice(true);
    previewInvoice({ newBillingType: 'yearly' }).then(({ invoice }) => {
      setInvoice(invoice);
      setIsLoadingInvoice(false);
    });
  }, []);

  const handleConfirm = () => {
    setIsLoadingConfirm(true);
    updateCurrentUserSubscription({ newBillingType: 'yearly' })
      .then(() => {
        showNotification({
          title: 'Switched to yearly',
          content: 'You have susccessfully switched to yearly plan.',
        });
        setCurrentStep('my-account');
      })
      .finally(() => {
        setIsLoadingConfirm(false);
      });
  };

  if (isLoadingInvoice) {
    return (
      <FlexBox alignItems="center" justifyContent="center">
        <Loader message="Calculating next invoice..." />
      </FlexBox>
    );
  }

  if (!invoice || !user) {
    return null;
  }

  const invoiceTotal = invoice.total / 100;

  const trialLineItem = invoice.lines?.data?.find(
    (lineData: any) => lineData.amount === 0,
  );

  const periodEndDate =
    trialLineItem?.period?.end &&
    getMonthWithDayInLocalTime(new Date(trialLineItem?.period?.end * 1000));

  return (
    <div className={styles['switch-to-yearly']}>
      {typeof user.subscriptionScheduledQuanity === 'number' && (
        <>
          <InlineAlert
            style="info"
            title="You have sheduled a reduce of faciltiators"
            content={`You will pay only for ${
              user.subscriptionScheduledQuanity
            } faciltiator${user.subscriptionScheduledQuanity > 1 ? 's' : ''}`}
          />
          <VerticalSpacing spacing="spacing-xl" />
        </>
      )}
      {user.subscriptionStatus !== 'trialing' &&
        invoice.lines.data.map((line, i) => (
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
      <VerticalSpacing spacing="spacing-xs" />
      <hr className={styles['hr']} />
      <VerticalSpacing spacing="spacing-xs" />
      {user.subscriptionStatus !== 'trialing' ? (
        <>
          <FlexBox justifyContent="space-between">
            <Span spanStyle="bold">Total to pay today</Span>
            <Span spanStyle="bold">${invoiceTotal}</Span>
          </FlexBox>
          {!isTaxExempt && (
            <FlexBox justifyContent="end">
              <Span color="grey500">Including 21% VAT</Span>
            </FlexBox>
          )}
        </>
      ) : (
        <FlexBox justifyContent="space-between">
          <Span spanStyle="bold">
            YEARLY PAYMENT{' '}
            <Span tooltip="When your trial period ends">
              ( starting {periodEndDate} )
            </Span>
          </Span>
          <Span spanStyle="bold">
            $
            {(isTaxExempt ? 300 : 360) *
              (user.subscriptionFacilitatorsQuantity || 1)}
          </Span>
        </FlexBox>
      )}
      <VerticalSpacing spacing="spacing-xl" />
      <SubmitRow
        cancelLabel="Cancel"
        align="strech"
        onCancel={() => setCurrentStep('my-account')}
        confirmLabel="Swith to yearly"
        onConfirm={handleConfirm}
        isLoading={isLoadingConfirm}
      />
    </div>
  );
};
