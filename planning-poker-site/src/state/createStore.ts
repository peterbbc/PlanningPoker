import { combineReducers, createStore as reduxCreateStore } from 'redux';

import { pokerTableReducer } from '../planning-poker-app';
import { authReducer } from '../planning-poker-app';
import { jiraReducer } from '../planning-poker-app';

const rootReducer = combineReducers({
  pokerTable: pokerTableReducer,
  auth: authReducer,
  jira: jiraReducer,
});

type AppState = ReturnType<typeof rootReducer>;

export function createStore(preloadedState?: AppState) {
  const isReduxExtensionEnabled =
    process.env.GATSBY_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__;

  return isReduxExtensionEnabled
    ? reduxCreateStore(
        rootReducer,
        preloadedState,
        // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION__(),
      )
    : reduxCreateStore(rootReducer, preloadedState);
}

export function createStoreSSR(preloadedState?: AppState) {
  return reduxCreateStore(rootReducer, preloadedState);
}
