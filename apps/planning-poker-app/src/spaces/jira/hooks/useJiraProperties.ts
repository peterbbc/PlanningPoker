import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchJiraProperties, jiraUpdateAction } from '../data/jira';
import { AppState } from '../../rootReducer';
import useCurrentUser from '../../auth/hooks/useCurrentUser';
import { JIRA_START_FETCH } from '../constants';
import { JiraProperties } from '../types';

export const useJiraProperties = (): {
  jiraProperties: JiraProperties | null;
  isFirstTime: boolean | null;
} => {
  const { uid } = useCurrentUser();
  const { properties: jiraProperties, isFirstTime } = useSelector(
    (state: AppState) => state.jira,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (uid === null) return;

    dispatch({
      type: JIRA_START_FETCH,
    });

    fetchJiraProperties(uid).then((jiraProperties: any) => {
      dispatch(jiraUpdateAction(jiraProperties));
    });
  }, [uid, dispatch]);

  return { jiraProperties, isFirstTime };
};
