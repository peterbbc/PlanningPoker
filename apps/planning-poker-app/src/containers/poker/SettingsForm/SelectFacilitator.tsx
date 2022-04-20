import {
  FormGroup,
  Label,
  Select,
  SelectValue,
} from '@we-agile-you/react-base';
import { Player } from '@we-agile-you/types-planning-poker';
import React, { useEffect, useMemo, useState } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { DEFAULT_DISPLAY_NAME } from '../../../spaces/poker-table/constants';

interface Option {
  label: string;
  value: string;
}

interface SelectFacilitatorProps {
  onChange: (value: string) => void;
  playersAll: Player[];
  value: string;
}

export const SelectFacilitator = ({
  onChange,
  playersAll,
  value,
}: SelectFacilitatorProps) => {
  const { uid } = useCurrentUser();
  const options = useMemo(
    () =>
      playersAll.map((player) => ({
        label: `${player.displayName || DEFAULT_DISPLAY_NAME} ${
          uid === player.uid ? '(You)' : ''
        }`,
        value: player.uid,
      })),
    [playersAll],
  );

  const [selectedOption, setSelectedOption] = useState<SelectValue<Option>>(
    options.find((option) => option.value === value),
  );

  const handlePlayerChange = (option: SelectValue<Option>) => {
    setSelectedOption(option);
    onChange(option.value);
  };

  useEffect(() => {
    setSelectedOption(options.find((option) => option.value === value));
  }, [value, options]);

  return (
    <FormGroup>
      <Label>Game facilitator</Label>
      <Select
        value={selectedOption}
        options={options}
        menuPortalTarget={document.body}
        onChange={handlePlayerChange}
        placeholder="Game faciltator"
      />
    </FormGroup>
  );
};
