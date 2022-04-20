import { PokerTableResults } from '@we-agile-you/types-planning-poker';

export const getAgreementFromResults = (
  deckArray: string[],
  results: PokerTableResults,
) => {
  const totalCards = deckArray.length;

  let mostVoted = [results.votes[0]];

  for (const vote of results.votes) {
    if (vote.totalVotes > mostVoted[0].totalVotes) {
      mostVoted = [vote];
    }

    if (vote.totalVotes === mostVoted[0].totalVotes) {
      mostVoted.push(vote);
    }
  }

  let mostVotedCards = mostVoted.map((vote) => vote.card.trim());
  mostVotedCards = mostVotedCards.filter(
    (card, index) => mostVotedCards.indexOf(card) === index,
  );

  const mostVotedCardsIndexes = mostVotedCards
    .map((card) => deckArray.indexOf(card))
    .filter((index) => index >= 0);

  if (!mostVotedCardsIndexes.length) {
    return null;
  }

  let totalVotes = 0;

  const deviation = results.votes.reduce((deviation, vote) => {
    const card = vote.card.trim();

    const cardIndex = deckArray.indexOf(card);

    if (cardIndex < 0 || card === '?') return deviation;

    totalVotes += vote.totalVotes;

    const cardDeviation = mostVotedCardsIndexes.reduce(
      (cardDeviation, mostVotedCardIndex) => {
        if (
          mostVotedCardIndex === cardIndex &&
          mostVotedCardsIndexes.length > 1
        ) {
          return cardDeviation;
        }

        const deviation = Math.pow(cardIndex - mostVotedCardIndex, 2);

        if (deviation < cardDeviation) {
          return deviation;
        }

        return cardDeviation;
      },
      totalCards,
    );

    const cardDeviationPercentatge = cardDeviation / totalCards;

    return deviation + cardDeviationPercentatge * vote.totalVotes;
  }, 0);

  const deviationPercentatge = deviation / totalVotes;

  // regla de 3, 0.2 seria el 100%
  return Math.max(0, Math.round(100 - (100 * deviationPercentatge) / 0.2));
};
