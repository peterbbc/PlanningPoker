import firebaseDefault from 'firebase/compat/app';
import "firebase/compat/functions";

export const getCurrentUserInvoices = (firebase = firebaseDefault) =>
  firebase
    .functions()
    .httpsCallable('stripeGetCurrentUserInvoices')()
    .then((result) => {
      return result?.data?.data || null;
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      return Promise.reject({ error });
    });
