import { Auth, AuthActionTypes } from '../types';
import {
  USER_FETCHED,
  USER_SIGNED_IN,
  USER_SIGNED_OUT,
  USER_UPDATED_EMAIL,
} from '../constants';

export const initialAuthState: Auth = {
  isIdle: true,
  uid: null,
  email: null,
  isPremium: null,
  isFacilitator: null,
  isAnonymous: null,
  isTaxExempt: null,
  user: null,
};

export const authReducer = function authReducer(
  state = initialAuthState,
  action: AuthActionTypes,
): Auth {
  switch (action.type) {
    case USER_SIGNED_IN:
      return {
        isIdle: false,
        isAnonymous: !!action.isAnonymous,
        uid: action.uid,
        email: action.email,
        isPremium: null,
        isFacilitator: null,
        isTaxExempt: null,
        user: null,
      };

    case USER_SIGNED_OUT:
      return {
        isIdle: false,
        uid: null,
        email: null,
        isPremium: null,
        isFacilitator: null,
        isAnonymous: null,
        isTaxExempt: null,
        user: null,
      };

    case USER_FETCHED:
      return {
        ...state,
        isIdle: false,
        isPremium: action.isPremium,
        isFacilitator: action.isFacilitator,
        isTaxExempt: action.isTaxExempt,
        user: action.user,
      };

    case USER_UPDATED_EMAIL:
      return {
        ...state,
        email: action.email,
      };

    default:
      return state;
  }
};
