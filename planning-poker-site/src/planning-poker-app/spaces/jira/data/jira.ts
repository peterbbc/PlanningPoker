import { getObjectWithoutUndefinedValues } from '../../../../packages/js-base';
import { JiraResource, JiraProperties, Field, IssueType, Project } from '../types';
import firebaseDefault from 'firebase/compat/app';
import { CONFIG } from '../../../vendors/jira/jira';
import { JiraActionType } from '../constants';
import { JiraIssue } from '../types';

export const jiraHandleAuth = (
  code: string,
  isSetup: boolean,
  firebase = firebaseDefault,
) =>
  firebase
    .functions()
    .httpsCallable('jiraHandleAuth', { timeout: 200000 })({
      code,
      isSetup,
    })
    .then((result) => {
      return result.data as JiraResource[];
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      return Promise.reject(error);
    });

export const jiraAccessibleResources = (firebase = firebaseDefault) =>
  firebase.functions().httpsCallable('jiraAccessibleResources')();
export const getJiraOauthLink = (uid: string, pokerTableId?: string | null) => {
  const state = pokerTableId ? `${uid}_${pokerTableId}` : uid;
  return [
    `https://auth.atlassian.com/authorize?`,
    `audience=api.atlassian.com&`,
    `client_id=${CONFIG.CLIENT_ID}&`,
    `scope=read%3Aapplication-role%3Ajira%20read%3Aaudit-log%3Ajira%20read%3Aavatar%3Ajira%20read%3Afield-configuration%3Ajira%20read%3Afield%3Ajira%20read%3Agroup%3Ajira%20read%3Aissue-details%3Ajira%20read%3Aissue-meta%3Ajira%20read%3Aissue-status%3Ajira%20read%3Aissue-type-hierarchy%3Ajira%20read%3Aissue-type%3Ajira%20read%3Aproject-category%3Ajira%20read%3Aproject-version%3Ajira%20read%3Aproject.component%3Ajira%20read%3Aproject.property%3Ajira%20read%3Aproject%3Ajira%20read%3Astatus%3Ajira%20read%3Auser%3Ajira%20write%3Aissue%3Ajira&`,
    `redirect_uri=${CONFIG.REDIRECT_URI}&`,
    `state=${state}&`,
    `response_type=code&`,
    `prompt=consent`,
  ].join('');
};

export const jiraGetPermissions = (
  onTokenExpired: () => void,
  firebase = firebaseDefault,
): Promise<any> =>
  firebase
    .functions()
    .httpsCallable('jiraGetPermissions', { timeout: 200000 })()
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);
      console.error(error);

      if (code === 'unauthenticated' || code === 'functions/unauthenticated') {
        onTokenExpired();

        return Promise.reject({ error });
      }

      return Promise.reject({ error });
    });

export const jiraSearch = async (
  jql: string | null,
  onTokenExpired: () => void,
  uid: string,
  selectedStoryPointsField?: string,
  firebase = firebaseDefault,
): Promise<JiraIssue[]> => {
  console.log('JIRA @@@@@::: jiraSearch');
  return firebase
    .functions()
    .httpsCallable('jiraSearch', { timeout: 200000 })({
      jql,
    })
    .then((result) => {
      const issues: JiraIssue[] = !!result.data.total
        ? result.data.issues.map((issueData: any) => {
            const issue: JiraIssue = {
              id: issueData.id,
              key: issueData.key,
              ...issueData.fields,
            };

            Object.keys(issueData.renderedFields).forEach((key) => {
              if (issueData.renderedFields[key] !== null) {
                // @ts-ignore
                issue[key] = issueData.renderedFields[key];
              }
            });

            return issue;
          })
        : [];

      return issues.map((issue) => {
        // @ts-ignore
        const storyPoints = selectedStoryPointsField
          ? // @ts-ignore
            issue[selectedStoryPointsField]
          : null;

        return getObjectWithoutUndefinedValues({
          id: issue.id,
          key: issue.key,
          summary: issue.summary,
          status: issue.status?.name,
          description: issue.description,
          addedByUid: uid,
          storyPoints: storyPoints || storyPoints === 0 ? storyPoints : null,
          provider: 'jira',
        });
      });
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);
      console.log(typeof error);

      if (code === 'unauthenticated' || code === 'functions/unauthenticated') {
        console.log("JIRA @@@@@::: code === 'unauthenticated'");
        console.log(error);
        onTokenExpired();

        return Promise.reject({ error });
      }

      console.log('JIRA @@@@@::: Promise.reject({ error }');
      console.log(error);

      return Promise.reject({ error });
    });
};
export const jiraRefreshProperties = (
  isSetup: boolean,
  onTokenExpired: () => void,
  resource?: any,
  firebase = firebaseDefault,
) => {
  return firebase
    .functions()
    .httpsCallable('jiraRefreshProperties', { timeout: 200000 })({
      isSetup,
      resource,
    })
    .then((result) => {
      return result.data;
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      if (code === 'unauthenticated' || code === 'functions/unauthenticated') {
        onTokenExpired();

        return Promise.reject({ error });
      }

      return Promise.reject({ error });
    });
};

