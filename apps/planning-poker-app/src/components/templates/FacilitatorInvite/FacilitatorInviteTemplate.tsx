import {
  Container,
  Paragraph,
  VerticalSpacing,
  FlexBox,
  Button,
  Header4,
  ButtonLink,
  Span,
  HoritzontalSpacing,
  InlineAlert,
} from '@we-agile-you/react-base';
import { Invite } from '@we-agile-you/types-planning-poker';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { acceptInvite } from '../../../spaces/premium/data/acceptInvite';
import { fetchInvite } from '../../../spaces/premium/data/fetchInvite';
import { Link } from '../../atoms/Link/Link';
import { RobotImage } from '../../atoms/RobotImage/RobotImage';
import { Loader } from '../../molecules/Loader/Loader';
import { Navigation } from '../../organisms/Navigation/Navigation';

interface FacilitatorInviteTemplateProps {
  inviteId: string;
}

export const FacilitatorInviteTemplate = ({
  inviteId,
}: FacilitatorInviteTemplateProps) => {
  const { uid, user, isAnonymous, isPremium, isFacilitator } = useCurrentUser();
  const [invite, setInvite] = useState<null | Invite>(null);
  const [error, setError] = useState<null | Error>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const appContext = useAppContext();

  const setIsOpenAuthType = appContext.authModal[1];

  useEffect(() => {
    if (!uid || typeof inviteId !== 'string') return;

    fetchInvite(inviteId)
      .then((invite) => {
        if (!invite) {
          setError(new Error('Invite not found'));

          return;
        }

        window.localStorage?.setItem('invite-email', invite.email);
        setInvite(invite);
      })
      .catch((e) => setError(e));
  }, [inviteId, uid]);

  const handleAcceptInvite = () => {
    setIsLoadingAccept(true);

    acceptInvite({ inviteId })
      .then(() => {
        setIsAccepted(true);
      })
      .catch(setError)
      .finally(() => setIsLoadingAccept(false));
  };

  const isLoading = !uid || !user || !invite;
  const title = 'Facilitator invite';

  const Content = () => {
    if (isLoading) {
      return (
        <FlexBox justifyContent="center">
          <Loader message="Loading..." />
        </FlexBox>
      );
    }

    if (isAccepted) {
      return (
        <>
          <FlexBox justifyContent="center">
            <RobotImage image="happy-robot" alt="Happy robot" />
          </FlexBox>
          <VerticalSpacing spacing="spacing-xl" />
          <InlineAlert
            style="success"
            title="Invitation accepted!"
            content="You are now a facilitator and you can start creating premium games!"
          />
          <VerticalSpacing spacing="spacing-xl" />
          <FlexBox justifyContent="center">
            <Link to="/" replace>
              <Button>Go to homepage</Button>
            </Link>
          </FlexBox>
        </>
      );
    }

    if (invite?.premiumUserId === uid) {
      return (
        <>
          <Header4 align="center">
            Invitation to become Facilitator from {invite?.creatorUserName}
          </Header4>
          <VerticalSpacing spacing="spacing-xl" />
          <InlineAlert
            title="This invitation was created by you"
            content="You can't accept your own invitation. Please log in with the user that you want to make facilitator."
          />
        </>
      );
    }

    if (isPremium) {
      return (
        <>
          <Header4 align="center">
            Invitation to become Facilitator from {invite?.creatorUserName}
          </Header4>
          <VerticalSpacing spacing="spacing-xl" />
          <InlineAlert
            title="You are already a premium user"
            content="Please log in with the user that you want to make facilitator."
          />
        </>
      );
    }

    if (isFacilitator) {
      return (
        <>
          <Header4 align="center">
            Invitation to become Facilitator from {invite?.creatorUserName}
          </Header4>
          <VerticalSpacing spacing="spacing-xl" />
          <InlineAlert
            title="You are already a facilitator"
            content="Please log in with the user that you want to make facilitator."
          />
        </>
      );
    }

    if (invite?.status === 'ACCEPTED') {
      return (
        <>
          <Header4 align="center">
            Invitation to become Facilitator from {invite?.creatorUserName}
          </Header4>
          <VerticalSpacing spacing="spacing-xl" />
          <InlineAlert
            title="This invitation is already accepted"
            content="Please ask the premium user to send you a new invite."
          />
        </>
      );
    }

    if (isAnonymous) {
      return (
        <div>
          <Header4 align="center">
            Invitation to become Facilitator from {invite?.creatorUserName}
          </Header4>
          <VerticalSpacing spacing="spacing-xl" />
          <div>
            <Paragraph align="center">
              Please sign up or log in to your account in order to accept the
              invitation.
            </Paragraph>
            <VerticalSpacing spacing="spacing-xl" />
            <FlexBox alignItems="center" justifyContent="center">
              <ButtonLink onClick={() => setIsOpenAuthType('sign-in')}>
                Log in
              </ButtonLink>
              <HoritzontalSpacing spacing="spacing-s" />
              <Span> or </Span>
              <HoritzontalSpacing spacing="spacing-s" />
              <ButtonLink onClick={() => setIsOpenAuthType('sign-up')}>
                Sign up
              </ButtonLink>
            </FlexBox>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Header4 align="center">
          Invitation to become Facilitator from {invite?.creatorUserName}
        </Header4>
        <VerticalSpacing spacing="spacing-xl" />
        <Paragraph align="center">
          {`Hello `}
          <b>{user?.displayName}</b>
          {'! The user '}
          <b>{invite?.creatorUserName}</b> has invited you to become a
          facilitator.
        </Paragraph>
        <VerticalSpacing spacing="spacing-m" />
        <Paragraph align="center">
          When you accept this invitation you will be able to create premium
          games and start enjoying Planning Poker Online without limits.
        </Paragraph>
        <VerticalSpacing spacing="spacing-m" />
        {error && <InlineAlert style="danger" content={error.message} />}
        <VerticalSpacing spacing="spacing-xl" />
        <Paragraph align="center">
          <Button isLoading={isLoadingAccept} onClick={handleAcceptInvite}>
            Accept invitation
          </Button>
        </Paragraph>
      </div>
    );
  };

  return (
    <>
      <Navigation title={title} />

      <Container isCenteredInPage size="small">
        <Content />
      </Container>
    </>
  );
};
