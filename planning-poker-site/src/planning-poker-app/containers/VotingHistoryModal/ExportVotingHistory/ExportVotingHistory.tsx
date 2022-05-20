import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  FlexBox,
  HoritzontalSpacing,
  VerticalSpacing,
} from '../../../../packages/react-base';

import styles from './ExportVotingHistory.module.scss';
import {
  columnLabels,
  getCSVStringFromParsedVotings,
  ParsedVoting,
} from '../utils';

interface ExportVotingHistoryProps {
  votings: ParsedVoting[];
  hasSomeIssue?: boolean;
  onCancel?: () => void;
  onDownload?: () => void;
  selectedResultColumn: 'result' | 'average' | 'mostVotedCard';
}

export const ExportVotingHistory = ({
  votings,
  hasSomeIssue,
  onCancel,
  onDownload,
  selectedResultColumn,
}: ExportVotingHistoryProps) => {
  const [checkboxes, setCheckboxes] = useState(
    Object.keys(columnLabels).map((columnKey) => {
      let value = true;
      if (columnKey === 'issue' && !hasSomeIssue) {
        value = false;
      }
      if (
        (columnKey === 'result' ||
          columnKey === 'average' ||
          columnKey === 'mostVotedCard') &&
        selectedResultColumn !== columnKey
      ) {
        value = false;
      }
      return {
        label: columnLabels[columnKey as keyof typeof columnLabels],
        columnKey: columnKey,
        value,
      };
    }),
  );

  const [CSVString, setCSVString] = useState<null | string>(null);

  useEffect(() => {
    setCSVString(
      getCSVStringFromParsedVotings(
        checkboxes
          .filter((checkbox) => checkbox.value)
          .map((checkbox) => checkbox.columnKey as keyof ParsedVoting),
        votings,
      ),
    );
  }, [votings, checkboxes]);

  return (
    <div className={styles['export-voting-history']}>
      <FlexBox justifyContent="center" wrapElements>
        {checkboxes.map((checkbox, index) => (
          <>
            <FlexBox isInline alignItems="center">
              <Checkbox
                checked={checkbox.value}
                onChange={() =>
                  setCheckboxes(
                    checkboxes.map((checkbox, _index) =>
                      _index === index
                        ? { ...checkbox, value: !checkbox.value }
                        : checkbox,
                    ),
                  )
                }
              />{' '}
              {checkbox.label}{' '}
            </FlexBox>
            <HoritzontalSpacing spacing="spacing-m" />
          </>
        ))}
      </FlexBox>
      <VerticalSpacing spacing="spacing-xxl-4" />
      <FlexBox justifyContent="space-between">
        <Button isBlock buttonStyle="tertiary" onClick={onCancel}>
          Cancel
        </Button>
        <HoritzontalSpacing spacing="spacing-l" />
        <a
          style={{ width: '100%' }}
          href={
            CSVString
              ? 'data:text/plain;charset=utf-8,' + encodeURIComponent(CSVString)
              : ''
          }
          download="votings.csv"
          onClick={onDownload}
        >
          <Button isBlock>Download CSV</Button>
        </a>
      </FlexBox>
    </div>
  );
};
