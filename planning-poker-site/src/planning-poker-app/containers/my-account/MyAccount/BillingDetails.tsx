import { COUNTRY_LIST } from '../../../../packages/js-base';
import {
  ButtonLink,
  FlexBox,
  InlineAlert,
  Paragraph,
  VerticalSpacing,
} from '../../../../packages/react-base';
import React, { useContext } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { MyAccountModalInnerContext } from '../MyAccountModal/MyAccountModal';

export const BillingDetails = () => {
  const { setCurrentStep } = useContext(MyAccountModalInnerContext);
  const { user } = useCurrentUser();

  const hasSetBillingDetails = !!user?.customerName;

  return (
    <div>
      {!hasSetBillingDetails && (
        <>
          <InlineAlert
            style="info"
            title="Please set your billing details"
            content="We require this information for tax and invoicing purposes."
            onClick={() => setCurrentStep('billing-details')}
          />
          <VerticalSpacing spacing="spacing-m" />
        </>
      )}
      <FlexBox justifyContent="space-between">
        <div>
          <Paragraph fontWeight="bold">Billing details</Paragraph>
          <VerticalSpacing spacing="spacing-xs" />
          {hasSetBillingDetails ? (
            <div>
              <Paragraph size="micro">{user?.customerName}</Paragraph>
              <Paragraph size="micro">{user?.customerEmail}</Paragraph>
              <VerticalSpacing spacing="spacing-xxs" />
              {user?.customerAddress && (
                <div>
                  {user.customerAddress.line1 && (
                    <Paragraph size="nano">
                      {user.customerAddress.line1}
                    </Paragraph>
                  )}
                  {user.customerAddress.line2 && (
                    <Paragraph size="nano">
                      {user.customerAddress.line2}
                    </Paragraph>
                  )}
                  {user.customerAddress.city && (
                    <Paragraph size="nano">
                      {user.customerAddress.city}
                    </Paragraph>
                  )}
                  {user.customerAddress.state && (
                    <Paragraph size="nano">
                      {user.customerAddress.state}
                    </Paragraph>
                  )}
                  {user.customerAddress.postal_code && (
                    <Paragraph size="nano">
                      {user.customerAddress.postal_code}
                    </Paragraph>
                  )}
                  {user.customerAddress.country && (
                    <Paragraph size="nano">
                      {COUNTRY_LIST[user.customerAddress.country]}
                    </Paragraph>
                  )}
                  {user.customerTaxId && (
                    <Paragraph size="nano">
                      {typeof user.customerTaxId === 'string'
                        ? user.customerTaxId
                        : user.customerTaxId.value}
                    </Paragraph>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Paragraph>Information for tax and invoicing purposes</Paragraph>
          )}
        </div>

        <ButtonLink onClick={() => setCurrentStep('billing-details')}>
          {hasSetBillingDetails ? 'Change' : 'Set billing details'}
        </ButtonLink>
      </FlexBox>
    </div>
  );
};
