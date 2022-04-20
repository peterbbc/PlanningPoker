import {
  FormCheckbox,
  FormInput,
  Paragraph,
  SubmitRow,
} from '@we-agile-you/react-base';
import { User } from '@we-agile-you/types-planning-poker';
import React, { FormEvent, useState } from 'react';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { useNotification } from '../../spaces/notifications/useNotification';
import { createInvite } from '../../spaces/premium/data/createInvite';

import styles from './ManageFacilitators.module.scss';

interface InviteFacilitatorProps {
  onCancel: () => void;
  onSuccess: () => void;
  premiumUser: User;
}

export const InviteFacilitator = ({
  onCancel,
  onSuccess,
  premiumUser,
}: InviteFacilitatorProps) => {
  const [email, setEmail] = useState('');
  const [canManageFacilitators, setCanManageFacilitators] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useCurrentUser();
  const { showNotification } = useNotification();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!user || !premiumUser) return;

    setIsLoading(true);

    createInvite(email, premiumUser, user, canManageFacilitators)
      .then(() => {
        setIsLoading(false);
        showNotification({
          title: 'Invitation send successfully',
        });
        onSuccess();
      })
      .catch((e: Error) => {
        setIsLoading(false);
        showNotification({
          style: 'error',
          title: 'Error sending invite',
          content: e.message,
        });
      });
  };

  return (
    <div className={styles['invite-facilitator']}>
      <form onSubmit={handleSubmit}>
        <FormInput
          type="email"
          label="Email"
          id="email"
          name="email"
          value={email}
          onChange={setEmail}
        />
        <FormCheckbox
          id="can-manage-facilitators"
          label={
            <>
              <Paragraph>Can manage facilitators.</Paragraph>
              <Paragraph size="micro" color="grey600">
                Allow this facilitator to add and remove other facilitators.
              </Paragraph>
            </>
          }
          isChecked={canManageFacilitators}
          onChange={setCanManageFacilitators}
        />
        <SubmitRow
          align="strech"
          cancelLabel="Cancel"
          onCancel={onCancel}
          confirmLabel="Send invitation"
          isLoading={isLoading}
        />
      </form>
    </div>
  );
};
