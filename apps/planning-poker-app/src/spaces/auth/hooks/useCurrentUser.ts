import { useSelector } from 'react-redux';
import { AppState } from '../../../state/createStore';

import { Auth } from '../types';

const useCurrentUser = (): Auth => {
  const user = useSelector((state: AppState) => state.auth);

  return user.user && user.uid
    ? { ...user, user: { ...user.user, uid: user.uid } }
    : user;
};

export default useCurrentUser;
