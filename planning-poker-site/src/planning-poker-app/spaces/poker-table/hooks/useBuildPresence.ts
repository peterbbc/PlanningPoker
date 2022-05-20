import {
  buldPresenceInPokerGame,
  updatePlayerInfo,
} from '../../poker-table/data/pokerPresence';
import { useCurrentTable } from '../../poker-table/hooks/useCurrentTable';
import { useEffect } from 'react';
import useCurrentUser from '../../auth/hooks/useCurrentUser';

const useBuildPresenceInTable = (): void => {
  const { user, uid } = useCurrentUser();
  const { pokerTable } = useCurrentTable();

  const isUserFetched = !!user;
  const tableId = pokerTable.id;
  const tableName = pokerTable.name || '';
  const displayName = user?.displayName || '';
  const profilePictureUrl = user?.profilePictureUrl || null;
  const isSpectator = !!user?.isSpectator;

  useEffect(() => {
    if (!uid || !tableId) return;

    const removePresence = buldPresenceInPokerGame(uid, tableId);

    return function cleanup() {
      if (removePresence) {
        removePresence();
      }
    };
  }, [uid, tableId]);

  useEffect(() => {
    if (!uid || !isUserFetched || !tableId) return;

    updatePlayerInfo(
      {
        uid,
        tableId,
        displayName,
        profilePictureUrl,
        tableName,
        isSpectator,
      },
      tableId,
    );
  }, [
    uid,
    isUserFetched,
    tableId,
    displayName,
    profilePictureUrl,
    tableName,
    isSpectator,
  ]);
};

export default useBuildPresenceInTable;
