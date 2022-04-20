export const HOTJAR_IDENTIFY_KEYS = {
  REACHED_FREE_USERS_LIMIT: 'Has reached free users limit',
  CLICKED_IMPORT_FROM_JIRA: 'Has clicked on import from JIRA',
  PAYMENT_FAILED_ALERT: 'Payment failed alert opened',
  PROCEEDED_TO_PAYMENT: 'Has proceeded to payment',
  OPENED_PRICING_MODAL: 'Has opened pricing premium modal',
  OPENED_CREATE_PREMIUM_MODAL: 'Has opened create premium modal',
  OPENED_MANAGE_FACILITATORS_MODAL: 'Has opened manage facilitators modal',
  VIEWED_TIMER: 'Has viewed a timer',
  OPENED_CREATE_DECK_FORM: 'Has opened create deck form',
  OPENED_IMPORT_FROM_CSV: 'Has opened import from csv',
  OPENED_VOTING_HISTORY: 'Has opened voting history',
  OPENED_PROFILE_IMAGE_PICKER_CROPPER:
    'Has opened profile image picker cropper',
};

export const hotjarIdentify = (identifyKey: string, uid?: string | null) => {
  if (window.hj) {
    window.hj('identify', uid || null, {
      [identifyKey]: true,
    });
  } else {
    console.log('## Hotjar tracking: ', identifyKey, ' @ uid: ', uid);
  }
};
