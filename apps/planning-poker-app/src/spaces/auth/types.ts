import { User } from "@we-agile-you/types-planning-poker";
import { Action } from "redux";

export interface AuthActionTypes extends Action {

}

export interface Auth {
    isIdle: boolean
    uid: string | null
    email: string | null
    isPremium: boolean | null
    isFacilitator: boolean | null
    isAnonymous: boolean | null
    isTaxExempt: boolean | null
    user: User | null
}