import { useAppContext } from "../app/hooks/useAppContext";

export const useNotification = () => {
  return useAppContext().notifications;
}