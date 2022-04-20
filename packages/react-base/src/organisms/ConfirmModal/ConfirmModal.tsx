import {
  Header4,
  Modal,
  Paragraph,
  SubmitRow,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React, { ReactNode } from 'react';

interface ConfirmModalProps {
  isDanger?: boolean;
  isLoading?: boolean;
  error?: ReactNode;
  title: ReactNode;
  content?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  actionsTopBar?: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ConfirmModal = ({
  isDanger,
  isLoading,
  error,
  title,
  content,
  confirmLabel,
  cancelLabel,
  onClose,
  onConfirm,
  onCancel,
  actionsTopBar,
}: ConfirmModalProps) => {
  return (
    <Modal width="medium" onClose={onClose} actionsTopBar={actionsTopBar}>
      <Header4>{title}</Header4>
      <VerticalSpacing spacing="spacing-xs" />
      {content && <Paragraph color="grey600">{content}</Paragraph>}
      {error && (
        <>
          <VerticalSpacing spacing="spacing-m" />
          <Paragraph>{error}</Paragraph>
        </>
      )}
      <VerticalSpacing spacing="spacing-l" />
      <SubmitRow
        isDanger={isDanger}
        isLoading={isLoading}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        onConfirm={onConfirm}
        onCancel={onCancel}
        align="strech"
      />
    </Modal>
  );
};
