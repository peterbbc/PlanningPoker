import { Modal, ModalTitle } from '@we-agile-you/react-base';
import { CustomDeck } from '@we-agile-you/types-planning-poker';
import React from 'react';

import { CreateDeckForm } from '../CreateDeckForm/CreateDeckForm';

interface ImportFromFileModalProps {
  onClose: () => void;
  onCreated: (deck: CustomDeck) => void;
}
export const CreateDeckModal = ({
  onClose,
  onCreated,
}: ImportFromFileModalProps) => {
  return (
    <Modal onClose={onClose} width="big">
      <ModalTitle>Create custom deck</ModalTitle>
      <CreateDeckForm onCancel={onClose} onCreated={onCreated} />
    </Modal>
  );
};
