import { ConfirmModal } from '../../../packages/react-base';
import React, { useState } from 'react';

import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { useGameActions } from '../../spaces/poker-table/hooks/useGameActions';
import { useNotification } from '../../spaces/notifications/useNotification';

interface MyGamesModalProps {
  gameId: string;
  onClose: () => void;
  onGameDeleted: () => void;
}

export const ConfirmDeleteGameModal = ({
  onClose,
  onGameDeleted,
  gameId,
}: MyGamesModalProps) => {
  const { isFacilitator } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const { deleteGame } = useGameActions();
  const { showNotification } = useNotification();

  const handleConfirm = () => {
    setIsLoading(true);

    deleteGame(gameId)
      .then(() => {
        setIsLoading(false);
        showNotification({ title: 'The game has been deleted' });
        onGameDeleted();
      })
      .catch(() => {
        setIsLoading(false);
        showNotification({
          title: 'An error happened when trying to delete game',
          style: 'error',
        });
        onClose();
      });
  };

  if (!isFacilitator) {
    return null;
  }

  return (
    <ConfirmModal
      title="Are you sure you want to delete this game?"
      content="Once you confirm it will no longer be available."
      isDanger
      confirmLabel="Delete game"
      onConfirm={handleConfirm}
      cancelLabel="Cancel"
      onCancel={onClose}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
};
