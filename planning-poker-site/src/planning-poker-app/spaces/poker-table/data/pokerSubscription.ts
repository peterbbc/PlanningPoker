import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import {
  Player,
  PokerTable,
  PokerTableServer,
} from '../../../../packages/types-planning-poker';

export const subscribeToTable = (
  tableId: string,
  onTableChanged: (table: Partial<PokerTable>) => void,
  onTablePlayersChanged: (players: Player[]) => void,
  onTableDontExist: () => void,
) => {
  const tableRef = firebase.firestore().collection('poker-tables').doc(tableId);
  const playersRef = firebase
    .firestore()
    .collection('players')
    .where('tableId', '==', tableId);

  let unsubscribeToTable = [
    tableRef.onSnapshot(
      function (doc) {
        const table: Partial<PokerTableServer> | undefined = doc.data();

        if (!table) {
          onTableDontExist();
          return;
        }

        let isPremium = false;

        if (table.subscriptionCurrentPeriodEnd) {
          const nowMilis = new Date().getTime();
          const subscriptionEndMilis = table.subscriptionCurrentPeriodEnd
            .toDate()
            .getTime();

          if (nowMilis < subscriptionEndMilis + 86400000 * 2) {
            isPremium = true;
          }
        }

        const isGameOver = !isPremium && table.votingCountdown === 0;
        const isSomePlayersReachedFreeLimit =
          !isPremium &&
          !!table.playersThatReachedLimit &&
          table.playersThatReachedLimit.length > 1;

        const data: Partial<PokerTable> = {
          id: tableRef.id,
          ...table,
          subscriptionCurrentPeriodEnd: table.subscriptionCurrentPeriodEnd?.toDate(),
          lastShowCards: table.lastShowCards?.toDate(),
          timerStartedAt: table.timerStartedAt?.toDate(),
          isPremium,
          isGameOver,
          isSomePlayersReachedFreeLimit,
        };

        onTableChanged(data);
      },
      () => {
        alert('Error');
      },
    ),
    playersRef.onSnapshot(function (querySnapshot) {
      const players: Player[] = [];

      querySnapshot.forEach(function (doc) {
        players.push({
          uid: '',
          tableId: '',
          ...doc.data(),
        });
      });

      onTablePlayersChanged(players);
    }),
  ];

  return async function unsubscribeFromPokerTable() {
    unsubscribeToTable.forEach((unsubscribe) => unsubscribe());

    unsubscribeToTable = [];
  };
};
