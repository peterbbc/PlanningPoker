import { AuthActionTypes } from '../../auth/types.d';
import { JiraActionTypes, JiraState } from '../types';
import { JIRA_START_FETCH, JIRA_UPDATED } from '../constants';
import { USER_SIGNED_OUT } from '../../auth/constants';

export const initialJiraState: JiraState = {
  isIdle: true,
  properties: null,
  isFirstTime: null,
};

export const jiraReducer = function jiraReducer(
  state = initialJiraState,
  action: JiraActionTypes | AuthActionTypes,
): JiraState {
  switch (action.type) {
    case JIRA_START_FETCH:
      return {
        ...state,
        isIdle: false,
      };
    case JIRA_UPDATED:
      return {
        ...state,
        isIdle: false,
        properties: action.properties,
        isFirstTime: !action.properties,
      };

    case USER_SIGNED_OUT:
      return { ...initialJiraState };
    default:
      return state;
  }
};
