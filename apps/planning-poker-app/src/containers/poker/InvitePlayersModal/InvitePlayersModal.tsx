import { copyToClipboard, selectInputContents } from '@we-agile-you/js-base';
import { Button, FormInput, Modal, ModalTitle } from '@we-agile-you/react-base';
import React, { useEffect, useRef } from 'react';
import { useNotification } from '../../../spaces/notifications/useNotification';

import styles from './InvitePlayersModal.module.scss';

interface InvitePlayersModalProps {
  onClose: () => void;
}

const InvitePlayersModal: React.FC<InvitePlayersModalProps> = ({ onClose }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { showNotification } = useNotification();

  function handleCopyLinkClick() {
    const inputElement = inputRef.current;
    if (inputElement) {
      copyToClipboard(inputElement);

      showNotification({
        title: 'Invitation link copied to clipboard!',
        content: 'Share it to your teammates and start playing!',
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
      <ModalTitle>Invite players</ModalTitle>
      <FormInput
        label="Game's url"
        ref={inputRef}
        readOnly
        value={typeof window !== 'undefined' ? window.location.href : ''}
      />
      <div className={styles['submit-row']}>
        <Button isBlock onClick={handleCopyLinkClick}>
          Copy invitation link
        </Button>
      </div>
    </Modal>
  );
};

export default InvitePlayersModal;
