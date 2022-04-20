import { ButtonLink, FlexBox } from '@we-agile-you/react-base';
import { User } from '@we-agile-you/types-planning-poker';
import React from 'react';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';

import styles from '../MyAccount.module.scss';

interface FacilitatorsProps {
  user: User;
}
export const Facilitators = ({ user }: FacilitatorsProps) => {
  const appContext = useAppContext();
  const setIsManageFacilitatorsModal = appContext.manageFacilitatorsModal[1];
  const setIsMyAccountModalOpen = appContext.myAccountModal[1];

  return (
    <div className={styles['subsection']}>
      <FlexBox justifyContent="space-between">
        <div>
          <h3 className={styles['section-subtitle']}>Facilitators</h3>
          <p className={styles['section-value']}>
            {`You have a plan with ${
              user.subscriptionFacilitatorsQuantity || 1
            } facilitator${
              user.subscriptionFacilitatorsQuantity &&
              user.subscriptionFacilitatorsQuantity > 1
                ? 's'
                : ''
            }.`}
          </p>
        </div>
        <div>
          <ButtonLink
            onClick={() => {
              setIsMyAccountModalOpen(false);
              setIsManageFacilitatorsModal(true);
            }}
          >
            Manage facilitators
          </ButtonLink>
        </div>
      </FlexBox>
    </div>
  );
};
