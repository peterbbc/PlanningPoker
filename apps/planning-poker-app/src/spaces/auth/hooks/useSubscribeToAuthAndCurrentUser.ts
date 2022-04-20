import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { onAuthStateChanged } from '../data/auth';
import { subscribeToUser } from '../data/user';
import { USER_FETCHED, USER_SIGNED_IN, USER_SIGNED_OUT } from '../constants';

export const useSubscribeToAuthAndCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribeAuth: (() => void) | null = null;
    let unsubscribeUser: (() => void) | null = null;

    unsubscribeAuth = onAuthStateChanged((user) => {
      if (user) {
        // User signed in

        dispatch({
          type: USER_SIGNED_IN,
          uid: user.uid,
          email: user.email,
          isAnonymous: user.isAnonymous,
        });

        unsubscribeUser = subscribeToUser(
          user.uid,
          (user, isPremium, isFacilitator, isTaxExempt) => {
            dispatch({
              type: USER_FETCHED,
              user,
              isPremium,
              isFacilitator,
              isTaxExempt,
            });
          },
        );
      } else {
        // User signed out

        if (unsubscribeUser) {
          unsubscribeUser();

          unsubscribeUser = null;
        }

        dispatch({
          type: USER_SIGNED_OUT,
        });
      }
    });

    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }

      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, [dispatch]);
};
