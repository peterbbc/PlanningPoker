import { Modal } from '@we-agile-you/react-base';
import React, { useEffect, useRef } from 'react';

import { AddBatchOfUrls } from './AddBatchOfUrls/AddBatchOfUrls';

interface ImportFromUrlsModalProps {
  onClose: () => void;
}

export const ImportFromUrlsModal = ({ onClose }: ImportFromUrlsModalProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <Modal onClose={onClose} titleTopBar="Add issues from urls" width="big">
      <AddBatchOfUrls
        textareaRef={textareaRef}
        onAdded={onClose}
        onCancel={onClose}
      />
    </Modal>
  );
};
