import { Invoice } from '../../../../packages/types-planning-poker';
import firebaseDefault from 'firebase/compat/app';

export type PreviewInvoiceData = {
  invoice: null | Invoice;
  nextBillingPeriodQuanity?: number;
  nextBillingPeriodInvoiceAmount?: number;
  isPayingNow?: boolean;
  hasChanges?: boolean;
};
export const previewInvoice = (
  params: {
    newBillingType?: 'monthly' | 'yearly';
    newFacilitatorsQuanity?: number;
  },
  firebase = firebaseDefault,
) => {
  const user = firebase.auth().currentUser;

  if (!user || !user.email) return Promise.reject('No user email');

  return firebase
    .functions()
    .httpsCallable('stripePreviewInvoice')(params)
    .then((result) => {
      const data = result?.data;

      if (!data) {
        throw new Error('data not received');
      }

      return data as PreviewInvoiceData;
    })
    .catch(function (error) {
      const code = error.code;
      const message = error.message;
      const details = error.details;

      console.error(code, message, details);

      throw error;
    });
};
