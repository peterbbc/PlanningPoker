import { sendFirestoreEvent } from './eventsConsumers/sendFirestoreEvent';
import { sendGoogleAnalyticsEvent } from './eventsConsumers/sendGoogleAnalyticsEvent';

type SeenIssuesPopupEvent = {
  id: 'seen-issues-popup';
};
type AnsweredIssuesPopupEvent = {
  id: 'answered-issues-popup';
  value: boolean;
};

type ToggleSidebarEvent = {
  id: 'toggle-sidebar';
  value: 'open' | 'close';
};
type OpenIssuesModalEvent = {
  id: 'open-issues-modal';
  context: 'sidebar' | 'title-dropdown';
};

type IssuesModalAddIssueClickEvent = {
  id: 'issues-modal-add-issue-click';
};

type IssuesModalImportFromJiraClickEvent = {
  id: 'issues-modal-import-from-jira-click';
};

type JiraRedirectToAuthEvent = {
  id: 'jira-redirect-to-oauth';
  context: 'add-from-jira';
};

type JiraCallbackPageViewEvent = {
  id: 'jira-callback-page-view';
};

type JiraCallbackPageSucessfullRedirectEvent = {
  id: 'jira-callback-page-successfull-redirect';
  to: 'table' | 'home';
};

type IssuesModalIssueAddedEvent = {
  id: 'issues-modal-issue-added';
};
type IssuesModalIssuesImportedfromJiraEvent = {
  id: 'issues-modal-issues-imported-from-jira';
  totalIssuesImported: number;
};
type IssuesModalIssuesSorted = {
  id: 'issues-modal-issues-sorted';
};
type IssuesModalDeleteAll = {
  id: 'issues-modal-delete-all';
};

type PokerTablePageViewEvent = {
  id: 'poker-table-page-view';
  tableId: string;
  isOwner: boolean;
};

type PokerTableShowCardsEvent = {
  id: 'poker-table-show-cards';
};

type SidebarNextIssueClickEvent = {
  id: 'sidebar-next-issue-click';
};
type SidebarSelectPointsChangeEvent = {
  id: 'sidebar-select-points-change';
};

type PremiumAccountCreated = {
  id: 'premium-account-created';
};

export type WAYEvent =
  | SeenIssuesPopupEvent
  | AnsweredIssuesPopupEvent
  | ToggleSidebarEvent
  | OpenIssuesModalEvent
  | IssuesModalAddIssueClickEvent
  | IssuesModalImportFromJiraClickEvent
  | JiraCallbackPageViewEvent
  | JiraCallbackPageSucessfullRedirectEvent
  | PokerTablePageViewEvent
  | JiraRedirectToAuthEvent
  | IssuesModalIssueAddedEvent
  | IssuesModalIssuesImportedfromJiraEvent
  | SidebarNextIssueClickEvent
  | IssuesModalIssuesSorted
  | IssuesModalDeleteAll
  | SidebarSelectPointsChangeEvent
  | PokerTableShowCardsEvent
  | PremiumAccountCreated;

export const sendEvent = (event: WAYEvent) => {
  sendFirestoreEvent(event);
  sendGoogleAnalyticsEvent(event);
};
