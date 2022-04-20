import { useLocation } from '@we-agile-you/react-base';
import { useNotification } from './../../notifications/useNotification';

import { navigate } from 'gatsby';
import {
  signOut as signOutAction,
  updateEmail as updateEmailAction,
  updatePassword as updatePasswordAction,
} from '../data/auth';
import { USER_UPDATED_EMAIL } from '../constants';
import { useDispatch } from 'react-redux';

export const useAuthActions = () => {
  const { showNotification } = useNotification();
  const dispatch = useDispatch();
  const location = useLocation();

  const signOut = () => {
    const redirectTo = location?.pathname?.includes('facilitator-invite')
      ? location.pathname
      : '/';
    signOutAction().then(() => {
      navigate(redirectTo, { replace: true });
      showNotification({
        title: `You have successfuly signed out`,
        content: `Thanks for trusting us!`,
      });
    });
  };

  const updateEmail = (password: string, email: string) =>
    updateEmailAction(password, email)
      .then(() => {
        showNotification({
          title: `You have successfuly changed your email`,
          content: `New email: ${email}`,
        });

        dispatch({ type: USER_UPDATED_EMAIL, email });
      })
      .catch(function (error) {
        showNotification({
          title: `There was an error udpating your email`,
          content: error.message,
          style: 'error',
        });
      });

  const updatePassword = (password: string, newPassword: string) =>
    updatePasswordAction(password, newPassword)
      .then(() => {
        showNotification({
          title: `You have successfuly changed your password`,
        });
      })
      .catch(function (error) {
        showNotification({
          title: `There was an error updating your password`,
          content: error.message,
          style: 'error',
        });
      });

  return {
    signOut,
    updateEmail,
    updatePassword,
  };
};
