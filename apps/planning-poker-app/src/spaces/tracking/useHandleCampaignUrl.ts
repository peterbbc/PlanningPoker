import { updateCurrentUser } from '../auth/data/user';
import { useLocation } from '@we-agile-you/react-base';
import useCurrentUser from '../auth/hooks/useCurrentUser';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export const useHandleCampaignUrl = () => {
  const { user } = useCurrentUser();
  const query = useQuery();

  if (user && typeof user?.utm_source === 'undefined') {
    updateCurrentUser({
      utm_source: query.get('utm_source') || null,
      utm_medium: query.get('utm_medium') || null,
      utm_campaign: query.get('utm_campaign') || null,
      utm_content: query.get('utm_content') || null,
      utm_term: query.get('utm_term') || null,
    });
  }
};
