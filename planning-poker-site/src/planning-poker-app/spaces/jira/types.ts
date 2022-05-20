import { Action } from "redux";
import { JiraActionType } from "./constants";

interface JiraStartFetchAction extends Action {
    type: JiraActionType.JIRA_START_FETCH
}

interface JiraUpdatedAction extends Action {
    type: JiraActionType.JIRA_UPDATED
    properties: JiraProperties
}

export type JiraActions =
    JiraStartFetchAction |
    JiraUpdatedAction

export interface JiraState {
    isFirstTime: boolean | null
    isIdle: boolean
    properties: JiraProperties | null
}

export interface JiraProperties {
    selectedResource: JiraResource
    selectedStoryPointsField: Field
    guessedStoryPointsField: Field
    token: string
    fields: Field[]
    projects: Project[]
    statuses: IssueStatus[]
    issueTypes: IssueType[]
}

export interface JiraIssue {
    id: string
    key: string
    summary: string
    status: IssueStatus
    description: string
    addedByUid: string
    storyPoints: number
    provider: 'jira'
}

export interface JiraResource {
    id: string
    url: string
}

export interface FetchIssuesFilters {
    projects: Project[] | null
    statuses: IssueStatus[] | null
    issueTypes: IssueType[] | null
    keywords: string[] | null
    epic: string | null
    sprint: string | null
    keys: string[] | null
    mode: 'filters' | 'jql'
    jql: string
    showIssuesWithPoints: boolean | null
}

export interface Field {
    id: string
    key: string
    name: string
}

export interface IssueType {
    id: string
    name: string
}

export interface IssueStatus {
    id: string
    name: string
}

export interface Project {
    id: string
    name: string
}