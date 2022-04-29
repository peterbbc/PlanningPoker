import { combineReducers, createStore as reduxCreateStore } from 'redux';

import { rootReducer, AppState } from '@we-agile-you/planning-poker-app';

export function createStore(preloadedState?: AppState) {
  const isReduxExtensionEnabled =
    process.env.GATSBY_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION__;

  const store = isReduxExtensionEnabled
    ? reduxCreateStore(
        rootReducer,
        preloadedState,
        window.__REDUX_DEVTOOLS_EXTENSION__(),
      )
    : reduxCreateStore(rootReducer, preloadedState);

  return store;
}

export function createStoreSSR(preloadedState?: AppState) {
  const store = reduxCreateStore(rootReducer, preloadedState);

  return store;
}
