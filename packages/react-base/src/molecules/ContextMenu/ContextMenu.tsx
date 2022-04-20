// import { IconValue } from '@we-agile-you/react-base';
import React, { ReactNode } from 'react';
import cx from 'classnames';
import { Icon } from '../../atoms/Icon/Icon';
import { DropdownItem } from '../DropdownItem/DropdownItem';

import styles from './ContextMenu.module.scss';

export type ContextMenuElement = {
  label: ReactNode;
  icon?: /* IconValue */ typeof Icon;
  onClick: () => void;
};
interface ContextMenuProps {
  elements: ContextMenuElement[];
  maxHeight?: 'l';
}

export const ContextMenu = ({ elements, maxHeight }: ContextMenuProps) => {
  return (
    <ul
      className={cx(
        styles['list'],
        maxHeight && styles[`list--max-height-${maxHeight}`],
      )}
    >
      {elements.map(({ icon, label, onClick }, i) => (
        <li key={i}>
          <DropdownItem
            icon={icon ? <Icon icon={icon} /> : undefined}
            label={label}
            onClick={onClick}
          />
        </li>
      ))}
    </ul>
  );
};
