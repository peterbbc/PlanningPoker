import { PokerTableResults } from '../../../../packages/types-planning-poker';

export const getMostVoredCardsFromResults = (
  results: PokerTableResults,
): string[] => {
  let mostVotedCards = [results.votes[0]];

  for (const vote of results.votes) {
    if (vote.totalVotes > mostVotedCards[0].totalVotes) {
      mostVotedCards = [vote];
    }

    if (vote.totalVotes === mostVotedCards[0].totalVotes) {
      mostVotedCards.push(vote);
    }
  }

  return mostVotedCards.map(vote => vote.card);
};
