import { Address } from "@stripe/stripe-js";
import { CountryKey } from "../../js-base";

export interface CustomerAddress extends Partial<Address> {
    country?: CountryKey
}