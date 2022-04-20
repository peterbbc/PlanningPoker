import firebaseDefault from 'firebase/compat/app';

export const createCustomer = async (firebase = firebaseDefault) => {
  const user = firebase.auth().currentUser;

  if (!user || !user.email) {
    const error = new Error('No user email');
    error.name = 'NO-EMAIL';

    return error;
  }

  return firebase
    .functions()
    .httpsCallable('stripeCreateCustomer')({ email: user.email })
    .then((result) => {
      const customer = result?.data?.customer;

      if (!customer) {
        throw new Error('Customer not received');
      }

      return customer;
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      throw new Error(message);
    });
};
