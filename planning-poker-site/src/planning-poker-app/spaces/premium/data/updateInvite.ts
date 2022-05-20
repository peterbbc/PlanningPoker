import { Invite } from '../../../../packages/types-planning-poker';
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
import { INVITES_COLLECTION } from '../constants';

export const updateInvite = (inviteId: string, invite: Partial<Invite>) =>
  firebase
    .firestore()
    .collection(INVITES_COLLECTION)
    .doc(inviteId)
    .update(invite);
