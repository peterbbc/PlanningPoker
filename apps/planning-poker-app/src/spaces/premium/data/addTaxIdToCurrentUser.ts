import firebaseDefault from 'firebase/compat/app';

export const addTaxIdToCurrentUser = (
  taxId: any,
  isEuCountry: boolean,
  firebase = firebaseDefault,
) => {
  const user = firebase.auth().currentUser;

  if (!user) return Promise.reject('No user');

  const params: any = { taxId };

  if (isEuCountry) {
    params.type = 'eu_vat';
  }

  return firebase
    .functions()
    .httpsCallable('stripeCreateTaxId')(params)
    .then((result) => {
      const taxId = result?.data?.taxId;

      if (!taxId) {
        throw new Error('taxId not received');
      }

      return taxId;
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      throw error;
    });
};
