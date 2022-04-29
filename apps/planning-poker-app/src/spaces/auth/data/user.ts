import {
  CustomDeck,
  PokerTableSummary,
  User,
  UserMetadata,
  UserServer,
  UserServerForUpdate,
} from '@we-agile-you/types-planning-poker';
import defaultFirebase from 'firebase/compat/app';
import { POKER_GAMES_COLLECTION } from '../../poker-table/data/poker';

const USER_COLLECTION = 'users';

/**
 *  Updates the currently signed in user profile attributes
 * @param user new user attierbutes to update
 * @param firebase set another firebase project namespace
 */
export const updateCurrentUser = (
  user: Partial<UserServerForUpdate>,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser) {
    return Promise.reject();
  }

  return firebase
    .firestore()
    .collection(USER_COLLECTION)
    .doc(signedInUser.uid)
    .set(user, { merge: true });
};
/**
 *  Updates a user profile attributes
 * @param uid of the user to update
 * @param user new user attierbutes to update
 * @param firebase set another firebase project namespace
 */
export const updateUser = (
  uid: string,
  user: Partial<UserServerForUpdate>,
  firebase = defaultFirebase,
) => {
  return firebase
    .firestore()
    .collection(USER_COLLECTION)
    .doc(uid)
    .set(user, { merge: true });
};

export const updateCurrentUserGameHistory = (
  user: User,
  pokerTable: PokerTableSummary,
  firebase = defaultFirebase,
) => {
  if (!pokerTable.id) {
    return Promise.reject();
  }

  const gameHistory = user?.gameHistory
    ? user.gameHistory.filter((game) => pokerTable.id !== game.id)
    : [];

  return updateCurrentUser(
    {
      gameHistory: [
        {
          ...pokerTable,
          name: pokerTable.name || '',
        },
        ...gameHistory,
      ],
    },
    firebase,
  );
};
/**
 *  Called after completely signup
 * @param user new user attierbutes to update
 * @param firebase set another firebase project namespace
 */
export const updateCurrentUserWhenRegistered = (
  user: Partial<UserServer>,
  firebase = defaultFirebase,
) =>
  updateCurrentUser({
    ...user,
    registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

export const updateHasDoneRoomTour = (
  currentMetadata: UserMetadata,
  hasDoneRoomTour: boolean,
) => {
  const metadata = Object.assign({}, currentMetadata, {
    hasDoneRoomTour,
  });

  updateCurrentUser({
    metadata,
  });
};

export const getUser = (uid: string, firebase = defaultFirebase) =>
  firebase
    .firestore()
    .collection(USER_COLLECTION)
    .doc(uid)
    .get()
    .then((doc) => doc.data())
    .then(
      (user) =>
        user &&
        ({
          ...user,
          registeredAt: user.registeredAt?.toDate(),
          subscriptionStartDate: user.subscriptionStartDate?.toDate(),
          subscriptionCurrentPeriodEnd:
            user.subscriptionCurrentPeriodEnd?.toDate(),
          uid: uid,
        } as User),
    );
export const subscribeToUser = (
  uid: string,
  onUserChanged: (
    user: User,
    isPremium: boolean,
    isFacilitator: boolean,
    isTaxExempt: boolean,
  ) => void,
  firebase = defaultFirebase,
) =>
  firebase
    .firestore()
    .collection(USER_COLLECTION)
    .doc(uid)
    .onSnapshot((docRef: firebase.default.firestore.DocumentSnapshot) => {
      const data = docRef.data();
      const user: UserServer = data ? data : {};

      let isPremium = false;
      let isFacilitator = false;
      const isTaxExempt =
        !user.customerTaxExempt ||
        user.customerTaxExempt === 'exempt' ||
        user.customerTaxExempt === 'reverse';

      if (user.subscriptionCurrentPeriodEnd) {
        const nowMilis = Date.now();
        const subscriptionEndMilis =
          user.subscriptionCurrentPeriodEnd.toMillis();

        if (nowMilis < subscriptionEndMilis) {
          if (user.isFacilitator || !user.facilitators) {
            // TODO: test this codnition
            isFacilitator = true;
          }

          if (user.subscriptionId) {
            isPremium = true;
          }
        }
      }

      onUserChanged(
        {
          ...user,
          registeredAt: user.registeredAt?.toDate(),
          subscriptionStartDate: user.subscriptionStartDate?.toDate(),
          subscriptionCurrentPeriodEnd:
            user.subscriptionCurrentPeriodEnd?.toDate(),
          uid,
        },
        isPremium,
        isFacilitator,
        isTaxExempt,
      );
    });

export const getCurrentUserGamesCreated = (firebase = defaultFirebase) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser) {
    return Promise.reject();
  }

  return firebase
    .firestore()
    .collection(POKER_GAMES_COLLECTION)
    .where('ownerId', '==', signedInUser.uid)
    .orderBy('createdAt', 'desc')
    .get()
    .then((querySnapshot) => {
      const games: PokerTableSummary[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        games.push({
          id: doc.id || '',
          name: data.name || '',
          createdAt: new Date((data.createdAt?.seconds || 0) * 1000),
        });
      });

      return games;
    });
};

