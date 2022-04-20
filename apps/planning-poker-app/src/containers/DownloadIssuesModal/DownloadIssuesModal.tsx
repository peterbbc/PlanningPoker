import {
  Modal,
  FlexBox,
  Button,
  HoritzontalSpacing,
  ModalTitle,
  VerticalSpacing,
  FormInput,
  Paragraph,
} from '@we-agile-you/react-base';
import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import Papa from 'papaparse';

import { useCurrentTable } from '../../spaces/poker-table/hooks/useCurrentTable';

import styles from './DownloadIssuesModal.module.scss';

interface DownloadIssuesModalProps {
  onClose: () => void;
}

const DEFAULT_COLUMN_NAMES = [
  'Summary',
  'Key',
  'Description',
  'Link',
  'Story Points',
];

export const DownloadIssuesModal = ({ onClose }: DownloadIssuesModalProps) => {
  const { pokerTable } = useCurrentTable();

  const [value, setValue] = useState('');
  const [fields, setFields] = useState<string[]>(DEFAULT_COLUMN_NAMES);
  const [data, setData] = useState<any>();

  const issues = pokerTable.issues;

  useEffect(() => {
    if (!issues) return;

    const data = issues.map((issue) => [
      issue.summary || '',
      issue.key || '',
      issue.description || '',
      issue.url || '',
      issue.storyPoints || '',
    ]);

    let value = Papa.unparse([fields, ...data]);

    setValue(value);
  }, [fields]);

  useEffect(() => {
    if (value) {
      const fields = Papa.parse(value);

      if (fields.data) {
        setData(fields.data);
      }
    }
  }, [value]);

  return ReactDom.createPortal(
    <Modal onClose={onClose} width="big">
      <ModalTitle>Download issues as CSV</ModalTitle>
      <Paragraph>
        If you want, you can choose different column names for your exported CSV
        file.
      </Paragraph>
      <Paragraph>
        When you are done click on "Download CSV" to get your file.
      </Paragraph>
      <VerticalSpacing spacing="spacing-xxl-2" />
      {fields?.length && (
        <table width="100%" className={styles.table}>
          <thead>
            <tr>
              {fields.map((columnName: string, index) => (
                <th>
                  <FormInput
                    label={DEFAULT_COLUMN_NAMES[index]}
                    value={columnName}
                    onChange={(value) =>
                      setFields(
                        fields.map((_columnName, _index) =>
                          index === _index ? value : _columnName,
                        ),
                      )
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((row: string[], index: number) =>
              index > 0 ? (
                <tr key={index}>
                  {row.map((value) => (
                    <td>{value}</td>
                  ))}
                </tr>
              ) : null,
            )}
          </tbody>
        </table>
      )}
      <VerticalSpacing spacing="spacing-xxl-2" />
      <FlexBox justifyContent="space-between">
        <Button isBlock buttonStyle="tertiary" onClick={onClose}>
          Cancel
        </Button>
        <HoritzontalSpacing spacing="spacing-l" />
        <a
          style={{ width: '100%' }}
          href={'data:text/plain;charset=utf-8,' + encodeURIComponent(value)}
          download="issues.csv"
          onClick={onClose}
        >
          <Button isBlock>Download CSV</Button>
        </a>
      </FlexBox>
    </Modal>,
    document.body,
  );
};
