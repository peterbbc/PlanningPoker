import {
  Header4,
  Paragraph,
  Span,
  VerticalSpacing,
  InlineAlert,
  ButtonLink,
} from '@we-agile-you/react-base';
import { User } from '@we-agile-you/types-planning-poker';
import React from 'react';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { useNotification } from '../../spaces/notifications/useNotification';
import { useSubscribeToInvites } from '../../spaces/premium/hooks/useSubscribeToInvites';
import { Facilitator } from './Facilitator';

import styles from './ManageFacilitators.module.scss';

interface ManageFacilitatorsProps {
  onInvite: (premiumUser: User) => void;
  onUpdatePlanClick: () => void;
  sheduledQuantity?: number;
  premiumUser: User;
}

export const ManageFacilitators = ({
  onInvite,
  onUpdatePlanClick,
  sheduledQuantity,
  premiumUser,
}: ManageFacilitatorsProps) => {
  const { user, uid } = useCurrentUser();
  const { showNotification } = useNotification();
  const invites = useSubscribeToInvites(premiumUser?.uid);

  const premiumUserFacilitators = premiumUser.facilitators;
  const premiumUserUid = premiumUser.uid;

  if (!user || !uid || !premiumUserFacilitators) return null;

  const subscriptionFacilitatorsQuantity =
    premiumUser?.subscriptionFacilitatorsQuantity || 1;
  const emptySeats = Math.max(
    subscriptionFacilitatorsQuantity -
      premiumUserFacilitators.length -
      (invites?.length || 0),
    0,
  );

  const handleInviteClick = () => {
    if (emptySeats < 1) {
      showNotification({
        title: "You don't have any seat left",
        content:
          'Update your subscription to be able to invite more facilitators',
        style: 'error',
      });

      return;
    }
    onInvite(premiumUser);
  };

  const isCurrentUserFacilitator = !!premiumUserFacilitators?.find(
    (facilitatorUid) => facilitatorUid === uid,
  );

  return (
    <div className={styles['manage-facilitators']}>
      <Header4>Manage facilitators</Header4>
      <VerticalSpacing spacing="spacing-xl" />
      <Paragraph>
        You have a Premium Plan with{' '}
        <Span spanStyle="bold">
          {`${subscriptionFacilitatorsQuantity} facilitator${
            subscriptionFacilitatorsQuantity &&
            subscriptionFacilitatorsQuantity > 1
              ? 's'
              : ''
          }`}
        </Span>
        .
      </Paragraph>
      <VerticalSpacing spacing="spacing-xs" />
      {uid === premiumUserUid ? (
        <Paragraph>
          If you need to adjust facilitators quantity{' '}
          <ButtonLink onClick={onUpdatePlanClick}>
            Change your Plan here
          </ButtonLink>
        </Paragraph>
      ) : (
        <Paragraph>
          If you need to adjust facilitators quantity contact your license
          administrator.
        </Paragraph>
      )}

      {typeof sheduledQuantity === 'number' && (
        <>
          <VerticalSpacing spacing="spacing-m" />
          <InlineAlert
            style="info"
            title="You have sheduled a reduce of faciltiators"
            content={`Next billing period you will pay only for ${sheduledQuantity} faciltiator${
              sheduledQuantity > 1 ? 's' : ''
            }`}
          />
        </>
      )}
      <VerticalSpacing spacing="spacing-xxl" />
      <div className={styles['facilitator']}>
        <div></div>
        <div>
          <Paragraph color="grey500">Name</Paragraph>
        </div>
        <div>
          <Paragraph color="grey500">Status</Paragraph>
        </div>
        <div></div>
      </div>
      <ul className={styles['facilitators']}>
        {premiumUserFacilitators?.map((facilitatorID) => (
          <li key={facilitatorID}>
            <Facilitator
              premiumUser={premiumUser}
              key={facilitatorID}
              facilitatorUid={facilitatorID}
            />
          </li>
        ))}
        {!!invites?.length &&
          invites.map((invite, i) => (
            <Facilitator premiumUser={premiumUser} key={i} invite={invite} />
          ))}

        {!!emptySeats &&
          Array(emptySeats)
            .fill('')
            .map((_v, i) => (
              <li key={`${i}-empty`}>
                <Facilitator
                  premiumUser={premiumUser}
                  onInviteClick={handleInviteClick}
                  showAddMyself={!isCurrentUserFacilitator && i === 0}
                />
              </li>
            ))}
      </ul>
      <VerticalSpacing spacing="spacing-xxl" />
    </div>
  );
};
