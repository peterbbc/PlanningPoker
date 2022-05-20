import { SelectPlayers, SelectPlayersValue } from '../../../../packages/react-base';
import { WhoCanEditIssuesType } from '../../../../packages/types-planning-poker';
import React, { useState } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

interface SelectWhoCanEditIssuesProps {
  onChange: (value: WhoCanEditIssuesType) => void;
}

export const SelectWhoCanEditIssues: React.FC<SelectWhoCanEditIssuesProps> = ({
  onChange,
}) => {
  const { uid } = useCurrentUser();
  const { pokerTable } = useCurrentTable();
  const { playersAll, whoCanEditIssues } = pokerTable;

  const [value, setValue] = useState<SelectPlayersValue>(
    whoCanEditIssues || 'all',
  );

  const handleChange = (value: SelectPlayersValue) => {
    setValue(value);
    onChange(value === 'all' ? null : value);
  };

  return (
    <SelectPlayers
      label="Who can manage issues"
      value={value}
      players={playersAll}
      onChange={handleChange}
      currentUserUid={uid}
    />
  );
};
