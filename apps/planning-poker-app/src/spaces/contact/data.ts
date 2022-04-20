import defaultFirebase from 'firebase/compat/app';

interface Message {
  name?: string;
  email?: string;
  message: string;
}

const CONTACTS_COLLECTION = 'contacts';
/**
 * createContactMessage
 * @param message message to send
 * @param firebase set another firebase project namespace
 */
export const createContactMessage = (
  message: Message,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  return firebase
    .firestore()
    .collection(CONTACTS_COLLECTION)
    .add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      ownerId: signedInUser && signedInUser.uid,
      ...message,
    });
};