/**
 *  Adds 1 voting to the user's voting count
 * @param firebase set another firebase project namespace
 */
export const updatecurrentUserVotingCount = (firebase = defaultFirebase) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser) {
    return Promise.reject();
  }

  return firebase
    .firestore()
    .collection(USER_COLLECTION)
    .doc(signedInUser.uid)
    .set(
      {
        votingCount: firebase.firestore.FieldValue.increment(1),
      },
      { merge: true },
    );
};

export const updateCurrentUserFirstPageView = (
  userKey: keyof User,
  firebase = defaultFirebase,
) =>
  updateCurrentUser({
    [userKey]: firebase.firestore.FieldValue.serverTimestamp(),
  });

export const addCustomDeckToUser = async (
  user: User,
  deck: CustomDeck,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser) {
    throw new Error('No user signed in');
  }

  if (user.customDecks && user.customDecks.length >= 9) {
    throw new Error("Sorry, you can't create more than 9 custom decks");
  }

  return firebase
    .firestore()
    .collection(USER_COLLECTION)
    .doc(signedInUser.uid)
    .set(
      {
        customDecks: user.customDecks ? [...user.customDecks, deck] : [deck],
      },
      { merge: true },
    );
};

export const removeDeckFromUser = async (
  user: User,
  deckIndex: number,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser) {
    throw new Error('No user signed in');
  }

  if (
    !user.customDecks ||
    !user.customDecks.length ||
    deckIndex < 0 ||
    deckIndex > user.customDecks.length - 1
  ) {
    throw new Error('Sorry, deck not found');
  }

  return firebase
    .firestore()
    .collection(USER_COLLECTION)
    .doc(signedInUser.uid)
    .set(
      {
        customDecks: [
          ...user.customDecks.slice(0, deckIndex),
          ...user.customDecks.slice(deckIndex + 1),
        ],
      },
      { merge: true },
    );
};

export const updateCurrentUserPicture = async (
  image: Blob | null,
  onComplete: () => void,
  onProgress?: (progress: number) => void,
  firebase = defaultFirebase,
) => {
  const signedInUser = firebase.auth().currentUser;

  if (!signedInUser?.uid) {
    throw new Error('No user signed in');
  }
  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = firebase.storage();

  // Create a storage reference from our storage service
  const storageRef = storage.ref();

  const profileImageRef = storageRef.child(
    `users/${signedInUser.uid}/profilePicture.jpg`,
  );

  if (image) {
    const uploadTask = profileImageRef.put(image);
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        throw error;
      },
      () => {
        // Handle successful uploads on complete
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then((profilePictureUrl) => updateCurrentUser({ profilePictureUrl }))
          .then(() => {
            onComplete();
          });
      },
    );
  } else {
    await profileImageRef.delete();
    await updateCurrentUser({ profilePictureUrl: null });
  }
};

export const markLastUpdatesAsRead = async (
  updatesIds: string[],
  firebase = defaultFirebase,
) => {
  await updateCurrentUser({
    readUpdates: firebase.firestore.FieldValue.arrayUnion(...updatesIds),
  });
};
