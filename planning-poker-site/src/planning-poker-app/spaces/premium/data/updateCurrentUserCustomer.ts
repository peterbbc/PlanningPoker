import firebaseDefault from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/functions";

export const updateCurrentUserCustomer = (
  customer: any,
  isParticular: boolean,
  firebase = firebaseDefault,
) => {
  const user = firebase.auth().currentUser;

  if (!user) return Promise.reject('No user');

  return firebase
    .functions()
    .httpsCallable('stripeUpdateCurrentUserCustomer')({
      customer,
      isParticular,
    })
    .then((result) => {
      const customer = result?.data?.customer;

      if (!customer) {
        throw new Error('customer not received');
      }

      return customer;
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      throw error;
    });
};
