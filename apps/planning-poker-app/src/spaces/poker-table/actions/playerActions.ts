import { updatePokerTable } from './../data/poker';
import {
  Player,
  PokerTable,
  PokerTableResults,
} from '@we-agile-you/types-planning-poker';
import {
  hideCards as hideCardsData,
  playerVote,
  showCards as showCardsData,
  ShowCardsEvent,
} from '../data/poker';
import { getAverageFromResults } from '../utils/getAverageFromResults';

export const mapPlayersToResults = (players: Player[]) => {
  const defaultResults: PokerTableResults = { total: 0, votes: [] };
  return players.reduce((results, player) => {
    if (player.vote) {
      const cardIndex = results.votes.findIndex(
        (value) => value.card === player.vote,
      );
      if (cardIndex !== -1) {
        results.votes[cardIndex].totalVotes += 1;
        results.votes[cardIndex].playersVoted.push(player);
      } else {
        results.votes.push({
          card: player.vote,
          totalVotes: 1,
          playersVoted: [player],
        });
      }
      results.total += 1;
    }
    return results;
  }, defaultResults);
};

export const vote = (tableId: string, vote: string | null) =>
  playerVote(tableId, vote);

const waitOneSecond = () => new Promise((res) => window.setTimeout(res, 600));
export const showCards = async (
  pokerTable: PokerTable,
  eventData: ShowCardsEvent,
  showNow?: boolean,
) => {
  if (!pokerTable.id) return;

  if (!showNow) {
    updatePokerTable(pokerTable.id, {
      cardsUpCountdown: 2,
    });

    await waitOneSecond();

    updatePokerTable(pokerTable.id, {
      cardsUpCountdown: 1,
    });

    await waitOneSecond();
  }

  const results = mapPlayersToResults(pokerTable.players);

  const currentIssueIndex =
    pokerTable.issues &&
    pokerTable.issues.findIndex((issue) => issue.isVotingNow);

  const isVotingIssue =
    currentIssueIndex !== undefined &&
    currentIssueIndex >= 0 &&
    results.votes.length > 0 &&
    pokerTable.issues;

  if (
    !isVotingIssue ||
    !pokerTable.issues ||
    typeof currentIssueIndex === 'undefined'
  ) {
    return showCardsData(pokerTable, results, null, eventData);
  }

  const average = getAverageFromResults(results);
  const closestCardToAverage = getClosestCardToAverage(
    average,
    pokerTable.deck,
  );

  const mostVotedCard =
    closestCardToAverage !== null
      ? closestCardToAverage
      : getCardWithMoreVotes(results);

  pokerTable.issues[currentIssueIndex].storyPoints = mostVotedCard;

  return showCardsData(
    pokerTable,
    results,
    pokerTable.issues.map((issue, index) => {
      if (index === currentIssueIndex) {
        return {
          ...issue,
          storyPoints: mostVotedCard,
        };
      }

      return issue;
    }),
    eventData,
  );
};

export const hideCards = (tableId: string) => {
  return hideCardsData(tableId);
};

export const getClosestCardToAverage = (
  average: number | null,
  cards: string[],
): string | null => {
  let mostVotedCard: string | null = null;

  if (average) {
    for (let i = 0; i < cards.length - 1; ++i) {
      const cardNumber = Number(cards[i]);
      const nextCardNumber = Number(cards[i + 1]);

      if (average === cardNumber) {
        mostVotedCard = cards[i];
      }
      if (average === nextCardNumber) {
        mostVotedCard = cards[i + 1];
      } else if (
        !isNaN(cardNumber) &&
        !isNaN(nextCardNumber) &&
        average > cardNumber &&
        average < nextCardNumber
      ) {
        mostVotedCard =
          average - cardNumber > nextCardNumber - average
            ? cards[i + 1]
            : cards[i];
      }
    }
  }

  return mostVotedCard;
};

export const getCardWithMoreVotes = (results: PokerTableResults): string => {
  const mostVoted = results.votes.reduce((mostVotted, vote) => {
    if (vote.totalVotes > mostVotted.totalVotes) {
      return vote;
    }

    return mostVotted;
  }, results.votes[0]);

  return mostVoted.card;
};
