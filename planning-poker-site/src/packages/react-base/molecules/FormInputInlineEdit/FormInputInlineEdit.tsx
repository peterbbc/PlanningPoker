import React, { useState, useEffect, useRef, FormEvent } from 'react';
// import { useNotification } from '../../../../../apps/planning-poker-app/src/spaces/notifications/useNotification';
import { ButtonLink } from '../../atoms/ButtonLink/ButtonLink';
import { VerticalSpacing } from '../../atoms/spacings/VerticalSpacing/VerticalSpacing';
import { Span } from '../../atoms/text/Span/Span';
import { FormInput } from '../../components/FormInput/FormInput';
import { SubmitRow } from '../SubmitRow/SubmitRow';

import styles from './FormInputInlineEdit.module.scss';

type InputElement = {
  id: string;
  value?: string;
  label?: string;
  required?: boolean;
  maxLength?: number;
  type?: 'text' | 'password' | 'email';
};

interface FormInputInlineEditProps {
  label: string;
  value: string;
  inputs: InputElement[];
  onConfirm?: (values: string[]) => Promise<void>;
}

export const FormInputInlineEdit = ({
  label,
  value,
  inputs,
  onConfirm,
}: FormInputInlineEditProps) => {
  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<InputElement[] | null>(
    null,
  );

  // const { showNotification } = useNotification();

  const firstInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setCurrentInputs(inputs);
  }, [inputs]);

  const handleChangeClick = () => {
    setIsFocus(true);
  };
  useEffect(() => {
    if (isFocus && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isFocus]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (onConfirm && currentInputs) {
      onConfirm(currentInputs.map((input) => input.value || ''))
        .then(() => {
          setIsFocus(false);
        })
        .catch((error) => {
          if (error.message) {
            // showNotification({
            //   title: error.message,
            //   style: 'error',
            // });
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleCancel = () => {
    setCurrentInputs(inputs);
    setIsFocus(false);
  };

  const handleInputChange = (input: InputElement, value: string) => {
    if (!currentInputs) return;

    setCurrentInputs(
      currentInputs.map((_input) => {
        if (_input.id === input.id) {
          return { ..._input, value };
        } else {
          return _input;
        }
      }),
    );
  };

  return (
    <div className={styles['form-input-inline-edit']}>
      <div className={styles['label']}>
        <Span spanStyle="bold">{label}</Span>
      </div>
      <VerticalSpacing spacing="spacing-s" />
      <form
        style={{ display: isFocus ? 'block' : 'none' }}
        className={styles['form']}
        onSubmit={handleFormSubmit}
      >
        <div className={styles['inputs']}>
          {currentInputs &&
            currentInputs.map((input, i) => {
              return (
                <div className={styles['form-input']}>
                  <FormInput
                    key={input.id}
                    {...input}
                    ref={i === 0 ? firstInputRef : undefined}
                    onChange={(value) => handleInputChange(input, value)}
                  />
                </div>
              );
            })}
        </div>
        <SubmitRow
          cancelLabel="Cancel"
          confirmLabel="Confirm"
          onCancel={handleCancel}
          isLoading={isLoading}
          align="strech"
        />
      </form>
      <div
        style={{ display: isFocus ? 'none' : 'flex' }}
        className={styles['value-container']}
      >
        <Span>{value}</Span>
        <ButtonLink onClick={handleChangeClick}>Change</ButtonLink>
      </div>
    </div>
  );
};
