import { PokerTableResults } from '@we-agile-you/types-planning-poker';

export const getAverageFromResults = (
  results?: PokerTableResults,
): number | null => {
  const totalPlayers = new Array((results && results.total) || 0).fill('');
  let pointSum: number = -1;
  let noNumberVotes = 0;

  if (results) {
    pointSum = results.votes.reduce((pointSum, vote) => {
      const number = vote.card.trim() === '½' ? 0.5 : Number(vote.card);

      if (isNaN(number)) {
        noNumberVotes += vote.totalVotes;
        return pointSum;
      }

      return pointSum === -1
        ? number * vote.totalVotes
        : pointSum + number * vote.totalVotes;
    }, pointSum);
  }

  const totalNumberVotes = totalPlayers.length - noNumberVotes;

  const average =
    pointSum !== -1 && totalNumberVotes > 0
      ? Math.round((pointSum / totalNumberVotes) * 100) / 100
      : null;

  return average;
};
