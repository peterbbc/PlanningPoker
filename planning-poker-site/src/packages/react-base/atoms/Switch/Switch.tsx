import React from 'react';
import SwitchMaterial, { SwitchProps } from '@material-ui/core/switch';

import {
  createStyles,
  SwitchClassKey,
  Theme,
  withStyles,
} from '@material-ui/core';

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
  switchPrimary?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
  onChangeSwitch?: (isChecked: boolean) => void;
  isChecked: boolean;
  theme?: 'primary' | 'base';
}

export const Switch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      borderRadius: 26 / 2,
      padding: 0,
      margin: theme.spacing(1),
      '&:hover': {
        boxShadow: '0px 0px 0 2px rgba(0,0,0,.1)',
      },
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    switchPrimary: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#3993ff',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#3993ff',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }),
)(({ classes, onChangeSwitch, isChecked, theme }: Props) => {
  const handleChange = (_event: any, checked: boolean) => {
    if (onChangeSwitch) {
      onChangeSwitch(checked);
    }
  };

  return (
    <SwitchMaterial
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase:
          theme === 'primary' ? classes.switchPrimary : classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      onChange={handleChange}
      checked={isChecked}
    />
  );
});
