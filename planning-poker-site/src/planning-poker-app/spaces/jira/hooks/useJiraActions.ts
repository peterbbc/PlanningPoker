import { jiraGetPermissions } from '../data/jira';
import { Issue } from '../../../../packages/types-planning-poker';
import {
  deleteJiraProperties,
  jiraSearch,
  updateJiraProperties,
} from '../data/jira';
import useCurrentUser from '../../auth/hooks/useCurrentUser';
import { FetchIssuesFilters, JiraProperties } from '../types';
import { reservedJQLWords } from './constants';
import { useJiraProperties } from './useJiraProperties';
import { useMemo } from 'react';

export const getJqlStringFromFilters = ({
  projects,
  statuses,
  issueTypes,
  keywords,
  epic,
  sprint,
  keys,
  mode,
  jql: jqlString,
}: FetchIssuesFilters) => {
  if (mode === 'jql') {
    return jqlString;
  }

  const jql: string[] = [];

  if (projects && projects.length) {
    jql.push(
      `( ${projects
        .map((project) => `project = ${project.id}`)
        .join(' OR ')} )`,
    );
  }

  if (epic) {
    jql.push(`("Epic link" = "${epic}")`);
  }

  if (sprint) {
    jql.push(`(Sprint = "${sprint}")`);
  }

  if (statuses && statuses.length) {
    jql.push(
      `( ${statuses
        .map((status) => `status = "${status.name}"`)
        .join(' OR ')} )`,
    );
  }

  if (issueTypes && issueTypes.length) {
    jql.push(
      `( ${issueTypes
        .map((issueType) => `issuetype = "${issueType.name}"`)
        .join(' OR ')} )`,
    );
  }

  if (keys && keys.length) {
    jql.push(
      `(${keys
        .map((key) => {
          const isReserved = reservedJQLWords.find((_word) => _word === key);

          return isReserved ? `true` : `issueKey = ${key}`;
        })
        .join(' OR ')})`,
    );
  }

  if (keywords && keywords.length) {
    jql.push(
      `(${keywords
        .map((word) => {
          const isReserved = reservedJQLWords.find((_word) => _word === word);

          return isReserved ? `summary ~ "${word}"` : `summary ~ ${word}`;
        })
        .join(' OR ')})`,
    );
  }

  return `${jql.join(' AND ')} Order by RANK`;
};

interface JiraActions {
  fetchIssues: (filters: FetchIssuesFilters) => Promise<Issue[]>;
  updateJiraProperties: (
    uid: string,
    properties: Partial<JiraProperties>,
  ) => Promise<any>;
  deleteJiraProperties: (uid: string) => Promise<any>;
  jiraGetPermissions: () => Promise<any>;
}

interface UseJiraActionsProps {
  onRequiresAuth: () => void;
}

export const useJiraActions = ({
  onRequiresAuth,
}: UseJiraActionsProps): JiraActions => {
  const { uid } = useCurrentUser();

  const { jiraProperties } = useJiraProperties();
  const resourceId = jiraProperties?.selectedResource?.id;

  const fetchIssues = async (filters: FetchIssuesFilters) => {
    if (!uid) {
      throw new Error('No user is logged in');
    }

    if (!resourceId) {
      console.log('JIRA @@@@@::: if (!resourceId)');
      onRequiresAuth();
    }

    const jqlString = getJqlStringFromFilters(filters);

    let issues = await jiraSearch(
      jqlString,
      onRequiresAuth,
      uid,
      jiraProperties?.selectedStoryPointsField?.id,
    );

    const host = jiraProperties?.selectedResource.url;

    if (host && issues) {
      issues = issues.map((issue) => {
        if (!issue.key) return issue;

        return {
          ...issue,
          url: `${host}/browse/${issue.key}`,
        };
      });
    }

    return filters.showIssuesWithPoints
      ? issues
      : issues.filter((issue) => !issue.storyPoints && issue.storyPoints !== 0);
  };

  const updateJiraPropertiesAction = (
    uid: string,
    properties: Partial<JiraProperties>,
  ) => updateJiraProperties(uid, properties);

  const deleteJiraPropertiesAction = (uid: string) => deleteJiraProperties(uid);

  const jiraGetPermissionsAction = useMemo(
    () => () => {
      if (!resourceId) {
        onRequiresAuth();
      }

      return jiraGetPermissions(onRequiresAuth);
    },
    [resourceId, onRequiresAuth],
  );

  return {
    fetchIssues,
    updateJiraProperties: updateJiraPropertiesAction,
    deleteJiraProperties: deleteJiraPropertiesAction,
    jiraGetPermissions: jiraGetPermissionsAction,
  };
};
