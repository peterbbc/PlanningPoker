import CheckboxM, {
  CheckboxProps as CheckboxPropsM,
} from '@material-ui/core/Checkbox';
import cx from 'classnames';
import React from 'react';

import styles from './Checkbox.module.scss';

interface CheckboxProps extends CheckboxPropsM {
  boxSize?: 'medium' | 'big';
}

// Inspired by blueprintjs

export const Checkbox: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  CheckboxProps
> = ({ boxSize, ...props }, _ref) => {
  return (
    <CheckboxM
      className={cx(styles.root, boxSize === 'big' && styles.big)}
      disableRipple
      color="default"
      checkedIcon={<span className={cx(styles.icon, styles.checkedIcon)} />}
      icon={<span className={styles.icon} />}
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      {...props}
    />
  );
};
