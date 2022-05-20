import { InviteToUpdate, User } from '../../../../packages/types-planning-poker';
import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { INVITES_COLLECTION } from '../constants';
import { Timestamp } from "firebase/firestore";

export const createInvite = async (
  email: string,
  premiumUser: User,
  creatorUser: User,
  canManageFacilitators: boolean,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser) {
    throw new Error('No user signed in');
  }

  if (!premiumUser.uid) {
    throw new Error('No premiumUser id');
  }

  if (!creatorUser.uid) {
    throw new Error('No creatorUser id');
  }

  if (
    !premiumUser.subscriptionFacilitatorsQuantity ||
    premiumUser.subscriptionFacilitatorsQuantity <=
      (premiumUser.facilitators ? premiumUser.facilitators.length : 1)
  ) {
    throw new Error(
      'No seats left for more facilitators. Update your subscription or remove an existing one',
    );
  }

  const invite: InviteToUpdate = {
    email,
    premiumUserId: premiumUser.uid,
    premiumUserName: premiumUser.displayName,
    creatorUserId: creatorUser.uid,
    creatorUserName: creatorUser.displayName,
    canManageFacilitators,
    status: 'PENDING',
    createdAt: firebase.firestore.FieldValue.serverTimestamp() as Timestamp,
  };

  return firebase.firestore().collection(INVITES_COLLECTION).add(invite);
};
