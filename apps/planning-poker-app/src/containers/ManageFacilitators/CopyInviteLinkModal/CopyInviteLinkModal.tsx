import { copyToClipboard, selectInputContents } from '@we-agile-you/js-base';
import {
  Button,
  FormInput,
  Modal,
  ModalTitle,
  Paragraph,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React, { useEffect, useRef } from 'react';
import { useNotification } from '../../../spaces/notifications/useNotification';

import styles from './CopyInviteLinkModal.module.scss';

interface CopyInviteLinkModalProps {
  onClose: () => void;
  link: string;
}

const CopyInviteLinkModal = ({ onClose, link }: CopyInviteLinkModalProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { showNotification } = useNotification();

  function handleCopyLinkClick() {
    const inputElement = inputRef.current;
    if (inputElement) {
      copyToClipboard(inputElement);

      showNotification({
        title: 'Invitation link copied to clipboard!',
        content:
          'Share it privately with the person you want to invite as facilitator.',
      });

      onClose();
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      selectInputContents(inputRef.current);
    }
  }, []);

  return (
    <Modal onClose={onClose}>
      <ModalTitle>Invite a facilitator</ModalTitle>
      <Paragraph>
        Sometimes the sent email goes to spam or the facilitator can&apos;t find
        it in his inbox.
      </Paragraph>
      <VerticalSpacing spacing="spacing-m" />
      <Paragraph>
        Use this link to share it directly to the person you want to invite
      </Paragraph>
      <VerticalSpacing spacing="spacing-xl" />
      <FormInput label="Invitation url" ref={inputRef} readOnly value={link} />
      <div className={styles['submit-row']}>
        <Button isBlock onClick={handleCopyLinkClick}>
          Copy invitation link
        </Button>
      </div>
    </Modal>
  );
};

export default CopyInviteLinkModal;