export type JiraIssueToUpdate = {
  id: string;
  fields: object;
};

export const jiraEditIssues = (
  issues: JiraIssueToUpdate[],
  onTokenExpired: () => void,
  firebase = firebaseDefault,
) => {
  return firebase
    .functions()
    .httpsCallable('jiraEditIssues', { timeout: 200000 })({
      issues,
    })
    .then((result) => {
      return result.data;
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      if (code === 'unauthenticated' || code === 'functions/unauthenticated') {
        onTokenExpired();

        Promise.reject({ error });
      }

      return Promise.reject({ error });
    });
};
export const updateJiraProperties = (
  uid: string,
  jiraInfo: any,
  firebase = firebaseDefault,
) =>
  firebase
    .firestore()
    .collection('jira-info')
    .doc(uid)
    .update(jiraInfo)
    .then(() => firebase.firestore().collection('jira-info').doc(uid).get());
export const deleteJiraProperties = (uid: string, firebase = firebaseDefault) =>
  firebase.firestore().collection('jira-info').doc(uid).delete();

export const fetchJiraProperties = async (
  uid: string,
  firebase = firebaseDefault,
) => {
  const docRef = firebase.firestore().collection('jira-info').doc(uid);

  const [jiraInfo, fields, projects, statuses, issueTypes] = await Promise.all([
    docRef
      .get()
      .then((doc) => {
        return (doc.data() as JiraProperties) || null;
      })
      .catch(() => null),
    docRef
      .collection('fields')
      .get()
      .then((snapshot) => {
        const fieldsArr: Field[] = [];

        snapshot.forEach((doc) => {
          fieldsArr.push(doc.data() as Field);
        });

        return fieldsArr;
      })
      .catch(() => null),
    docRef
      .collection('projects')
      .get()
      .then((snapshot) => {
        const projectsArr: Project[] = [];
        snapshot.forEach((doc) => {
          projectsArr.push(doc.data() as Project);
        });

        return projectsArr;
      })
      .catch((err) => {
        console.error(err);
        return null;
      }),
    docRef
      .collection('statuses')
      .get()
      .then((snapshot) => {
        const projectsArr: Project[] = [];
        snapshot.forEach((doc) => {
          projectsArr.push(doc.data() as Project);
        });

        return projectsArr;
      })
      .catch((err) => {
        console.error(err);
        return null;
      }),
    docRef
      .collection('issueTypes')
      .get()
      .then((snapshot) => {
        const issueTypesArr: IssueType[] = [];

        snapshot.forEach((doc) => {
          issueTypesArr.push(doc.data() as IssueType);
        });

        return issueTypesArr;
      })
      .catch(() => null),
  ]);

  if (!jiraInfo) return null;

  const info: JiraProperties = {
    ...jiraInfo,
    fields: fields || [],
    projects: projects || [],
    statuses: statuses || [],
    issueTypes: issueTypes
      ? issueTypes
      : jiraInfo.issueTypes
      ? jiraInfo.issueTypes
      : [],
  };

  return info;
};

export const jiraUpdateAction = (jiraProperties: any) => {
  if (!jiraProperties) {
    return {
      type: JiraActionType.JIRA_UPDATED,
      properties: null,
    };
  }

  return {
    type: JiraActionType.JIRA_UPDATED,
    properties: jiraProperties,
  };
};
