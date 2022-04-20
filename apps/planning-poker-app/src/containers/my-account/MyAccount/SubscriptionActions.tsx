import { getMonthWithDayAndYearInLocalTime } from '@we-agile-you/js-base';
import {
  Button,
  ButtonLink,
  Paragraph,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import { User } from '@we-agile-you/types-planning-poker';
import React, { useContext } from 'react';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';

import styles from '../MyAccount.module.scss';
import { MyAccountModalInnerContext } from '../MyAccountModal/MyAccountModal';

interface SubscriptionActionsProps {
  user: User;
}
export const SubscriptionActions: React.FC<SubscriptionActionsProps> = ({
  user,
}) => {
  const setIsPricingModalOpen = useAppContext().pricingModal[1];
  const { onClose, setCurrentStep } = useContext(MyAccountModalInnerContext);

  return (
    <div className={styles['subsection']}>
      {user.subscriptionStatus !== 'canceled' && (
        <>
          <Paragraph>
            <ButtonLink
              buttonColor="danger"
              onClick={() => setCurrentStep('cancel-subscription')}
            >
              Cancel premium plan
            </ButtonLink>
          </Paragraph>
          <VerticalSpacing spacing="spacing-xs" />
          <Paragraph color="grey500">
            If you cancel you won't receive more invoices.
          </Paragraph>
          <Paragraph color="grey500">
            Premium plan will remain active until the end of current period:{' '}
            {user.subscriptionCurrentPeriodEnd &&
              getMonthWithDayAndYearInLocalTime(
                user.subscriptionCurrentPeriodEnd,
                -1,
              )}
          </Paragraph>
        </>
      )}
      {user.subscriptionStatus === 'canceled' && (
        <>
          <Paragraph>
            <Button
              onClick={() => {
                onClose();
                setIsPricingModalOpen(true);
              }}
              isBlock
            >
              Reactivate premium plan
            </Button>
          </Paragraph>
        </>
      )}
    </div>
  );
};
