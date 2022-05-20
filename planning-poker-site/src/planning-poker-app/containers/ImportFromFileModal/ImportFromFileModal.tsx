import {
  FilePicker,
  FormCheckbox,
  Modal,
  ModalTitle,
  VerticalSpacing,
} from '../../../packages/react-base';
import React, { useCallback, useEffect, useState } from 'react';

import Papa from 'papaparse';

import { useNotification } from '../../spaces/notifications/useNotification';
import {
  FileRows,
  ImportMapper,
} from '../../components/organisms/ImportMapper/ImportMapper';
import { useIssueActions } from '../../spaces/poker-table/hooks/useIssueActions';
import { Issue } from '../../../packages/types-planning-poker';
import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from '../../vendors/hotjar/identify';

interface ImportFromFileModalProps {
  onClose: () => void;
}
export const ImportFromFileModal = ({ onClose }: ImportFromFileModalProps) => {
  const [isUseFirstRowAsHeaders, setIsUseFirstRowAsHeaders] = useState(true);
  const [step, setStep] = useState<'file' | 'mapper'>('file');
  const [fileRows, setFileRows] = useState<FileRows | null>(null);

  const { showNotification } = useNotification();

  const { addIssues } = useIssueActions();

  useEffect(() => {
    hotjarIdentify(HOTJAR_IDENTIFY_KEYS.OPENED_IMPORT_FROM_CSV);
  }, []);

  const handleDrop = useCallback(
    (files: File[]) => {
      const file = files && files[0];

      if (file) {
        Papa.parse(file, {
          complete: function (results) {
            if (results.data.length) {
              setFileRows(results.data as FileRows);
              setStep('mapper');
            } else {
              showNotification({
                title: 'An error happened',
                content: 'Your file seems to be empty',
                style: 'error',
              });
            }
          },
          error: function (error) {
            showNotification({
              title: 'An error happened parsing your file',
              content: error.message,
              style: 'error',
            });
          },
        });
      }
    },
    [showNotification],
  );

  const handleMapperSave = (issues: Partial<Issue>[]) => {
    addIssues(issues);
    onClose();
  };

  return (
    <Modal
      showBackButton={step !== 'file'}
      onClickBackButton={() => setStep('file')}
      onClose={onClose}
      width={step === 'file' ? 'big' : 'auto'}
    >
      <ModalTitle>Import from CSV file</ModalTitle>
      {step === 'file' && (
        <div>
          <FormCheckbox
            id="use-firt-row-as-headers"
            label="User first csv row as headers"
            isChecked={isUseFirstRowAsHeaders}
            onChange={setIsUseFirstRowAsHeaders}
          />
          <FilePicker onDrop={handleDrop} />
          <VerticalSpacing spacing="spacing-xl" />
        </div>
      )}
      {step === 'mapper' && fileRows && (
        <div style={{ width: '90vw' }}>
          <ImportMapper
            fileRows={fileRows}
            onSave={handleMapperSave}
            isUseFirstRowAsHeaders={isUseFirstRowAsHeaders}
            onCancel={() => setStep('file')}
          />
        </div>
      )}
    </Modal>
  );
};
