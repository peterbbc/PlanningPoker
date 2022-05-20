import React, { ReactNode } from 'react';
import cx from 'classnames';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import styles from './RadioButtonsGroup.module.scss';
import { makeStyles } from '@material-ui/core';
import { VerticalSpacing } from '../../atoms/spacings/VerticalSpacing/VerticalSpacing';
type RadioButtonType = {
  value: string;
  label: ReactNode;
};

interface RadioButtonsGroupProps {
  value: string;
  buttons: RadioButtonType[];
  onChange: (value: string) => void;
}
const useStyles = makeStyles({
  root: {
    fontSize: '2.4rem !important',
    '& .MuiSvgIcon-root': {
      fontSize: '2.4rem !important',
    },
    '&.MuiRadio-colorPrimary': {},
    '&.MuiRadio-colorPrimary.Mui-checked': {
      color: '#3993ff',
    },
  },
});
export const RadioButtonsGroup = ({
  value,
  buttons,
  onChange,
}: RadioButtonsGroupProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange((event.target as HTMLInputElement).value);
  };

  const classes = useStyles();
  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="particular-organization"
        name="particular-organization"
        value={value}
        onChange={handleChange}
        row
      >
        {buttons.map(({ value: _value, label }, i) => (
          <>
            <FormControlLabel
              className={cx(
                styles.label,
                value === _value && styles['label--selected'],
              )}
              value={_value}
              control={<Radio color="primary" className={classes.root} />}
              label={label}
            />
            <div style={{ width: '100% ' }}>
              {i < buttons.length - 1 && (
                <VerticalSpacing spacing="spacing-s" />
              )}
            </div>
          </>
        ))}
      </RadioGroup>
    </FormControl>
  );
};
