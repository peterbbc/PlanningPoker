import { SelectPlayers, SelectPlayersValue } from '@we-agile-you/react-base';
import { WhoCanShowCardsType } from '@we-agile-you/types-planning-poker';
import React, { useState } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

interface SelectWhoCanShowCardsProps {
  onChange: (value: WhoCanShowCardsType) => void;
}

export const SelectWhoCanShowCards: React.FC<SelectWhoCanShowCardsProps> = ({
  onChange,
}) => {
  const { uid } = useCurrentUser();
  const { pokerTable } = useCurrentTable();
  const { playersAll, whoCanShowCards } = pokerTable;

  const [value, setValue] = useState<SelectPlayersValue>(
    whoCanShowCards || 'all',
  );

  const handleChange = (value: SelectPlayersValue) => {
    console.log(value);
    setValue(value);
    onChange(value === 'all' ? null : value);
  };

  return (
    <SelectPlayers
      label="Who can reveal cards"
      value={value}
      players={playersAll}
      onChange={handleChange}
      currentUserUid={uid}
    />
  );
};
