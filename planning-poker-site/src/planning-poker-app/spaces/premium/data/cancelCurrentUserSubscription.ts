import firebaseDefault from 'firebase/compat/app';
import "firebase/compat/functions";

export const cancelCurrentUserSubscription = (
  cancelFeedback: any,
  firebase = firebaseDefault,
) =>
  firebase
    .functions()
    .httpsCallable('stripeCancelCurrentUserSubscription')({ cancelFeedback })
    .then((result) => {
      return result.data;
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      return Promise.reject({ error });
    });
