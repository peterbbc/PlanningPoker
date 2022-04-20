import React, { ReactNode } from 'react';

import styles from './SelectPlayers.module.scss';

import { FormGroup } from '../FormGroup/FormGroup';
import { Select } from '../../components/Select/Select';
import { Label } from '../../components/Label/Label';
import { ProfileImage } from '../../atoms/ProfileImage/ProfileImage';
import { Span } from '../../atoms/text/Span/Span';

import { Player } from '@we-agile-you/types-planning-poker';
// import { DEFAULT_DISPLAY_NAME } from '@we-agile-you/planning-poker-app';

export type SelectPlayersValue = 'all' | string[];

interface SelectPlayersProps {
  label: string;
  value: SelectPlayersValue;
  players: Player[];
  onChange: (value: SelectPlayersValue) => void;
  currentUserUid?: string | null;
}

type Option = {
  label: ReactNode;
  value: string;
  player?: Player;
};

export const SelectPlayers = ({
  players,
  value,
  label,
  onChange,
  currentUserUid,
}: SelectPlayersProps) => {
  const renderLabel = (player: Player) => (
    <div className={styles.option}>
      <div className={styles.option__picture}>
        <ProfileImage src={player.profilePictureUrl} alt={player.displayName} />
      </div>
      <div>
        <div>
          {player.displayName}
          {currentUserUid && currentUserUid === player.uid ? ' (me)' : ''}
        </div>
        <div>
          {player.state === 'online' ? (
            <Span size="micro" color="grey500">
              online
            </Span>
          ) : null}
        </div>
      </div>
    </div>
  );

  const options: Option[] = [
    { label: 'All players', value: 'all' },
    ...players
      .filter((player) => player.state === 'online')
      .map((player) => ({
        label: player.displayName || DEFAULT_DISPLAY_NAME,
        value: player.uid,
        player,
      })),
    ...players
      .filter((player) => player.state !== 'online')
      .map((player) => ({
        label: player.displayName || DEFAULT_DISPLAY_NAME,
        value: player.uid,
        player,
      })),
  ];

  const selectedOptions =
    value === 'all'
      ? options[0]
      : options
          .filter((option) =>
            value.find((playerUid) => option.value === playerUid),
          )
          .map((option) => ({
            ...option,
            label: `${option.player?.displayName}${
              currentUserUid && currentUserUid === option.player?.uid
                ? ' (me)'
                : ''
            }`,
          }));

  const handleChange = (value: Option | Option[]) => {
    const valueArray = Array.isArray(value) ? value : [value];

    const isAllPlayers =
      !!valueArray.find((option) => option.value === 'all') ||
      valueArray.length === 0;

    if (isAllPlayers) {
      onChange('all');

      return;
    }
    onChange(valueArray.map((option) => option.value));
  };
  return (
    <FormGroup className={styles['form-group']}>
      <Label>{label}</Label>
      <Select
        value={selectedOptions}
        options={options}
        menuPortalTarget={document.body}
        onChange={handleChange}
        placeholder="Select..."
        isMulti={value !== 'all'}
        isClearable={false}
        formatOptionLabel={(option, meta) =>
          option.player && meta.context === 'menu'
            ? (renderLabel(option.player) as ReactNode)
            : (option.label as string)
        }
      />
    </FormGroup>
  );
};
