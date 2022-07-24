import {
  FormSelect,
  SelectValue,
  SubmitRow,
  VerticalSpacing,
} from '../../../../packages/react-base';
import { Issue } from '../../../../packages/types-planning-poker';
import React, { useEffect, useState } from 'react';

import styles from './ImportMapper.module.scss';

export type FileRows = Array<Array<string>>;

interface ImportMapperProps {
  onCancel: () => void;
  onSave: (issues: Partial<Issue>[]) => void;
  isUseFirstRowAsHeaders: boolean;
  fileRows: FileRows;
}

type Header = {
  label: string;
  value: string;
};

type Mapping = {
  key: number | null;
  summary: number | null;
  description?: number | null;
  url?: number | null;
  storyPoints?: number | null;
};

const getHeaderIndex = (
  headers: Header[],
  possibleLabels: string[],
  expectedIndex: number | null,
) => {
  const index = headers.find(({ label }) =>
    possibleLabels.includes(label.toLowerCase()),
  )?.value;

  if (index) {
    return Number(index);
  }

  if (typeof expectedIndex === 'number' && expectedIndex < headers.length) {
    return expectedIndex;
  }

  return null;
};

const mapIssues = (
  fileRows: FileRows,
  mapping: Mapping,
  isUseFirstRowAsHeaders: boolean,
) => {
  const issues: Partial<Issue>[] = (isUseFirstRowAsHeaders
    ? fileRows.slice(1)
    : fileRows
  )
    .filter((fileRow) => fileRow.length > 1 || !!fileRow[0])
    .map((fileRow) => {
      const issue: Partial<Issue> = {};

      if (typeof mapping.key === 'number' && fileRow[mapping.key]) {
        issue.key = fileRow[mapping.key];
      }
      if (typeof mapping.summary === 'number' && fileRow[mapping.summary]) {
        issue.summary = fileRow[mapping.summary];
      }
      if (
        typeof mapping.description === 'number' &&
        fileRow[mapping.description]
      ) {
        issue.description = fileRow[mapping.description];
      }
      if (typeof mapping.url === 'number' && fileRow[mapping.url]) {
        issue.url = fileRow[mapping.url];
      }
      if (
        typeof mapping.storyPoints === 'number' &&
        fileRow[mapping.storyPoints]
      ) {
        issue.storyPoints = fileRow[mapping.storyPoints];
      }

      return issue;
    });

  return issues;
};

export const ImportMapper = ({
  fileRows,
  isUseFirstRowAsHeaders,
  onCancel,
  onSave,
}: ImportMapperProps) => {
  const [parsedIssues, setParsedIssues] = useState<Partial<Issue>[]>([]);
  const [headers, setHeaders] = useState<Header[]>([]);
  const [mapping, setMapping] = useState<Mapping>({
    key: null,
    summary: null,
    description: null,
    url: null,
    storyPoints: null,
  });

  useEffect(() => {
    if (!fileRows?.length || !fileRows[0].length) {
      return;
    }

    const newHeaders = fileRows[0].map((header, index) => ({
      label: isUseFirstRowAsHeaders ? header : index.toString(),
      value: index.toString(),
    }));
    const newMapping: Mapping = {
      key: getHeaderIndex(newHeaders, ['key', 'issue key'], 1),
      summary: getHeaderIndex(newHeaders, ['summary'], 0),
      description: getHeaderIndex(newHeaders, ['description'], 2),
      url: getHeaderIndex(newHeaders, ['url'], null),
      storyPoints: getHeaderIndex(newHeaders, ['storyPoints'], null),
    };

    setMapping(newMapping);
    setParsedIssues(mapIssues(fileRows, newMapping, isUseFirstRowAsHeaders));
    setHeaders(newHeaders);
  }, [fileRows, isUseFirstRowAsHeaders]);

  const handleHeaderSelectChange = (
    option: SelectValue<Header>,
    mapKey: string,
  ) => {
    const value: Header =
      Array.isArray(option) && option.length > 0 ? option[0] : option;

    const index = value?.value ? Number(value.value) : null;

    const newMapping = {
      ...mapping,
      [mapKey]: index,
    };

    setParsedIssues(mapIssues(fileRows, newMapping, isUseFirstRowAsHeaders));
    setMapping(newMapping);
  };

  return (
    <div className={styles.importMapper}>
      <table width="100%">
        <colgroup>
          <col span={1} style={{ width: '40%' }} />
          <col span={1} style={{ width: '5%' }} />
          <col span={1} style={{ width: '30%' }} />
          <col span={1} style={{ width: '20%' }} />
          <col span={1} style={{ width: '5%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <div className={styles.selectWrapper}>
                <FormSelect
                  label="Summary (required)"
                  options={headers}
                  size="small"
                  value={headers.find(
                    (header) => header.value === mapping.summary?.toString(),
                  )}
                  onChange={(option) => handleHeaderSelectChange(option, 'summary')}
                />
                <span>Summary</span>
                <VerticalSpacing spacing="spacing-s" />
              </div>
            </th>
            <th>
              <div className={styles.selectWrapper}>
                <FormSelect
                  label="Key"
                  options={headers}
                  isClearable
                  size="small"
                  value={headers.find(
                    (header) => header.value === mapping.key?.toString(),
                  )}
                  onChange={(option) => handleHeaderSelectChange(option, 'key')}
                />
                <span>Key</span>
                <VerticalSpacing spacing="spacing-s" />
              </div>
            </th>
            <th>
              <div className={styles.selectWrapper}>
                <FormSelect
                  label="Description"
                  options={headers}
                  size="small"
                  isClearable
                  value={headers.find(
                    (header) =>
                      header.value === mapping.description?.toString(),
                  )}
                  onChange={(option) => handleHeaderSelectChange(option, 'description')}
                />
                <span>Description</span>
                <VerticalSpacing spacing="spacing-s" />
              </div>
            </th>
            <th>
              <div className={styles.selectWrapper}>
                <FormSelect
                  label="Link"
                  options={headers}
                  isClearable
                  size="small"
                  value={headers.find(
                    (header) => header.value === mapping.url?.toString(),
                  )}
                  onChange={(option) => handleHeaderSelectChange(option, 'url')}
                />
                <span>Link</span>
                <VerticalSpacing spacing="spacing-s" />
              </div>
            </th>
            <th>
              <div className={styles.selectWrapper}>
                <FormSelect
                  label="Story Points"
                  options={headers}
                  isClearable
                  size="small"
                  value={headers.find(
                    (header) =>
                      header.value === mapping.storyPoints?.toString(),
                  )}
                  onChange={(option) => handleHeaderSelectChange(option, 'storyPoints')}
                />
                <span>Story Points</span>
                <VerticalSpacing spacing="spacing-s" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {parsedIssues.map((issue, index) => (
            <tr key={index}>
              <td>{issue.summary}</td>
              <td>{issue.key}</td>
              <td>{issue.description}</td>
              <td>{issue.url}</td>
              <td>{issue.storyPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <VerticalSpacing spacing="spacing-xl" />
      <SubmitRow
        cancelLabel="Cancel"
        onCancel={onCancel}
        confirmLabel="Import issues"
        onConfirm={() => onSave(parsedIssues)}
        align="right"
      />
    </div>
  );
};
