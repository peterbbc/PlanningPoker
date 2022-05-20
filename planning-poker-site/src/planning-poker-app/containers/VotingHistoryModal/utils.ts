import { getAgreementFromResults } from '../../spaces/poker-table/utils/getAgreementFromResults';
import {
  getClosestCardToAverage,
  getCardWithMoreVotes,
} from '../../spaces/poker-table/actions/playerActions';
import Papa from 'papaparse';
import {
  getMonthWithDayAndYearAndTimeInLocalTime,
  getMinutesAndSecondsFromMilis,
} from '../../../packages/js-base';
import {
  PokerTableResults,
  Issue,
  Voting,
} from '../../../packages/types-planning-poker';
import { getAverageFromResults } from '../../spaces/poker-table/utils/getAverageFromResults';
export type Meeting = {
  date: Date;
  votings: ParsedVoting[];
};

export const columnLabels = {
  issue: 'Issue',
  result: 'Result',
  average: 'Average',
  mostVotedCard: 'Most voted card',
  agreement: 'Agreement',
  durationString: 'Duration',
  playersVotedTotal: 'Players voted',
  playersOnlineTotal: 'Players total',
  timestamp: 'Time',
};

export type ParsedVoting = {
  timestamp: Date;
  agreement: number;
  duration: number | null;
  durationString: string;
  playersOnlineTotal: number;
  playersVotedTotal: number;
  mostVotedCard?: string;
  average?: number | null;
  result?: string | null;
  issue?: Issue | null;
  results?: PokerTableResults | null;
};
export const getMeetingsFromParsedVotings = (votings: ParsedVoting[]) => {
  const meetings: Meeting[] = votings.reduce(
    (meetings, voting, index, votings) => {
      if (!meetings.length) {
        return [
          {
            date: votings[index].timestamp,
            votings: [votings[index]],
          },
        ];
      }

      if (
        typeof voting.duration === 'number' &&
        voting.duration > 1000 * 60 * 60
      ) {
        return [
          ...meetings,
          {
            date: votings[index].timestamp,
            votings: [votings[index]],
          },
        ];
      }

      return meetings.map((meeting, index) =>
        index === meetings.length - 1
          ? { ...meeting, votings: [...meeting.votings, voting] }
          : meeting,
      );
    },
    [] as Meeting[],
  );

  return meetings;
};

export const getCSVStringFromParsedVotings = (
  columns: (keyof ParsedVoting)[],
  parsedVotings: ParsedVoting[],
) => {
  const fields = columns.map(
    (column) =>
      column !== 'results' && column !== 'duration' && columnLabels[column],
  );
  const data = parsedVotings.map((parsedVoting) =>
    columns.map((column) => {
      if (column === 'issue') {
        return parsedVoting[column]
          ? `${parsedVoting[column]?.key} - ${parsedVoting[column]?.summary}`
          : '-';
      }
      if (column === 'timestamp') {
        return getMonthWithDayAndYearAndTimeInLocalTime(parsedVoting[column]);
      }

      return parsedVoting[column];
    }),
  );

  let value = Papa.unparse([fields, ...data]);

  return value;
};

export const parseVotings = (votings: Voting[]): ParsedVoting[] => {
  return votings.map((voting, index) => {
    const votingIssue = voting.issues?.find((issue) => issue.isVotingNow);

    const average = voting.results && getAverageFromResults(voting.results);
    const closestCardToAverage = voting.tableDeck &&
      average && getClosestCardToAverage(average, voting.tableDeck);
    const mostVotedCard =
      voting.results && getCardWithMoreVotes(voting.results);
    const result =
      closestCardToAverage !== null
        ? closestCardToAverage
        : voting.results && mostVotedCard;

    const agreement =
      (voting.results && voting.tableDeck &&
        getAgreementFromResults(voting.tableDeck, voting.results)) ||
      2;

    const duration =
      index > 0
        ? voting.timestamp.getTime() - votings[index - 1].timestamp.getTime()
        : null;

    const durationString: string =
      typeof duration === 'number'
        ? duration < 1000 * 60 * 60
          ? getMinutesAndSecondsFromMilis(duration)
          : '1 hour +'
        : '-';

    return {
      timestamp: voting.timestamp,
      agreement,
      duration,
      durationString,
      playersOnlineTotal: voting.playersOnlineTotal!,
      playersVotedTotal: voting.playersVotedTotal!,
      result:
        typeof result === 'number' || typeof result === 'string'
          ? `${result}`
          : result,
      mostVotedCard,
      average,
      issue: votingIssue ? votingIssue : null,
      results: voting.results,
    };
  });
};
