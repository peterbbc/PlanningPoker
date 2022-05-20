import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { INVITES_COLLECTION } from '../constants';

export const deleteInvite = async (inviteId: string) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser) {
    throw new Error('No user signed in');
  }
  return firebase
    .firestore()
    .collection(INVITES_COLLECTION)
    .doc(inviteId)
    .delete();
};
