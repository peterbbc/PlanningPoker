import { Invite } from '@we-agile-you/types-planning-poker';
import firebase from 'firebase/compat/app';
import { INVITES_COLLECTION } from '../constants';

export const updateInvite = (inviteId: string, invite: Partial<Invite>) =>
  firebase
    .firestore()
    .collection(INVITES_COLLECTION)
    .doc(inviteId)
    .update(invite);
