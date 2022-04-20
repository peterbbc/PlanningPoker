import {
  ButtonIcon,
  ButtonLink,
  Icon,
  Input,
  Span,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React, { useState } from 'react';

import styles from './KeywordPicker.module.scss';

export type FormCheckboxListElementType = {
  label: string;
  id: string;
};

interface KeywordPickerProps {
  label: string;
  selectedKeywords: string[] | null;
  onChange: (selectedKeywords: string[]) => void;
}

export const KeywordPicker = ({
  label,
  selectedKeywords,
  onChange,
}: KeywordPickerProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value) return;

    onChange(selectedKeywords ? [...selectedKeywords, value] : [value]);
    setValue('');
  };

  const handleInputChange = (value: string) => {
    setValue(value);
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div>
      <div className={styles['label-conatiner']}>
        <Span spanStyle="bold">{label}</Span>
        <div>
          <ButtonLink onClick={handleClearAll}>{`Clear (${
            (selectedKeywords && selectedKeywords.length) || 0
          })`}</ButtonLink>
        </div>
      </div>
      <VerticalSpacing spacing="spacing-m" />
      <Input
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      <VerticalSpacing spacing="spacing-xs" />
      {selectedKeywords &&
        selectedKeywords.map((keyword) => {
          return (
            <div className={styles.keyword}>
              {keyword}
              <div className={styles['keyword__delete']}>
                <ButtonIcon
                  buttonColor="light"
                  icon={<Icon icon="close" />}
                  onClick={() => {
                    onChange(
                      selectedKeywords
                        ? selectedKeywords.filter(
                            (_keyword) => _keyword !== keyword,
                          )
                        : [],
                    );
                  }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};
