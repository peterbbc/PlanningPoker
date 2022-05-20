import { Issue, NotificationType } from '../../../../packages/types-planning-poker';
import { useSelector } from 'react-redux';
import { arrayMove } from 'react-sortable-hoc';

import { FREEMIUM_ISSUES_VOTED_LIMIT } from '../../../constants/premium';
import { AppState } from '../../rootReducer';
import { useAppContext } from '../../app/hooks/useAppContext';
import useCurrentUser from '../../auth/hooks/useCurrentUser';
import { useNotification } from '../../notifications/useNotification';
import { updatePokerTable } from '../data/poker';

interface IssueActions {
  setVotingIssue: (issue: Issue | number) => void;
  unsetVotingIssue: () => void;
  voteNextIssue: () => void;
  deleteAll: () => void;
  addIssue: (issue: Partial<Issue>) => Promise<void>;
  addIssues: (issues: Array<Partial<Issue>>) => Promise<void>;
  addFromUrlBatch: (urls: string[]) => Promise<void>;
  editIssue: (key: string, issue: Partial<Issue>) => Promise<void>;
  deleteIssue: (issue: Issue) => Promise<void>;
  addJiraIssues: (issues: Issue[], url?: string) => Promise<void>;
  moveIssue: (oldIndex: number, newIndex: number) => Promise<void>;
  currentUserCanEditIssues: boolean;
}

export const cantEditIssuesNotification: Partial<NotificationType> = {
  title: "You don't have permission to manage issues",
  content: 'Change "who can manage issues" at game settings',
  style: 'error',
};

