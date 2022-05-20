import {
  ButtonLink,
  FlexBox,
  FormCheckbox,
  HoritzontalSpacing,
  Input,
  Span,
  VerticalSpacing,
} from '../../../../packages/react-base';
import React, { useState } from 'react';

import styles from './FormCheckboxList.module.scss';

export type FormCheckboxListElementType = {
  label: string;
  id: string;
};

interface FormCheckboxListProps {
  label: string;
  /* used to avoid id colisions with other checbox lists */
  id?: string;
  checboxes: FormCheckboxListElementType[];
  checkedChecboxes: FormCheckboxListElementType[];
  showFilter?: boolean;
  onChange: (checkedChecboxes: FormCheckboxListElementType[]) => void;
}

const COLLAPSED_CHECKBOXES_MAX = 6;
export const FormCheckboxList = ({
  label,
  id,
  checboxes,
  showFilter,
  checkedChecboxes,
  onChange,
}: FormCheckboxListProps) => {
  const [filter, setFilter] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheckboxChange = (
    checkbox: FormCheckboxListElementType,
    isChecked: boolean,
  ) => {
    const cleanCheckedCheckboxes = checkedChecboxes.filter(
      (_checkbox) => _checkbox.id !== checkbox.id,
    );

    onChange(
      isChecked
        ? [...cleanCheckedCheckboxes, checkbox]
        : cleanCheckedCheckboxes,
    );
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const isSlice = checboxes.length > COLLAPSED_CHECKBOXES_MAX && !isExpanded;
  const displayedCheckboxes = isSlice
    ? checboxes.slice(0, COLLAPSED_CHECKBOXES_MAX)
    : checboxes;

  return (
    <div>
      <div className={styles['label-conatiner']}>
        <Span spanStyle="bold">{label}</Span>
        <div>
          <ButtonLink onClick={handleClearAll}>{`Clear (${
            checkedChecboxes.length || 0
          })`}</ButtonLink>
        </div>
      </div>
      <VerticalSpacing spacing="spacing-m" />
      {showFilter && (
        <>
          <FlexBox>
            <Input
              placeholder="Filter"
              style="filter"
              value={filter || ''}
              onChange={setFilter}
            />
          </FlexBox>
          <VerticalSpacing spacing="spacing-xxs" />
        </>
      )}
      {displayedCheckboxes.map((checkbox) => {
        const isFiltered =
          filter &&
          checkbox.label.toLowerCase().indexOf(filter.toLowerCase()) === -1;

        if (isFiltered) return null;

        const isChecked = !!checkedChecboxes.find(
          (_checkbox) => _checkbox.id === checkbox.id,
        );

        return (
          <div key={checkbox.id} className={styles['form-element-wrapper']}>
            <FormCheckbox
              id={id ? `${id}-${checkbox.id}` : checkbox.id}
              label={checkbox.label}
              key={checkbox.id}
              isChecked={isChecked}
              onChange={(isChecked) =>
                handleCheckboxChange(checkbox, isChecked)
              }
            />
          </div>
        );
      })}
      {isSlice && (
        <>
          <VerticalSpacing spacing="spacing-xxs" />
          <FlexBox>
            <HoritzontalSpacing spacing="spacing-xs" />
            <ButtonLink size="small" onClick={() => setIsExpanded(true)}>
              View all
            </ButtonLink>
          </FlexBox>
        </>
      )}
    </div>
  );
};
