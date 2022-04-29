// import { getMockedPlayers } from './mocks';
import { useCurrentTable } from './useCurrentTable';
import { Player } from '@we-agile-you/types-planning-poker';

interface PlayerDistribution {
  top: Player[];
  bottom: Player[];
  left: Player[];
  right: Player[];
}

const mapPlayersToVerticalDistribution = (
  players: Player[],
): PlayerDistribution => {
  const distribution: PlayerDistribution = {
    top: [],
    left: [],
    right: [],
    bottom: [],
  };

  for (let i = 0; i < players.length; ++i) {
    if (i === 1 || i === 2) {
      distribution.top.push(players[i]);
    } else if (i === 4 || (i > 5 && i % 2 === 0)) {
      distribution.left.push(players[i]);
    } else if (i === 5 || (i > 5 && i % 2 === 1)) {
      distribution.right.push(players[i]);
    } else if (i === 0 || i === 3) {
      distribution.bottom.push(players[i]);
    }
  }

  return distribution;
};

const mapPlayersToHorizontalDistribution = (
  players: Player[],
): PlayerDistribution => {
  const distribution: PlayerDistribution = {
    top: [],
    left: [],
    right: [],
    bottom: [],
  };

  for (let i = 0; i < players.length; ++i) {
    if (i === 1 || i === 2 || i === 4 || i === 8 || i === 10 || i === 12) {
      distribution.top.push(players[i]);
    } else if (i === 6 || i === 14 || (i > 15 && i % 2 === 0)) {
      distribution.left.push(players[i]);
    } else if (i === 7 || i === 15 || (i > 15 && i % 2 === 1)) {
      distribution.right.push(players[i]);
    } else if (
      i === 0 ||
      i === 3 ||
      i === 5 ||
      i === 9 ||
      i === 11 ||
      i === 13
    ) {
      distribution.bottom.push(players[i]);
    }
  }

  return distribution;
};

export const usePlayerDistribution = (layout: 'horizontal' | 'vertical') => {
  const { pokerTable } = useCurrentTable();

  const { results, players } = pokerTable;
  const auxPlayers: Player[] = [];
  const missingPlayers = results
    ? results.votes.reduce((missingPlayers, vote) => {
        if (vote.playersVoted) {
          for (const player of vote.playersVoted) {
            const isInPlayers = !!players.find(
              (_player) => _player.uid === player.uid,
            );

            if (!isInPlayers) {
              missingPlayers.push(player);
            }
          }
        }

        return missingPlayers;
      }, auxPlayers)
    : [];

  const allPlayers = [...players, ...missingPlayers];

  let playerDistribution: PlayerDistribution = {
    top: [],
    left: [],
    right: [],
    bottom: [],
  };

  // if (
  //   process.env.GATSBY_ENV !== 'production' &&
  //   (pokerTable.id === 'Q7Li2vL6XtTHVMw3zxQc' ||
  //     pokerTable.id === 'hnMFYaLB5spgnr6vLZ5M' ||
  //     pokerTable.id === 'nTZc8aMQY2LhIPvaoEeq')
  // ) {
  //   const mockedPlayers: Player[] = getMockedPlayers(players[0], pokerTable.id);
  //
  //   playerDistribution =
  //     layout === 'vertical'
  //       ? mapPlayersToVerticalDistribution(mockedPlayers)
  //       : mapPlayersToHorizontalDistribution(mockedPlayers);
  //
  //   return {
  //     playerDistribution,
  //     totalPlayers: mockedPlayers.length,
  //   };
  // }

  playerDistribution =
    layout === 'vertical'
      ? mapPlayersToVerticalDistribution(allPlayers)
      : mapPlayersToHorizontalDistribution(allPlayers);

  return {
    playerDistribution,
    totalPlayers: allPlayers.length,
  };
};
