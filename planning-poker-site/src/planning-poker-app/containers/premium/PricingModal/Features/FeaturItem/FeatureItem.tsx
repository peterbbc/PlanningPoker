import { Icon } from '../../../../../../packages/react-base';
import cx from 'classnames';
import React from 'react';

import styles from './FeatureItem.module.scss';

interface FeatureItemProps {
  children: React.ReactNode;
  isStrong?: boolean;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({
  children,
  isStrong,
}) => (
  <div className={styles.item}>
    <div className={cx(styles['icon-container'])}>
      <Icon icon="check" />
    </div>
    <div
      className={cx(
        styles['text-container'],
        isStrong && styles['text-container--strong'],
      )}
    >
      {children}
    </div>
  </div>
);