export const useIssueActions = (): IssueActions => {
  const pokerTable = useSelector((state: AppState) => state.pokerTable);
  const setIsPricingModalOpen = useAppContext().pricingModal[1];
  const { showNotification } = useNotification();
  const { uid } = useCurrentUser();
  const currentUserCanEditIssues = !!(
    !pokerTable.whoCanEditIssues ||
    (uid && pokerTable.whoCanEditIssues.find((playerId) => playerId === uid))
  );
  const pokerTableId = pokerTable.id;
  const issues = pokerTable.issues;

  const setVotingIssue = (issue: Issue | number) => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
      return;
    }
    if (!pokerTableId || !issues || issues.length === 0) return;
    const hasReachedLimit =
      !pokerTable.isPremium &&
      pokerTable.issuesVotedCount &&
      pokerTable.issuesVotedCount >= FREEMIUM_ISSUES_VOTED_LIMIT;

    if (hasReachedLimit) {
      setIsPricingModalOpen(true);

      return;
    }

    const issueIndex =
      typeof issue === 'number'
        ? issue
        : issues.findIndex(({ key }) => issue.key === key);

    if (issueIndex < 0 || issueIndex >= issues.length) return;

    const newIssues: Issue[] = issues.map((issue, index) => {
      return index === issueIndex
        ? {
            ...issue,
            isVotingNow: true,
          }
        : {
            ...issue,
            isVotingNow: false,
          };
    });

    updatePokerTable(pokerTableId, {
      issues: newIssues,
    });
  };

  const unsetVotingIssue = () => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
      return;
    }

    if (!issues || !pokerTableId) return;

    const newIssues: Issue[] = issues.map((issue) => {
      return {
        ...issue,
        isVotingNow: false,
      };
    });

    updatePokerTable(pokerTableId, {
      issues: newIssues,
    });
  };

  const voteNextIssue = () => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
      return;
    }

    if (!pokerTableId || !issues || issues.length === 0) return;

    const votingNowIndex = issues.findIndex((issue) => issue.isVotingNow);
    // If it is -1 is ok as next one will be 0 (the first)

    setVotingIssue(votingNowIndex + 1);
  };

  const addIssue = (issue: Partial<Issue>) => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
      return Promise.resolve();
    }

    if (!pokerTableId) return Promise.reject();

    const isKeyAlreadyAdded =
      typeof issue.key !== 'undefined' &&
      !!issues &&
      !!issues.find(({ key }) => issue.key === key);

    const isIssuesEmpty = !pokerTable.issues || !pokerTable.issues.length;

    const newIssue: Issue = {
      ...issue,
      key:
        isKeyAlreadyAdded || typeof issue.key === 'undefined'
          ? getUnusuedKey(issues || [], issue.key)
          : issue.key,
      summary: issue.summary || '',
      provider: issue.provider || 'manual',
      isVotingNow: isIssuesEmpty && !pokerTable.cardsUp,
    };

    return updatePokerTable(pokerTableId, {
      issues: pokerTable.issues ? [...pokerTable.issues, newIssue] : [newIssue],
    });
  };
  const addIssues = (issues: Array<Partial<Issue>>) => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
      return Promise.resolve();
    }

    if (!pokerTableId) return Promise.reject();

    const newIssues = pokerTable.issues ? [...pokerTable.issues] : [];

    for (const issue of issues) {
      const isKeyAlreadyAdded =
        typeof issue.key !== 'undefined' &&
        !!newIssues &&
        !!newIssues.find(({ key }) => issue.key === key);

      const isIssuesEmpty = !newIssues.length;

      const newIssue: Issue = {
        ...issue,
        key:
          isKeyAlreadyAdded || typeof issue.key === 'undefined'
            ? getUnusuedKey(newIssues || [], issue.key)
            : issue.key,
        summary: issue.summary || '',
        provider: issue.provider || 'manual',
        isVotingNow: isIssuesEmpty && !pokerTable.cardsUp,
      };

      newIssues.push(newIssue);
    }
    return updatePokerTable(pokerTableId, {
      issues: newIssues,
    });
  };

  const addFromUrlBatch = (urls: string[]) => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
      return Promise.resolve();
    }

    if (!pokerTableId) return Promise.reject();

    const issuesDefault: Issue[] = [];

    const issues: Issue[] = urls.reduce((issues, url) => {
      return [
        ...issues,
        {
          summary: url,
          url,
          provider: 'manual-url-batch',
          key: getUnusuedKey(
            pokerTable.issues ? [...pokerTable.issues, ...issues] : [...issues],
            getKeyFromUrl(url) || 'PP',
          ),
        },
      ];
    }, issuesDefault);

    return updatePokerTable(pokerTableId, {
      issues: pokerTable.issues
        ? [...pokerTable.issues, ...issues]
        : [...issues],
    });
  };

  const editIssue = (key: string, issue: Partial<Issue>) => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
      return Promise.resolve();
    }

    if (!pokerTableId || !pokerTable.issues) return Promise.reject();

    return updatePokerTable(pokerTableId, {
      issues: pokerTable.issues.map((_issue) => {
        if (key === _issue.key) {
          return {
            ..._issue,
            ...issue,
          };
        }

        return _issue;
      }),
    });
  };

  const deleteIssue = (issue: Issue) => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
      return Promise.resolve();
    }

    if (!pokerTableId || !pokerTable.issues) return Promise.reject();

    const issues = pokerTable.issues.filter(
      (_issue) => _issue.key !== issue.key,
    );

    return updatePokerTable(pokerTableId, {
      issues: issues,
    });
  };

  const deleteAll = () => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
      return Promise.resolve();
    }

    if (!pokerTableId || !pokerTable.issues) return Promise.reject();

    return updatePokerTable(pokerTableId, {
      issues: [],
    });
  };

  const addJiraIssues = (issues: Issue[], url?: string) => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
      return Promise.resolve();
    }

    if (!pokerTableId || !uid) return Promise.reject();
    const parsedIssues = issues.map((issue) => {
      let parsedDescription = issue.description || '';

      const sources = parsedDescription.match(
        /<img.+src=(?:"|')(.+?)(?:"|')(?:.+?)>/,
      );

      if (!sources || sources.length === 0) return issue;

      for (const source of sources) {
        if (url && source && source.indexOf('<img') === -1) {
          parsedDescription = parsedDescription.replace(
            source,
            `${url}${source}`,
          );
        }
      }

      return {
        ...issue,
        description: parsedDescription,
        addedByUid: uid,
      };
    });

    return updatePokerTable(pokerTableId, {
      issues: pokerTable.issues
        ? [
            ...pokerTable.issues.filter(
              (issue) => !parsedIssues.find((_issue) => _issue.id === issue.id),
            ),
            ...parsedIssues,
          ]
        : [...parsedIssues],
    });
  };

  const moveIssue = (oldIndex: number, newIndex: number) => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
      return Promise.resolve();
    }

    if (!pokerTable?.issues || !pokerTable.id) return Promise.reject();

    return updatePokerTable(pokerTable.id, {
      issues: arrayMove(pokerTable.issues, oldIndex, newIndex),
    });
  };

  return {
    setVotingIssue,
    unsetVotingIssue,
    voteNextIssue,
    deleteAll,
    addIssue,
    addIssues,
    addFromUrlBatch,
    editIssue,
    deleteIssue,
    addJiraIssues,
    moveIssue,
    currentUserCanEditIssues,
  };
};

export const getUnusuedKey = (issues: Issue[], key = 'PP') => {
  if (key !== 'PP' && !issues.find((issue) => issue.key === key)) {
    return key;
  }

  let isUsed = true;
  let i = 1;
  let newKey = `${key}-${i}`;

  while (isUsed) {
    const createdKey = `${key}-${i}`;
    newKey = createdKey;
    isUsed = !!issues.find((issue) => issue.key === createdKey);

    i += 1;
  }

  return newKey;
};

const getKeyFromUrl = (url: string) => {
  const splitted = url.split('/browse/');

  if (splitted.length === 2 && /^[A-Za-z0-9_-]+$/.test(splitted[1])) {
    return splitted[1];
  } else {
    return null;
  }
};
