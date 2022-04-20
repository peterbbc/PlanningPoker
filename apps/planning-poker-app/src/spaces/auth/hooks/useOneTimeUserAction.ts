import { useEffect, useMemo, useRef, useState } from 'react';

import { updateCurrentUser } from '../data/user';
import useCurrentUser from './useCurrentUser';

type UseOneTimeUserActionReturn = [boolean | null, () => void];

type OneTimeActionId =
  | 'seenIssuesPopup'
  | 'cardSelectorTooltip'
  | 'showCardsTooltip'
  | 'startNewGameTooltip'
  | 'inviteTooltip'
  | 'issuesTooltip'
  | 'addIssueTooltip'
  | 'voteIssueTooltip'
  | 'sortIssuesTooltip'
  | 'importTooltip'
  | 'saveInJiraTooltip';

export const useOneTimeUserAction = (
  actionId: OneTimeActionId,
): UseOneTimeUserActionReturn => {
  const isDoneInLocalStorage = useRef<boolean | null>(null);
  const isDoneInDB = useRef<boolean | null>(null);
  const [hasDoneAction, setHasDoneAction] = useState<boolean | null>(null);

  const { user } = useCurrentUser();
  const isActionDoneInDB = user ? !!user[actionId] : null;

  const handleActionDone = useMemo(
    () => () => {
      let actions = localStorage.getItem('actions');

      if (!actions) {
        actions = actionId;
      } else if (!actions.split(',').find((action) => action === actionId)) {
        actions = `${actions},${actionId}`;
      }

      localStorage.setItem('actions', actions);

      updateCurrentUser({
        [actionId]: true,
      });

      setHasDoneAction(true);
    },
    [actionId],
  );

  useEffect(() => {
    const actions = localStorage.getItem('actions');

    const isDone =
      !!actions && !!actions.split(',').find((action) => action === actionId);

    if (isDoneInDB.current !== null) {
      setHasDoneAction(isDone || isDoneInDB.current);
    }

    isDoneInLocalStorage.current = isDone;
  }, [actionId]);

  useEffect(() => {
    if (isActionDoneInDB === null) return;

    if (isDoneInLocalStorage.current !== null) {
      setHasDoneAction(isActionDoneInDB || isDoneInLocalStorage.current);
    }

    isDoneInDB.current = isActionDoneInDB;
  }, [isActionDoneInDB]);

  return [hasDoneAction, handleActionDone];
};
