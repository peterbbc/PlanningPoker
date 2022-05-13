import React from 'react';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { createStore } from '../../state/createStore';
import { AuthSubscriber } from '@we-agile-you/planning-poker-app/src';

// eslint-disable-next-line react/display-name,react/prop-types
// @ts-ignore
export default ({ element }) => {
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
