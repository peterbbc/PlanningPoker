import { Invite } from '@we-agile-you/types-planning-poker';
import firebase from 'firebase/compat/app';
import { INVITES_COLLECTION } from '../constants';

export const fetchInvite = (inviteId: string) =>
  firebase
    .firestore()
    .collection(INVITES_COLLECTION)
    .doc(inviteId)
    .get()
    .then((doc) => doc.data() as Invite);
