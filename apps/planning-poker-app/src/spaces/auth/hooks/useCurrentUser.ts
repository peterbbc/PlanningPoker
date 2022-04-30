import { useSelector } from 'react-redux';
import { AppState } from "../../rootReducer";
import { AuthState } from '../types';

const useCurrentUser = (): AuthState => {
  const authState = useSelector((state: AppState) => state.auth);

  return authState.user && authState.uid
    ? { ...authState, user: { ...authState.user, uid: authState.uid } }
    : authState;
};

export default useCurrentUser;
