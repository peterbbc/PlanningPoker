import { getObjectWithoutUndefinedValues } from '../../../../packages/js-base';
import defaultFirebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";

import {
  User,
  PokerTable,
  PokerTableResults,
  VotingForUpdate,
  Issue,
  PokerTableSummary,
  VotingServer,
  Voting,
} from '../../../../packages/types-planning-poker';
import { DEFAULT_CARD_LIST } from '../constants';

export const POKER_GAMES_COLLECTION = 'poker-tables';
export const PLAYERS_COLLECTION = 'players';
export const VOTINGS_COLLECTION = 'votings';

/**
 * createPokerGame
 * @param table default game attributes for the newly created game
 * @param firebase set another firebase project namespace
 */
export const createPokerGame = (
  game: Partial<PokerTable>,
  user: User,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser) {
    return Promise.reject('No valid user is signed in.');
  }

  const newGame = {
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    ownerId: signedInUser.uid,
    deck: DEFAULT_CARD_LIST,
    subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd
      ? firebase.firestore.Timestamp.fromDate(user.subscriptionCurrentPeriodEnd)
      : null,
    ...game,
  };

  return firebase
    .firestore()
    .collection(POKER_GAMES_COLLECTION)
    .add(newGame)
    .then((pokerTableDocRef) => pokerTableDocRef.id);
};

/**
 * startTimerForGame
 * @param tableId
 * @param timerDurationMinutes
 * @param firebase set another firebase project namespace
 */
export const startTimerForGame = (
  gameId: string,
  timerDurationMinutes: number,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!gameId) return Promise.reject();
  if (!signedInUser) {
    return Promise.reject('No valid user is signed in.');
  }
  return firebase
    .firestore()
    .collection(POKER_GAMES_COLLECTION)
    .doc(gameId)
    .update({
      timerStartedAt: firebase.firestore.FieldValue.serverTimestamp(),
      timerDurationMinutes,
      timerCurrentDurationMinutes: timerDurationMinutes,
    });
};

/**
 * cancelTimerForGame
 * @param tableId
 * @param firebase set another firebase project namespace
 */
export const cancelTimerForGame = (
  gameId: string,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!gameId) return Promise.reject();
  if (!signedInUser) {
    return Promise.reject('No valid user is signed in.');
  }
  return firebase
    .firestore()
    .collection(POKER_GAMES_COLLECTION)
    .doc(gameId)
    .update({
      timerStartedAt: firebase.firestore.FieldValue.delete(),
    });
};

/**
 * updateTimer
 * @param gameId
 * @param timerDurationMinutes
 * @param firebase set another firebase project namespace
 */
export const updateCurrentTimerForGame = (
  gameId: string,
  timerCurrentDurationMinutes: number,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!gameId) return Promise.reject();
  if (!signedInUser) {
    return Promise.reject('No valid user is signed in.');
  }
  return firebase
    .firestore()
    .collection(POKER_GAMES_COLLECTION)
    .doc(gameId)
    .update({
      timerCurrentDurationMinutes,
    });
};
/**
 * updateTimerAutoRestart
 * @param gameId
 * @param timerAutoRestart
 * @param firebase set another firebase project namespace
 */
export const updateTimerAutoRestart = (
  gameId: string,
  timerAutoRestart: boolean,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!gameId) return Promise.reject();
  if (!signedInUser) {
    return Promise.reject('No valid user is signed in.');
  }
  return firebase
    .firestore()
    .collection(POKER_GAMES_COLLECTION)
    .doc(gameId)
    .update({
      timerAutoRestart,
    });
};

/**
 * deletePokerGame
 * @param gameid id of the game to delete
 * @param firebase set another firebase project namespace
 */
export const deletePokerGame = (gameId: string, firebase = defaultFirebase) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser) {
    return Promise.reject();
  }

  return firebase
    .firestore()
    .collection(POKER_GAMES_COLLECTION)
    .doc(gameId)
    .delete();
};

/**
 * playerVote: updates the card selected by the currently signed in player
 * @param tableId table at what the player is voting
 * @param vote the card the player has voted
 * @param firebase set another firebase project namespace
 */
export const playerVote = (
  gameId: string,
  vote: string | null,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser) {
    return Promise.reject();
  }

  const playerId = `${signedInUser.uid}_${gameId}`;

  return firebase
    .firestore()
    .collection(PLAYERS_COLLECTION)
    .doc(playerId)
    .update({
      vote,
    });
};

