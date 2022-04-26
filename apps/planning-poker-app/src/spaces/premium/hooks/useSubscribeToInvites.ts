import { Invite } from '@we-agile-you/types-planning-poker';
import { useEffect, useState } from 'react';
import { subscribeToUseInvites } from '../data/subscribeToUserInvites';
export const useSubscribeToInvites = (premiumUserId?: string | null) => {
  const [invites, setInvites] = useState<Invite[] | null>(null);

  useEffect(() => {
    if (!premiumUserId) return;
    return subscribeToUseInvites(premiumUserId, (invites) =>
      setInvites(
        invites.map((invite) => ({
          ...invite,
          link:
            process.env.GATSBY_ENV !== 'production'
              ? `https://planning-poker-staging.web.app/facilitator-invite/${invite.id}`
              : `https://planningpokeronline.com/facilitator-invite/${invite.id}`,
        })),
      ),
    );
  }, [premiumUserId]);

  return invites;
};
