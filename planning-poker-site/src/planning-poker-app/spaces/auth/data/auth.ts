import defaultFirebase from 'firebase/compat/app';
import "firebase/compat/auth";

/**
 * The user returned by auth
 * this is not the user used in our data layer, you need to get that from db
 */
interface SignedInUser {
  uid: string;
  email: string | null;
  isAnonymous: boolean;
}

/**
 * onAuthStateChanged
 * @param onAuthStateChanged cb called when user signed in or signed out
 * @param firebase set another firebase project namespace
 */
export const onAuthStateChanged = (
  onAuthStateChanged: (user: SignedInUser | null) => void,
  firebase = defaultFirebase,
) => {
  return firebase.auth().onAuthStateChanged((user) => {
    onAuthStateChanged(
      user
        ? {
            uid: user.uid,
            isAnonymous: user.isAnonymous,
            email: user.email,
          }
        : null,
    );
  });
};

/**
 * signInAnonympusly if there is no signed in user
 * @param firebase set another firebase project namespace
 */
export const signInAnonymously = (firebase = defaultFirebase) =>
  firebase.auth().signInAnonymously();

/**
 * linkEmailCredentialToCurrentUser
 * @param email
 * @param password
 * @param firebase set another firebase project namespace
 */
export const linkEmailCredentialToCurrentUser = async (
  email: string,
  password: string,
  firebase = defaultFirebase,
) => {
  const user = firebase.auth().currentUser;

  if (!user?.isAnonymous) {
    return;
  }

  const credential = firebase.auth.EmailAuthProvider.credential(
    email,
    password,
  );

  return user.linkWithCredential(credential);
};

/**
 * signInWithEmailAndPassword
 * @param email
 * @param password
 * @param firebase set another firebase project namespace
 */
export const signInWithEmailAndPassword = (
  email: string,
  password: string,
  firebase = defaultFirebase,
) => firebase.auth().signInWithEmailAndPassword(email, password);

/**
 * sendPasswordResetEmail
 * @param email
 * @param firebase set another firebase project namespace
 */
export const sendPasswordResetEmail = (
  email: string,
  firebase = defaultFirebase,
) =>
  firebase.auth().sendPasswordResetEmail(email, {
    url: 'https://planningpokeronline.com',
  });

/**
 * signOut
 * @param firebase set another firebase project namespace
 */
export const signOut = (firebase = defaultFirebase) =>
  firebase.auth().signOut();

/**
 * signOut
 * @param firebase set another firebase project namespace
 */
export const deleteAccount = (firebase = defaultFirebase) => {
  const user = firebase.auth().currentUser;

  if (!user) return Promise.reject();

  return user.delete();
};
/**
 * updateEmail
 * @param firebase set another firebase project namespace
 */
export const updateEmail = (
  password: string,
  newEmail: string,
  firebase = defaultFirebase,
) => {
  const user = firebase.auth().currentUser;

  if (!user || !user.email) return Promise.reject();

  return firebase
    .auth()
    .signInWithEmailAndPassword(user.email, password)
    .then(function (userCredential) {
      if (!userCredential || !userCredential.user) return Promise.reject();

      return userCredential.user.updateEmail(newEmail);
    });
};
/**
 * updatePassword
 * @param firebase set another firebase project namespace
 */
export const updatePassword = (
  password: string,
  newPassword: string,
  firebase = defaultFirebase,
) => {
  const user = firebase.auth().currentUser;

  if (!user || !user.email) return Promise.reject();

  return firebase
    .auth()
    .signInWithEmailAndPassword(user.email, password)
    .then(function (userCredential) {
      if (!userCredential || !userCredential.user) return Promise.reject();

      return userCredential.user.updatePassword(newPassword);
    });
};

/**
 * signOut
 * @param firebase set another firebase project namespace
 */
export const reauthenticateWithPassword = (
  password: string,
  firebase = defaultFirebase,
) => {
  const user = firebase.auth().currentUser;

  if (!user || !user.email) return Promise.reject();

  return signInWithEmailAndPassword(user.email, password);
};
