import defaultFirebase from 'firebase/compat/app';

import { Player } from '@we-agile-you/types-planning-poker';
import { PLAYERS_COLLECTION } from './poker';
import firebase from "firebase/compat/app";

export const buldPresenceInPokerGame = (
  uid: string,
  tableId: string,
  firebase = defaultFirebase,
) => {
  const playerId = `${uid}_${tableId}`;
  const playerDatabaseRef = firebase
    .database()
    .ref(`/${PLAYERS_COLLECTION}/${playerId}`);
  const playerFirestoreRef = firebase
    .firestore()
    .doc(`/${PLAYERS_COLLECTION}/${playerId}`);
  const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };
  const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };
  const isOfflineForFirestore = {
    state: 'offline',
    last_changed: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const isOnlineForFirestore = {
    state: 'online',
    last_changed: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const onConnexionSatusChange = (
    snapshot: firebase.database.DataSnapshot,
  ) => {
    // eslint-disable-next-line eqeqeq
    if (snapshot.val() == false) {
      // we'll also set Firestore's state
      // to 'offline'. This ensures that our Firestore cache is aware
      // of the switch to 'offline.'
      playerFirestoreRef.set(isOfflineForFirestore, { merge: true });
      return;
    }

    playerDatabaseRef
      .onDisconnect()
      .set(isOfflineForDatabase)
      .then(function () {
        playerDatabaseRef.set(isOnlineForDatabase);

        // We'll also add Firestore set here for when we come online.
        playerFirestoreRef.set(isOnlineForFirestore, { merge: true });
      });
  };

  firebase
    .database()
    .ref('.info/connected')
    .on('value', onConnexionSatusChange);

  return function removePresenceInPokerGame() {
    firebase
      .database()
      .ref('.info/connected')
      .off('value', onConnexionSatusChange);

    playerDatabaseRef.set(isOfflineForDatabase);
  };
};

export const updatePlayerInfo = (
  player: Player,
  tableId: string,
  firebase = defaultFirebase,
) => {
  const playerId = `${player.uid}_${tableId}`;

  const playerFirestoreRef = firebase
    .firestore()
    .doc(`/${PLAYERS_COLLECTION}/${playerId}`);

  playerFirestoreRef.set(player, { merge: true });
};
