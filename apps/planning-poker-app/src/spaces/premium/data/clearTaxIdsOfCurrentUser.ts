import firebaseDefault from 'firebase/compat/app';

export const clearTaxIdsOfCurrentUser = (firebase = firebaseDefault) => {
  const user = firebase.auth().currentUser;

  if (!user) return Promise.reject('No user');

  return firebase
    .functions()
    .httpsCallable('stripeClearTaxIds')()
    .then((result) => {
      return result?.data;
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      throw error;
    });
};
