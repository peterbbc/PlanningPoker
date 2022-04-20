import { Invite } from '@we-agile-you/types-planning-poker';
import firebase from 'firebase/compat/app';
import { INVITES_COLLECTION } from '../constants';
export const subscribeToUseInvites = (
  premiumUserId: string,
  onInvitesChanged: (invites: Invite[]) => void,
) => {
  return firebase
    .firestore()
    .collection(INVITES_COLLECTION)
    .where('premiumUserId', '==', premiumUserId)
    .where('status', '==', 'PENDING')
    .onSnapshot(function (querySnapshot) {
      const invites: Invite[] = [];

      querySnapshot.forEach(function (doc) {
        invites.push({
          ...(doc.data() as Invite),
          id: doc.id,
        });
      });

      onInvitesChanged(invites);
    });
};
