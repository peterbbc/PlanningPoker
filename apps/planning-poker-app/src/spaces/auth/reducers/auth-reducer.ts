import { AuthState, AuthActions } from '../types';
import { AuthActionType } from '../constants';

export const initialAuthState: AuthState = {
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
  action: AuthActions,
): AuthState {
  switch (action.type) {
    case AuthActionType.USER_SIGNED_IN:
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

    case AuthActionType.USER_SIGNED_OUT:
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

    case AuthActionType.USER_FETCHED:
      return {
        ...state,
        isIdle: false,
        isPremium: action.isPremium,
        isFacilitator: action.isFacilitator,
        isTaxExempt: action.isTaxExempt,
        user: action.user,
      };

    case AuthActionType.USER_UPDATED_EMAIL:
      return {
        ...state,
        email: action.email,
      };

    default:
      return state;
  }
};
