import { User } from "../../../packages/types-planning-poker";
import { Action } from "redux";
import { AuthActionType } from "./constants";

interface UserSignedInAction extends Action {
    type: AuthActionType.USER_SIGNED_IN
    isAnonymous: boolean
    uid: string
    email: string
}

interface UserSignedOutAction extends Action {
    type: AuthActionType.USER_SIGNED_OUT
}

interface UserFetchedAction extends Action {
    type: AuthActionType.USER_FETCHED
    isPremium: boolean
    isFacilitator: boolean
    isTaxExempt: boolean
    user: User
}

interface UserUpdatedAction extends Action {
    type: AuthActionType.USER_UPDATED
}

interface UserUpdatedEmailAction extends Action {
    type: AuthActionType.USER_UPDATED_EMAIL
    email: string
}

export type AuthActions =
    UserSignedInAction |
    UserSignedOutAction |
    UserFetchedAction |
    UserUpdatedAction |
    UserUpdatedEmailAction


export interface AuthState {
    isIdle: boolean
    uid: string | null
    email: string | null
    isPremium: boolean | null
    isFacilitator: boolean | null
    isAnonymous: boolean | null
    isTaxExempt: boolean | null
    user: User | null
}