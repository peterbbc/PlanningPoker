import { Address } from "@stripe/stripe-js";
import { CountryKey } from "@we-agile-you/js-base";

export interface CustomerAddress extends Address {
    country: CountryKey
}