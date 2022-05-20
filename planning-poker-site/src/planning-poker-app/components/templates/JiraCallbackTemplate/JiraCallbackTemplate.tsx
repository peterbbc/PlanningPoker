import { navigate, useLocation } from '@reach/router';
import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { sendEvent } from '../../../spaces/events/events';
import { Navigation } from '../../organisms/Navigation/Navigation';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const JiraCallbackTemplate = () => {
  const query = useQuery();
  const { uid } = useCurrentUser();
  const [uidFromSate, pokerTableId] = query.get('state')?.split('_') || [];
  const code = query.get('code');
  const isValidState = uid !== null && uid === uidFromSate;

  useEffect(() => {
    if (pokerTableId) {
      try {
        sendEvent({
          id: 'jira-callback-page-successfull-redirect',
          to: 'table',
        });
      } catch (e) {
        console.error(e);
      }

      navigate(`/${pokerTableId}?jira-callback=true`, {
        replace: true,
        state: { code },
      });
    }
  }, [code, isValidState, pokerTableId]);

  return (
    <>
      <Helmet title="" />
      <Navigation title="" />
    </>
  );
};
