import firebaseDefault from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/functions";

export const updateCurrentUserSubscription = (
  params: {
    newBillingType?: 'yearly' | 'monthly';
    /** total number of facilitators including main subscription */
    newFacilitatorsQuanity?: number;
  },
  firebase = firebaseDefault,
) => {
  const user = firebase.auth().currentUser;

  if (!user || !user.email) return Promise.reject('No user email');

  return firebase
    .functions()
    .httpsCallable('stripeUpdateCurrentUserSubscription')(params)
    .then((result) => {
      const subscription = result?.data?.subscription;

      if (!subscription) {
        throw new Error('Subscription not received');
      }

      return subscription;
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      throw error;
    });
};
