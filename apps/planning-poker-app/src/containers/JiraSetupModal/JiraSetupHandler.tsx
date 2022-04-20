import { useLocation, useQuery } from '@we-agile-you/react-base';
import React, { useEffect, useState } from 'react';

import { JiraSetupModal, JiraRedirectState } from './JiraSetupModal';

interface JiraSetupHandlerProps {
  onSaved: () => void;
}
export const JiraSetupHandler = ({ onSaved }: JiraSetupHandlerProps) => {
  const query = useQuery();

  const isRedirectedFromJira = query.get('jira-callback') === 'true';
  const pathname = useLocation().pathname;
  const state = useLocation().state as JiraRedirectState;

  const [isJiraSetupModalOpen, setIsJiraSetupModalOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    if (isRedirectedFromJira && !!state.code) {
      setReason(localStorage.getItem('jira-requires-auth-reason'));
      localStorage.removeItem('jira-requires-auth-reason');
      setIsJiraSetupModalOpen(true);
    }
  }, [isRedirectedFromJira, pathname]);

  if (!isJiraSetupModalOpen || !reason) return null;

  return (
    <>
      <JiraSetupModal
        onSaved={() => {
          setIsJiraSetupModalOpen(false);
          onSaved();
        }}
        onClose={() => setIsJiraSetupModalOpen(false)}
        authCode={state.code || ''}
        reason={reason}
      />
    </>
  );
};
