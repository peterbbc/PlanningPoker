import { Invite } from '../../../../packages/types-planning-poker';
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import { INVITES_COLLECTION } from '../constants';

export const fetchInvite = (inviteId: string) =>
  firebase
    .firestore()
    .collection(INVITES_COLLECTION)
    .doc(inviteId)
    .get()
    .then((doc) => doc.data() as Invite);
