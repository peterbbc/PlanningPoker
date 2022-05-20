import { ReactNode } from "react";

export interface NotificationType {
    uuid: string
    title: string
    content: ReactNode
    style: "success" | "error"
}