import {
  Button,
  FormCheckbox,
  VerticalSpacing,
  FlexBox,
  Input,
  Textarea,
  Span,
  ButtonLink,
} from '../../../../packages/react-base';
import React, { useState } from 'react';
import { getJqlStringFromFilters } from '../../../spaces/jira/hooks/useJiraActions';
import {
  FetchIssuesFilters,
  IssueStatus,
  IssueType,
  Project,
} from '../../../spaces/jira/types';

import { FormCheckboxList } from '../../molecules/FormCheckboxList/FormCheckboxList';
import { KeywordPicker } from '../../molecules/KeywrordPicker/KeywordPicker';
import { VerticalDividerWithScroll } from '../../molecules/VerticalDividerWithScroll/VerticalDividerWithScroll';
export type FormCheckboxListElementType = {
  label: string;
  id: string;
};

interface JiraFiltersProps {
  projects: Project[] | null;
  statuses: IssueStatus[] | null;
  issueTypes: IssueType[] | null;
  onApplyFilters: (filters: FetchIssuesFilters) => void;
  isLoading: boolean;
}

export const JiraFilters = ({
  projects,
  statuses,
  issueTypes,
  onApplyFilters,
  isLoading,
}: JiraFiltersProps) => {
  const [selectedProjects, setSelectedProjects] = useState<Project[] | null>(
    null,
  );
  const [selectedStatuses, setSelectedStatuses] = useState<
    IssueStatus[] | null
  >(null);
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<
    IssueType[] | null
  >(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[] | null>(
    null,
  );
  const [epic, setEpic] = useState<string | null>(null);
  const [sprint, setSprint] = useState<string | null>(null);
  const [jql, setJql] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[] | null>(null);
  const [showIssuesWithPoints, setShowIssuesWithPoints] = useState<
    boolean | null
  >(null);
  const [mode, setMode] = useState<'filters' | 'jql'>('filters');
  // 'order by created DESC'
  const handleApplyFiltersClick = () => {
    onApplyFilters({
      projects: selectedProjects,
      statuses: selectedStatuses,
      issueTypes: selectedIssueTypes,
      keywords: selectedKeywords,
      epic,
      sprint,
      keys: selectedKeys,
      showIssuesWithPoints,
      mode,
      jql: jql || '',
    });
  };

  const handleSwitchToJql = () => {
    setJql(
      getJqlStringFromFilters({
        projects: selectedProjects,
        statuses: selectedStatuses,
        issueTypes: selectedIssueTypes,
        keywords: selectedKeywords,
        epic,
        sprint,
        keys: selectedKeys,
        showIssuesWithPoints,
        mode,
        jql: jql || '',
      }),
    );

    setMode('jql');
  };

  return (
    <VerticalDividerWithScroll
      bottomContent={
        <FlexBox>
          <Button
            onClick={handleApplyFiltersClick}
            isBlock
            isLoading={isLoading}
          >
            Search
          </Button>
        </FlexBox>
      }
      content={
        mode === 'filters' ? (
          <div>
            <VerticalSpacing spacing="spacing-xl" />
            <FormCheckboxList
              label="Project"
              id="project"
              showFilter
              checboxes={
                projects
                  ? projects.map((project) => ({
                      id: `${project.id}`,
                      label: `${project.name}`,
                    }))
                  : []
              }
              checkedChecboxes={
                selectedProjects
                  ? selectedProjects.map((project) => ({
                      id: `${project.id}`,
                      label: `${project.name}`,
                    }))
                  : []
              }
              onChange={(checkedCheckboxes) => {
                const selectedProjects = projects
                  ? projects.filter((project) =>
                      checkedCheckboxes.find(
                        (checkbox) => `${checkbox.id}` === `${project.id}`,
                      ),
                    )
                  : [];
                setSelectedProjects(selectedProjects);
              }}
            />
            <VerticalSpacing spacing="spacing-xl" />
            <FormCheckboxList
              label="Statuses"
              id="status"
              showFilter
              checboxes={
                statuses
                  ? statuses.map((status) => ({
                      id: `${status.id}`,
                      label: status.name,
                    }))
                  : []
              }
              checkedChecboxes={
                selectedStatuses
                  ? selectedStatuses.map((status) => ({
                      id: `${status.id}`,
                      label: status.name,
                    }))
                  : []
              }
              onChange={(checkedCheckboxes) => {
                const selectedStatuses = statuses
                  ? statuses.filter((status) =>
                      checkedCheckboxes.find(
                        (checkbox) => `${checkbox.id}` === `${status.id}`,
                      ),
                    )
                  : null;
                setSelectedStatuses(selectedStatuses);
              }}
            />
            <VerticalSpacing spacing="spacing-xl" />
            <FormCheckboxList
              label="Issue type"
              id="issue-type"
              showFilter
              checboxes={
                issueTypes
                  ? issueTypes.map((issueType) => ({
                      id: `${issueType.id}`,
                      label: issueType.name,
                    }))
                  : []
              }
              checkedChecboxes={
                selectedIssueTypes
                  ? selectedIssueTypes.map((issueType) => ({
                      id: `${issueType.id}`,
                      label: issueType.name,
                    }))
                  : []
              }
              onChange={(checkedCheckboxes) => {
                const selectedIssueTypes = issueTypes
                  ? issueTypes.filter((issueType) =>
                      checkedCheckboxes.find(
                        (checkbox) => `${checkbox.id}` === `${issueType.id}`,
                      ),
                    )
                  : null;
                setSelectedIssueTypes(selectedIssueTypes);
              }}
            />
            <VerticalSpacing spacing="spacing-xl" />
            <KeywordPicker
              label="Key/id"
              selectedKeywords={selectedKeys}
              onChange={setSelectedKeys}
            />
            <VerticalSpacing spacing="spacing-xl" />
            <KeywordPicker
              label="Summary words"
              selectedKeywords={selectedKeywords}
              onChange={setSelectedKeywords}
            />
            <VerticalSpacing spacing="spacing-xl" />
            <div>
              <div>
                <Span spanStyle="bold">Epic name or key</Span>
              </div>
              <VerticalSpacing spacing="spacing-m" />
              <Input value={epic || ''} onChange={setEpic} />
            </div>
            <VerticalSpacing spacing="spacing-xl" />
            <div>
              <div>
                <Span spanStyle="bold">Sprint name</Span>
              </div>
              <VerticalSpacing spacing="spacing-m" />
              <Input value={sprint || ''} onChange={setSprint} />
            </div>
            <VerticalSpacing spacing="spacing-xl" />
            <FormCheckbox
              id="show-issues-with-points"
              label="Show also issues with story points"
              onChange={setShowIssuesWithPoints}
              isChecked={!!showIssuesWithPoints}
            />
            <VerticalSpacing spacing="spacing-xl" />
            <ButtonLink onClick={handleSwitchToJql}>Switch to JQL</ButtonLink>
            <VerticalSpacing spacing="spacing-xxl-2" />
          </div>
        ) : (
          <div>
            <VerticalSpacing spacing="spacing-xl" />
            <div>
              <Span spanStyle="bold">JQL query</Span>
            </div>
            <VerticalSpacing spacing="spacing-m" />
            <Textarea value={jql || 'Order by RANK'} onChange={setJql} />
            <VerticalSpacing spacing="spacing-xl" />
            <FormCheckbox
              id="show-issues-with-points"
              label="Show also issues with story points"
              onChange={setShowIssuesWithPoints}
              isChecked={!!showIssuesWithPoints}
            />
            <VerticalSpacing spacing="spacing-xl" />
            <ButtonLink onClick={() => setMode('filters')}>
              Switch to basic
            </ButtonLink>
            <VerticalSpacing spacing="spacing-xxl-2" />
          </div>
        )
      }
    />
  );
};
