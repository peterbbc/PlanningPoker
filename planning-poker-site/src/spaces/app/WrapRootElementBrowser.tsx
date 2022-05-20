import React from 'react';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { initializeFirebase } from "../../state/firebase";
import { createStore } from '../../state/createStore';
import { AuthSubscriber } from "../../planning-poker-app";

// @ts-ignore
export default ({ element }) => {
  initializeFirebase();
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  const store = createStore();

  return (
    <>
      <Helmet titleTemplate="Planning poker online | %s" />

      <Provider store={store}>
        <AuthSubscriber />
        {element}
      </Provider>
    </>
  );
};
