import { getMonthWithDayAndYearAndTimeInLocalTime } from '../../../packages/js-base';
import {
  ButtonIcon,
  FlexBox,
  FormSelect,
  Icon,
  Modal,
  ModalTitle,
  Paragraph,
  Select,
  Span,
  VerticalSpacing,
} from '../../../packages/react-base';
import React, { useEffect, useState } from 'react';
import { DonutChart } from '../../components/molecules/DonutChart/DonutChart';
import { getVotingHistory } from '../../spaces/poker-table/data/poker';
import { useCurrentTable } from '../../spaces/poker-table/hooks/useCurrentTable';
import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from '../../vendors/hotjar/identify';
import { ExportVotingHistory } from './ExportVotingHistory/ExportVotingHistory';
import {
  getMeetingsFromParsedVotings,
  Meeting,
  ParsedVoting,
  parseVotings,
} from './utils';

import styles from './VotingHistoryModal.module.scss';

interface VotingHistoryModalProps {
  onClose: () => void;
}

type Option = { label: string; value: string };
const resultOptions: Option[] = [
  { label: 'Result', value: 'result' },
  { label: 'Average', value: 'average' },
  { label: 'Most voted card', value: 'mostVotedCard' },
];

export const VotingHistoryModal = ({ onClose }: VotingHistoryModalProps) => {
  const gameId = useCurrentTable()?.pokerTable?.id;
  const [selectedMeeting, setSelectedMeeting] = useState<{
    label: string;
    value: string;
  } | null>({
    label: 'All meetings',
    value: 'ALL',
  });
  const [parsedVotings, setParsedVotings] = useState<ParsedVoting[] | null>(
    null,
  );
  const [meetings, setMeetings] = useState<Meeting[] | null>(null);
  const [resultOptionValue, setResultOptionValue] = useState<Option>(
    resultOptions[0],
  );
  const [isShowExport, setIsShowExport] = useState(false);

  useEffect(() => {
    hotjarIdentify(HOTJAR_IDENTIFY_KEYS.OPENED_VOTING_HISTORY, null);
  }, []);

  useEffect(() => {
    if (!gameId) return;
    getVotingHistory(gameId).then((votings) => {
      const parsedVotings = parseVotings(votings);
      setParsedVotings(parsedVotings);
      setMeetings(getMeetingsFromParsedVotings(parsedVotings));
    });
  }, [gameId]);

  console.log(parsedVotings);

  const hasSomeIssue = !!parsedVotings?.find((voting) => !!voting.issue);

  const selectMeetingOptions = [
    ...(meetings
      ? meetings.map((meeting) => ({
          label: `Meeting ${meeting.date.toDateString()} (${meeting.date.toLocaleTimeString()})`,
          value: `${meeting.date.getTime()}`,
        }))
      : []),
    {
      label: 'All meetings',
      value: 'ALL',
    },
  ];

  const displayVotings =
    selectedMeeting?.value === 'ALL'
      ? parsedVotings
      : meetings?.find(
          (meeting) =>
            meeting.date.getTime() === Number(selectedMeeting?.value),
        )?.votings;

  return (
    <Modal
      onClose={onClose}
      width="auto"
      showBackButton={isShowExport}
      onClickBackButton={() => setIsShowExport(false)}
    >
      {isShowExport ? (
        <div>
          <ModalTitle>Export voting history</ModalTitle>
          {displayVotings?.length ? (
            <ExportVotingHistory
              hasSomeIssue={hasSomeIssue}
              votings={displayVotings}
              selectedResultColumn={
                resultOptionValue.value as
                  | 'result'
                  | 'average'
                  | 'mostVotedCard'
              }
              onCancel={() => setIsShowExport(false)}
            />
          ) : (
            <Paragraph color="grey500">No voting to export</Paragraph>
          )}
        </div>
      ) : (
        <div className={styles['voting-history-modal']}>
          <ModalTitle>Voting history</ModalTitle>
          <FlexBox justifyContent="space-between">
            <div className={styles['meeting-select']}>
              <FormSelect
                options={selectMeetingOptions}
                value={selectedMeeting}
                onChange={setSelectedMeeting}
                isBlock
              />
            </div>
            <div style={{ flexShrink: 0 }}>
              <ButtonIcon
                onClick={() => setIsShowExport(true)}
                icon={<Icon icon="export" />}
                tooltip="Export as CSV"
              />
            </div>
          </FlexBox>
          <div className={styles['table-wrapper']}>
            <table width="100%">
              <colgroup>
                <col span={1} style={{ width: hasSomeIssue ? '40%' : '10%' }} />
                <col span={1} style={{ width: '10%' }} />
                <col span={1} style={{ width: '10%' }} />
                <col span={1} style={{ width: '10%' }} />
                <col span={1} style={{ width: '10%' }} />
                <col span={1} style={{ width: '20%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>
                    <Span size="micro" spanStyle="bold">
                      Issue
                    </Span>
                  </th>
                  <th style={{ minWidth: 200 }}>
                    <Select
                      value={resultOptionValue}
                      options={resultOptions}
                      onChange={setResultOptionValue}
                      isTableHeader
                      isSearchable={false}
                    />
                  </th>
                  <th>
                    <Span size="micro" spanStyle="bold">
                      Agreement
                    </Span>
                  </th>
                  <th>
                    <Span size="micro" spanStyle="bold">
                      Duration
                    </Span>
                  </th>
                  <th>
                    <Span size="micro" spanStyle="bold">
                      Players voted/total
                    </Span>
                  </th>
                  <th>
                    <Span size="micro" spanStyle="bold">
                      Time
                    </Span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayVotings &&
                  displayVotings.map((voting: ParsedVoting, index: number) => {
                    return (
                      <tr key={index}>
                        <td>
                          <Span size="micro">
                            {voting.issue
                              ? `${voting.issue.key} - ${voting.issue.summary}`
                              : '-'}
                          </Span>
                        </td>
                        <td>
                          {
                            voting[
                              resultOptionValue.value as keyof ParsedVoting
                            ]
                          }
                        </td>
                        <td>
                          {voting.results && (
                            <FlexBox justifyContent="end">
                              <div style={{ transform: 'scale(0.8)' }}>
                                <DonutChart percentatge={voting.agreement} />
                              </div>
                            </FlexBox>
                          )}
                        </td>
                        <td>{voting.durationString}</td>
                        <td>
                          <FlexBox alignItems="center" justifyContent="end">
                            <ButtonIcon
                              icon={<Icon icon="user" />}
                              isShowTooltipOnSmallScreen
                              tooltip={
                                <>
                                  {voting.results?.votes.map((vote) => (
                                    <div>
                                      {vote.playersVoted.map(
                                        (player, index, players) => (
                                          <>
                                            {`${player.displayName}${
                                              index !== players.length - 1
                                                ? ', '
                                                : ''
                                            }`}
                                          </>
                                        ),
                                      )}
                                      {`: ${vote.card}`}
                                    </div>
                                  ))}
                                </>
                              }
                            />

                            {`${voting.playersVotedTotal}/${voting.playersOnlineTotal}`}
                          </FlexBox>
                        </td>
                        <td>
                          {voting.timestamp &&
                            getMonthWithDayAndYearAndTimeInLocalTime(
                              voting.timestamp,
                            )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <VerticalSpacing spacing="spacing-xxl" />
            </table>
          </div>
          {selectedMeeting?.value === 'ALL' && displayVotings?.length === 0 && (
            <>
              <VerticalSpacing spacing="spacing-xxl-4" />
              <Paragraph align="center" color="grey500">
                No votings yet for this game
              </Paragraph>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};