export const hideCards = async (
  tableId: string,
  firebase = defaultFirebase,
) => {
  const results: PokerTableResults = {
    total: 0,
    votes: [],
  };

  await firebase
    .firestore()
    .collection(PLAYERS_COLLECTION)
    .where('tableId', '==', tableId)
    .get()
    .then((querySnapshot) =>
      querySnapshot.forEach((doc) =>
        doc.ref.update({
          vote: null,
        }),
      ),
    );

  await firebase
    .firestore()
    .collection(POKER_GAMES_COLLECTION)
    .doc(tableId)
    .update({
      cardsUp: false,
      results,
    });
};

const createVoting = (
  table: PokerTable,
  results: PokerTableResults | null,
  issues: Issue[] | null,
  eventData?: ShowCardsEvent,
  firebase = defaultFirebase,
) => {
  const voting: VotingForUpdate = {
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    tableId: table.id,
    tableOwnerId: table.ownerId,
    tableCreatedAt: table.createdAt?.toString
      ? table.createdAt?.toString()
      : '',
    tableVotingCount: table.votingCount,
    tableVotingCountdown: table.votingCountdown,
    tablePlayersAll: table.playersAll.map((player) => player.uid),
    tablePlayersAllTotal: table.playersAll.length,
    tableWhoCanShowCards: table.whoCanShowCards,
    tableDeck: table.deck,
    tableIsPremium: table.isPremium,
    milisecondsPassedSinceLastShowCards: table.lastShowCards
      ? Date.now() - table.lastShowCards?.getTime()
      : null,
    playersOnline: table.players.map((player) => player.uid),
    playersOnlineTotal: table.players.length,
    playersVoted: table.players
      .filter((player) => !!player.vote)
      .map((player) => player.uid),
    playersVotedTotal: table.players.filter((player) => !!player.vote).length,
    results,
    issues: issues || null,
    ...eventData,
  };
  type VotingKey = keyof VotingForUpdate;
  Object.keys(voting).forEach((key) => {
    const resolvedKay = key as VotingKey;
    voting[resolvedKay] === undefined && delete voting[resolvedKay];
  });
  firebase.firestore().collection(VOTINGS_COLLECTION).add(voting);
};
export const getVotingHistory = (gameId: string, firebase = defaultFirebase) =>
  firebase
    .firestore()
    .collection(VOTINGS_COLLECTION)
    .where('tableId', '==', gameId)
    .orderBy('timestamp', 'asc')
    .get()

    .then((snapshot) => {
      const votings: Voting[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as VotingServer;

        votings.push({
          ...data,
          timestamp: data.timestamp.toDate(),
        });
      });

      return votings;
    });

export type ShowCardsEvent = {
  isSidebarOpen: boolean;
};

export const showCards = (
  table: PokerTable,
  results: PokerTableResults,
  issues?: Issue[] | null,
  eventData?: ShowCardsEvent,
  firebase = defaultFirebase,
) => {
  if (!table.id) return;

  try {
    createVoting(table, results, issues || null, eventData);
  } catch (e) {
    console.error(e);
  }

  const update: Partial<PokerTable> = {
    cardsUp: true,
    cardsUpCountdown: 0,
    results,
  };

  const hasMoreThan1Player = results?.total && results?.total > 1;

  if (issues) {
    update.issues = issues;
  }

  if (issues && hasMoreThan1Player && !table.isPremium) {
    update.issuesVotedCount = table.issuesVotedCount
      ? table.issuesVotedCount + 1
      : 1;
  }

  return firebase
    .firestore()
    .collection(POKER_GAMES_COLLECTION)
    .doc(table.id)
    .update(getObjectWithoutUndefinedValues(update));
};

export const updatePokerTable = (
  tableId: string,
  table: Partial<PokerTable>,
  firebase = defaultFirebase,
) => {
  if (!tableId) return Promise.reject();

  return firebase
    .firestore()
    .collection(POKER_GAMES_COLLECTION)
    .doc(tableId)
    .update(getObjectWithoutUndefinedValues(table));
};

export const getPokerTableSummariesByIds = (
  gameIds: string[],
  firebase = defaultFirebase,
) => {
  if (!gameIds?.length) return Promise.resolve([]);

  if (gameIds.length >= 10) return Promise.reject(new Error('Maximum 10 ids'));

  return firebase
    .firestore()
    .collection(POKER_GAMES_COLLECTION)
    .where(firebase.firestore.FieldPath.documentId(), 'in', gameIds)
    .get()
    .then((snapshot) => {
      const games: PokerTableSummary[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        games.push({
          id: doc.id || '',
          name: data.name || '',
          createdAt: new Date((data.createdAt?.seconds || 0) * 1000),
        });
      });

      return games;
    });
};
