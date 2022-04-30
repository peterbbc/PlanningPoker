import { AuthActions } from '../../auth/types';
import { JiraActions, JiraState } from '../types';
import { JiraActionType } from '../constants';
import { AuthActionType } from '../../auth/constants';

export const initialJiraState: JiraState = {
  isIdle: true,
  properties: null,
  isFirstTime: null,
};

export const jiraReducer = function jiraReducer(
  state = initialJiraState,
  action: JiraActions | AuthActions,
): JiraState {
  switch (action.type) {
    case JiraActionType.JIRA_START_FETCH:
      return {
        ...state,
        isIdle: false,
      };
    case JiraActionType.JIRA_UPDATED:
      return {
        ...state,
        isIdle: false,
        properties: action.properties,
        isFirstTime: !action.properties,
      };

    case AuthActionType.USER_SIGNED_OUT:
      return { ...initialJiraState };
    default:
      return state;
  }
};
