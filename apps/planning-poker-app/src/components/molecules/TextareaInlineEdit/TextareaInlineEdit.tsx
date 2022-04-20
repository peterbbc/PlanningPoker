import {
  SubmitRow,
  useHandleClickOuside,
  usePrevious,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import cx from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import { FormatedTextContainer } from '../FormatedTextContainer/FormatedTextContainer';
import styles from './TextareaInlineEdit.module.scss';

const MIN_HEIGHT = 120;
const MIN_HEIGHT_ONE_LINE = 60;

interface TextareaInlineEditProps {
  value: string;
  isFocus?: boolean;
  mode:
    | 'key'
    | 'summary'
    | 'url'
    | 'description'
    | 'issue-card'
    | 'issue-card-no-permission';
  buttonLabel: React.ReactNode;
  textareaPlaceholder?: string;
  isCreating?: boolean;
  /**
   * onBlur is called when user finalizes editing the value,
   * use it to save changes
   */
  onBlur: (value: string) => void;
  onFocus?: () => void;
  onButtonClick?: () => void;
}
export const TextareaInlineEdit = ({
  value,
  mode,
  buttonLabel,
  textareaPlaceholder,
  isCreating,
  onBlur,
  onFocus,
  onButtonClick,
  ...props
}: TextareaInlineEditProps) => {
  const [isFocus, setIsFocus] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(5.6);
  const [currentValue, setCurrentValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const previousIsFocus = usePrevious(isFocus);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const addIssueButton = useRef<HTMLButtonElement>(null);
  const valueButton = useRef<HTMLDivElement>(null);
  const textarea = textareaRef.current;
  const isFocusProp = props.isFocus;

  useEffect(() => {
    if (typeof isFocusProp !== 'undefined') {
      setIsFocus(isFocusProp);
    }
  }, [isFocusProp]);

  useEffect(() => {
    if (!previousIsFocus && isFocus) {
      if (textarea) {
        textarea.focus();
      }
    }
  }, [isFocus, previousIsFocus, textarea]);

  useEffect(() => {
    if (textarea && mode !== 'key') {
      const minHeight = mode === 'url' ? MIN_HEIGHT_ONE_LINE : MIN_HEIGHT;
      setTextareaHeight(Math.max(textarea.scrollHeight / 10, minHeight / 10));
    }
  }, [currentValue, textarea, isFocus, mode]);

  useEffect(() => {
    setCurrentValue(value || '');
  }, [value]);

  const handleOnBlur = () => {
    if (currentValue !== value) {
      onBlur(currentValue);
    }

    setCurrentValue(value);

    setIsFocus(false);
  };

  useHandleClickOuside(
    [textareaRef, cancelButtonRef, addIssueButton, valueButton],
    () => {
      if (isFocus) {
        handleOnBlur();
      }
    },
  );

  const handleCancel = () => {
    setCurrentValue(value);

    setIsFocus(false);
  };

  function handleChange(e: React.FormEvent) {
    const { value } = e.target as HTMLInputElement;
    setCurrentValue(value);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && mode !== 'description') {
      e.preventDefault();

      if (textareaRef.current && isCreating) {
        onBlur(currentValue || value || '');

        setCurrentValue('');
        window.setTimeout(() => {
          if (textarea) textarea.scrollIntoView();
        }, 50);
      } else {
        handleOnBlur();
      }
    }
  }

  return (
    <div>
      <div style={isFocus ? { display: 'block' } : { display: 'none' }}>
        <textarea
          ref={textareaRef}
          className={cx(styles.textarea, styles[`textarea--${mode}`])}
          value={currentValue}
          onChange={handleChange}
          onFocus={onFocus}
          onKeyPress={handleKeyPress}
          style={{ height: `${textareaHeight}rem` }}
          placeholder={textareaPlaceholder}
        />
        <VerticalSpacing spacing="spacing-m" />
        <SubmitRow
          cancelLabel="Cancel"
          confirmLabel="Save"
          onConfirm={handleOnBlur}
          onCancel={handleCancel}
          isDisabled={mode === 'summary' && !currentValue}
          align="strech"
          cancelButtonRef={cancelButtonRef}
        />
      </div>

      <div
        ref={valueButton}
        style={value && !isFocus ? { display: 'block' } : { display: 'none' }}
      >
        <div
          onClick={() => setIsFocus(true)}
          className={cx(styles['value'], styles[mode])}
        >
          <FormatedTextContainer
            mode={mode === 'issue-card-no-permission' ? 'issue-card' : mode}
            text={value}
          />
        </div>
      </div>

      <div
        style={!isFocus && !value ? { display: 'block' } : { display: 'none' }}
      >
        <button
          ref={addIssueButton}
          className={cx(styles.button, styles[`button--mode-${mode}`])}
          onClick={() => {
            if (onButtonClick) {
              onButtonClick();
            }
            if (mode !== 'issue-card-no-permission') {
              setIsFocus(true);
            }
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};
