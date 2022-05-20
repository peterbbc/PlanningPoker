import {
  ButtonLink,
  FormInputInlineEdit,
  Grid,
  Paragraph,
  VerticalSpacing,
} from '../../../../packages/react-base';
import React, { useState } from 'react';
import { DISPLAY_NAME_MAX_LENGTH } from '../../../spaces/auth/constants';
import { updateCurrentUser } from '../../../spaces/auth/data/user';
import { useAuthActions } from '../../../spaces/auth/hooks/useAuthActions';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { DEFAULT_DISPLAY_NAME } from '../../../spaces/poker-table/constants';
import { StripeElementsProvider } from '../../../vendors/stripe/StripeElementsProvider';

import { DeleteAccountModal } from '../../DeleteAccountModal/DeleteAccountModal';
import { PremiumSection } from './PremiumSection';

export const MyAccount = () => {
  const {
    isAnonymous,
    isPremium,
    isFacilitator,
    user,
    email,
  } = useCurrentUser();
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(
    false,
  );
  const { updateEmail, updatePassword } = useAuthActions();

  const handleDeleteAccount = () => {
    setIsDeleteAccountModalOpen(true);
  };

  const handleEditDisplayName = ([displayName]: string[]) =>
    updateCurrentUser({ displayName });

  const handleEditEmail = ([newEmail, password]: string[]) =>
    updateEmail(password, newEmail);

  const handleChangePassword = ([newPassword, password]: string[]) =>
    updatePassword(password, newPassword);

  if (!isDeleteAccountModalOpen && isAnonymous) {
    return null;
  }

  const renderPage = () => {
    if (!user || isPremium === null || isAnonymous) {
      return null;
    }

    return (
      <Grid container spacing={3} justify="center">
        <Grid item xs={12}>
          <FormInputInlineEdit
            label="Display name"
            value={user.displayName || DEFAULT_DISPLAY_NAME}
            inputs={[
              {
                id: 'display-name',
                maxLength: DISPLAY_NAME_MAX_LENGTH,
                value: user.displayName || DEFAULT_DISPLAY_NAME,
                required: true,
              },
            ]}
            onConfirm={handleEditDisplayName}
          />
          <VerticalSpacing spacing="spacing-l" />
          {email && (
            <FormInputInlineEdit
              label="Email"
              value={email}
              inputs={[
                {
                  id: 'new-email',
                  type: 'email',
                  label: 'New email',
                  value: '',
                  required: true,
                },
                {
                  id: 'email-password',
                  type: 'password',
                  label: 'Please type your password',
                  value: '',
                  required: true,
                },
              ]}
              onConfirm={handleEditEmail}
            />
          )}
          <VerticalSpacing spacing="spacing-l" />
          <FormInputInlineEdit
            label="Password"
            value="********"
            inputs={[
              {
                id: 'new-password',
                type: 'password',
                label: 'New password',
                value: '',
                required: true,
              },
              {
                id: 'password-password',
                type: 'password',
                label: 'Current password',
                value: '',
                required: true,
              },
            ]}
            onConfirm={handleChangePassword}
          />
          <StripeElementsProvider>
            <PremiumSection
              user={user}
              isPremium={isPremium}
              isFacilitator={!!isFacilitator}
            />
          </StripeElementsProvider>
          <VerticalSpacing spacing="spacing-xl" />
          <Paragraph>
            <ButtonLink onClick={handleDeleteAccount} buttonColor="danger">
              Delete account
            </ButtonLink>
          </Paragraph>
          <VerticalSpacing spacing="spacing-xs" />
          <Paragraph color="grey500">
            Delete your user and all his data.
          </Paragraph>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      {renderPage()}
      {isDeleteAccountModalOpen && (
        <DeleteAccountModal
          onClose={() => setIsDeleteAccountModalOpen(false)}
        />
      )}
    </>
  );
};
