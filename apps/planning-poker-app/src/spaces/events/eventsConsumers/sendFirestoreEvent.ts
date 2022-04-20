import defaultFirebase from 'firebase/compat/app';

import { WAYEvent } from '../events';

const EVENTS_COLLECTION = 'events';

export type EventDB = {
  id: string;
  uid: string;
  timestamp: defaultFirebase.firestore.FieldValue;
};
export const sendFirestoreEvent = (
  event: WAYEvent,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser) {
    return Promise.reject();
  }

  const eventDB: EventDB = {
    uid: signedInUser.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    ...event,
  };

  return firebase.firestore().collection(EVENTS_COLLECTION).add(eventDB);
};
