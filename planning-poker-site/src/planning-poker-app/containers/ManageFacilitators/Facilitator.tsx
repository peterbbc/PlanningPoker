import {
  Badge,
  ButtonDropdown,
  ButtonIcon,
  ButtonLink,
  ConfirmModal,
  Icon,
  Paragraph,
  ProfileImage,
  Span,
  VerticalSpacing,
  ContextMenu,
  ContextMenuElement,
} from '../../../packages/react-base';
import {
  Invite,
  User,
  UserServerForUpdate,
} from '../../../packages/types-planning-poker';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { subscribeToUser, updateUser } from '../../spaces/auth/data/user';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { deleteInvite } from '../../spaces/premium/data/deleteInvite';
import { updateInvite } from '../../spaces/premium/data/updateInvite';
import CopyInviteLinkModal from './CopyInviteLinkModal/CopyInviteLinkModal';

import styles from './ManageFacilitators.module.scss';

interface FacilitatorsProps {
  facilitatorUid?: string;
  invite?: Invite;
  onInviteClick?: () => void;
  showAddMyself?: boolean;
  premiumUser: User;
}

export const Facilitator = ({
  facilitatorUid,
  invite,
  onInviteClick,
  showAddMyself,
  premiumUser,
}: FacilitatorsProps) => {
  const { uid } = useCurrentUser();
  const [facilitator, setFacilitator] = useState<User | null>(null);
  const [isCopyLinkModalOpen, setIsCopyLinkModalOpen] = useState(false);
  const [isConfirmDeleteInviteModalOpen, setIsConfirmDeleteInviteModalOpen] =
    useState(false);
  const [
    isConfirmDeleteFacilitatorModalOpen,
    setIsConfirmDeleteFacilitatorModalOpen,
  ] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const isAdmin = premiumUser.facilitatorsAdmins?.find(
    (fac) => fac === facilitatorUid,
  );
  const isPremiumUser = premiumUser.uid === facilitatorUid;

  useEffect(() => {
    if (!facilitatorUid) return;

    return subscribeToUser(facilitatorUid, setFacilitator);
  }, [facilitatorUid]);

  const handleDeleteFacilitator = () => {
    if (!premiumUser || !premiumUser.uid) return;

    const update: Partial<UserServerForUpdate> = {
      facilitators: premiumUser.facilitators?.filter(
        (fac) => fac !== facilitatorUid,
      ),
    };

    if (premiumUser.facilitatorsAdmins) {
      update.facilitatorsAdmins = premiumUser.facilitatorsAdmins.filter(
        (fac) => fac !== facilitatorUid,
      );
    }

    updateUser(premiumUser.uid, update);
    setIsConfirmDeleteFacilitatorModalOpen(false);
  };

  const handleAddMyself = () => {
    if (!premiumUser || !premiumUser.uid || !uid) return;

    updateUser(premiumUser.uid, {
      facilitators: premiumUser.facilitators
        ? [...premiumUser.facilitators, uid]
        : [uid],
    });
  };

  const handleDeleteInvite = () => {
    if (!invite) return;

    deleteInvite(invite.id);
  };

  const handleGetLinkClick = () => {
    if (!invite) return;

    setIsCopyLinkModalOpen(true);
  };

  const handleSetAsManager = () => {
    if (!premiumUser || !premiumUser.uid || !uid) return;

    if (facilitatorUid) {
      updateUser(premiumUser.uid, {
        facilitatorsAdmins: premiumUser.facilitatorsAdmins
          ? [...premiumUser.facilitatorsAdmins, facilitatorUid]
          : [facilitatorUid],
      });
    }

    if (invite) {
      updateInvite(invite.id, {
        canManageFacilitators: true,
      });
    }
  };

  const handleUnsetAsManager = () => {
    if (!premiumUser || !premiumUser.uid || !uid) return;

    if (facilitatorUid && premiumUser.facilitatorsAdmins) {
      updateUser(premiumUser.uid, {
        facilitatorsAdmins: premiumUser.facilitatorsAdmins.filter(
          (admin) => admin !== facilitatorUid,
        ),
      });
    }

    if (invite) {
      updateInvite(invite.id, {
        canManageFacilitators: false,
      });
    }
  };

  if (facilitatorUid) {
    const contextMenuElements: ContextMenuElement[] = [
      {
        label: 'Delete',
        onClick: () => {
          setIsContextMenuOpen(false);
          setIsConfirmDeleteFacilitatorModalOpen(true);
        },
        icon: 'trash',
      },
    ];

    if (!isPremiumUser) {
      if (isAdmin) {
        contextMenuElements.push({
          label: 'Unset as manager',
          onClick: () => {
            setIsContextMenuOpen(false);
            handleUnsetAsManager();
          },
          icon: 'downgrade',
        });
      } else {
        contextMenuElements.push({
          label: 'Set as manager',
          onClick: () => {
            setIsContextMenuOpen(false);
            handleSetAsManager();
          },
          icon: 'manage-facilitators',
        });
      }
    }
    return (
      <div className={styles.facilitator}>
        <div className={styles.facilitator__img}>
          <ProfileImage
            src={facilitator?.profilePictureUrl}
            alt={facilitator?.displayName}
            size="l"
          />
        </div>
        <div className={styles.facilitator__info}>
          <Paragraph fontWeight="bold">
            {facilitator?.displayName}{' '}
            {uid === facilitatorUid && <Span color="grey500">(You)</Span>}
          </Paragraph>
          {isAdmin && (
            <Paragraph size="micro" color="grey600">
              Facilitators manager
            </Paragraph>
          )}
          {isPremiumUser && (
            <Paragraph size="micro" color="grey600">
              License admin
            </Paragraph>
          )}
        </div>
        <div className={styles.facilitator__status}>
          <Badge style="success">Active</Badge>
        </div>
        <div className={styles.facilitator__actions}>
          <ButtonDropdown
            isOpen={isContextMenuOpen}
            isIconButton
            onIsOpenChange={setIsContextMenuOpen}
            color="secondary"
            align="bottom-left"
            buttonTooltip="Actions"
            size="s"
            dropdown={<ContextMenu elements={contextMenuElements} />}
          >
            <Icon icon="ellipsis-h" />
          </ButtonDropdown>
        </div>
        {isConfirmDeleteFacilitatorModalOpen &&
          ReactDOM.createPortal(
            <ConfirmModal
              title={
                uid === facilitatorUid
                  ? 'Are you sure that you want to delete yourself as a facilitator?'
                  : 'Are you sure that you want to delete this facilitator?'
              }
              content={
                <>
                  <VerticalSpacing spacing="spacing-m" />
                  <Paragraph>
                    If you proceed,{' '}
                    {uid === facilitatorUid
                      ? 'you'
                      : <b>{facilitator?.displayName}</b> || 'This Facilitator'}
                    {` won't be able to create more premium games and all `}
                    {uid === facilitatorUid ? 'your' : 'his/her'} current
                    created games will no longer be unlimited.
                  </Paragraph>
                  <VerticalSpacing spacing="spacing-xl" />
                  {uid === facilitatorUid ? (
                    <Paragraph color="grey500">
                      You will be able to set yourself back as a facilitaror any
                      time and all your games will be unlimited again.
                    </Paragraph>
                  ) : (
                    <Paragraph color="grey500">
                      You will be able to invite him back as a facilitaror any
                      time and all his/her games will be unlimited again.
                    </Paragraph>
                  )}
                </>
              }
              isDanger
              cancelLabel="Cancel"
              confirmLabel="Delete"
              onConfirm={handleDeleteFacilitator}
              onCancel={() => setIsConfirmDeleteFacilitatorModalOpen(false)}
              onClose={() => setIsConfirmDeleteFacilitatorModalOpen(false)}
            />,
            document.body,
          )}
      </div>
    );
  }

  if (invite) {
    return (
      <div className={styles.facilitator}>
        <div className={styles.facilitator__pick}>
          <div className={styles.facilitator__emptyProfilePick} />
        </div>
        <div className={styles.facilitator__email}>
          <Paragraph>{invite.email}</Paragraph>
          {invite.canManageFacilitators && (
            <Paragraph size="micro" color="grey600">
              Facilitators manager
            </Paragraph>
          )}
        </div>
        <div className={styles.facilitator__status}>
          <Badge style="warning">Pending</Badge>
        </div>
        <div className={styles.facilitator__actions}>
          <ButtonIcon
            icon={<Icon icon="link" />}
            onClick={handleGetLinkClick}
            tooltip="Invitation link"
          />
          <ButtonDropdown
            isOpen={isContextMenuOpen}
            isIconButton
            onIsOpenChange={setIsContextMenuOpen}
            color="secondary"
            size="s"
            align="bottom-left"
            buttonTooltip="Actions"
            dropdown={
              <ContextMenu
                elements={[
                  {
                    label: 'Delete',
                    onClick: () => {
                      setIsContextMenuOpen(false);
                      setIsConfirmDeleteInviteModalOpen(true);
                    },
                    icon: 'trash',
                  },
                  invite.canManageFacilitators
                    ? {
                        label: 'Unset as manager',
                        onClick: () => {
                          setIsContextMenuOpen(false);
                          handleUnsetAsManager();
                        },
                        icon: 'downgrade',
                      }
                    : {
                        label: 'Set as manager',
                        onClick: () => {
                          setIsContextMenuOpen(false);
                          handleSetAsManager();
                        },
                        icon: 'manage-facilitators',
                      },
                ]}
              />
            }
          >
            <Icon icon="ellipsis-h" />
          </ButtonDropdown>
        </div>
        {isConfirmDeleteInviteModalOpen &&
          ReactDOM.createPortal(
            <ConfirmModal
              title="Are you sure that you want to delete this invitation?"
              content={`Invitation email: ${invite.email}`}
              isDanger
              cancelLabel="Cancel"
              confirmLabel="Delete"
              onConfirm={handleDeleteInvite}
              onCancel={() => setIsConfirmDeleteInviteModalOpen(false)}
              onClose={() => setIsConfirmDeleteInviteModalOpen(false)}
            />,
            document.body,
          )}
        {isCopyLinkModalOpen &&
          ReactDOM.createPortal(
            <CopyInviteLinkModal
              link={invite.link}
              onClose={() => setIsCopyLinkModalOpen(false)}
            />,
            document.body,
          )}
      </div>
    );
  }

  return (
    <div className={styles.facilitator}>
      <div className={styles.facilitator__info}>
        <div className={styles.facilitator__emptyProfilePick} />
      </div>
      <div className={styles.facilitator__info}>
        <Paragraph>Empty seat</Paragraph>
      </div>
      <div className={styles.facilitator__status}>
        <ButtonLink onClick={onInviteClick}>Send invite</ButtonLink>
      </div>
      <div className={styles.facilitator__actions}>
        {showAddMyself && (
          <ButtonLink onClick={handleAddMyself}>Add myself</ButtonLink>
        )}
      </div>
    </div>
  );
};
