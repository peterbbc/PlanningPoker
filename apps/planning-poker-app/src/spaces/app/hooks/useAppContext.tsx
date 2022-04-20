import { useContext } from "react";
import { AppContext } from "../AppWrapper";

export const useAppContext = () => {
  return useContext(AppContext);
}