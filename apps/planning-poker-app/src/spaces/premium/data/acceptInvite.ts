import firebaseDefault from 'firebase/compat/app';

interface AcceptInviteInfo {
  inviteId: string;
}

export const acceptInvite = (
  { inviteId }: AcceptInviteInfo,
  firebase = firebaseDefault,
) => {
  return firebase
    .functions()
    .httpsCallable('acceptInvite')({
      inviteId,
    })
    .then((result) => {
      return result?.data || null;
    });
};
