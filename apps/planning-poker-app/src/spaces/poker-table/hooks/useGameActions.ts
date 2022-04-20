import { updateCurrentUser } from './../../auth/data/user';
import { deletePokerGame } from '../data/poker';
import useCurrentUser from '../../auth/hooks/useCurrentUser';

interface GameActions {
  deleteGame: (gameId: string) => Promise<void>;
}

export const useGameActions = (): GameActions => {
  const { user } = useCurrentUser();

  const deleteGame = (gameId: string) =>
    deletePokerGame(gameId).then(() => {
      if (!user?.gameHistory) {
        return Promise.resolve();
      }

      return updateCurrentUser({
        gameHistory: user.gameHistory.filter((game) => game.id !== gameId),
      });
    });

  return {
    deleteGame,
  };
};
