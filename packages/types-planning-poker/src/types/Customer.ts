import { CustomerAddress } from "./CustomerAddress";

export interface Customer {
    name: string
    email: string
    address: CustomerAddress | null
}