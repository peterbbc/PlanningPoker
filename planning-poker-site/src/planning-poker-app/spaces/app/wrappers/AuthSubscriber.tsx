import { useEffect } from 'react';
import { signInAnonymously } from '../../auth/data/auth';
import useCurrentUser from '../../auth/hooks/useCurrentUser';
import { useSubscribeToAuthAndCurrentUser } from '../../auth/hooks/useSubscribeToAuthAndCurrentUser';

export const AuthSubscriber = () => {
  const { uid, isIdle } = useCurrentUser();

  useSubscribeToAuthAndCurrentUser();

  useEffect(() => {
    if (!isIdle && !uid) {
      signInAnonymously();
    }
  }, [uid, isIdle]);

  return null;
};
