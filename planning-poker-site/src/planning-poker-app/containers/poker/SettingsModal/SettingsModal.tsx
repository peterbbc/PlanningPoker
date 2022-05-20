import {
  HoritzontalSpacing,
  Modal,
  ModalTitle,
} from '../../../../packages/react-base';
import { CustomDeck } from '../../../../packages/types-planning-poker';
import React, { useRef, useState } from 'react';
import { Crown } from '../../../components/atoms/Crown/Crown';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';
import { CreateDeckForm } from '../../CreateDeckForm/CreateDeckForm';
import { ManageDecksForm } from '../../ManageDecksForm/ManageDecksForm';

import SettingsForm from '../SettingsForm/SettingsForm';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const table = useCurrentTable();
  const { uid } = useCurrentUser();
  const settingsFormRef = useRef<{
    setSelectedDeck: (deck: CustomDeck) => void;
  }>({
    setSelectedDeck: () => ({}),
  });
  const [step, setStep] = useState<'settings' | 'create-deck' | 'manage-decks'>(
    'settings',
  );

  const title = 'Game settings';

  const handleDeckCreated = (deck: CustomDeck) => {
    setStep('settings');
    settingsFormRef.current.setSelectedDeck(deck);
  };

  if (!uid) return null;

  return (
    <Modal
      width="big"
      onClose={onClose}
      showBackButton={step !== 'settings'}
      onClickBackButton={() => setStep('settings')}
    >
      {step === 'settings' && (
        <>
          <ModalTitle>
            {table.pokerTable?.isPremium && (
              <>
                <Crown type="game" />
                <HoritzontalSpacing spacing="spacing-s" />
              </>
            )}
            {title}
          </ModalTitle>
          <SettingsForm
            onUpdated={onClose}
            onSelectCustomDeck={() => setStep('create-deck')}
            onManageDecksClick={() => setStep('manage-decks')}
            ref={settingsFormRef}
          />
        </>
      )}
      {step === 'create-deck' && (
        <>
          <ModalTitle>Create custom deck</ModalTitle>
          <CreateDeckForm
            onCreated={handleDeckCreated}
            onCancel={() => setStep('settings')}
          />
        </>
      )}
      {step === 'manage-decks' && (
        <>
          <ModalTitle>Manage custom decks</ModalTitle>
          <ManageDecksForm />
        </>
      )}
    </Modal>
  );
};

export default SettingsModal;
