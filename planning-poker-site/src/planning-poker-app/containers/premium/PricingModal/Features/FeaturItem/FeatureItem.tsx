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
    <div className={cx(styles.iconContainer)}>
      <Icon icon="check" />
    </div>
    <div
      className={cx(
        styles.textContainer,
        isStrong && styles.textContainerStrong,
      )}
    >
      {children}
    </div>
  </div>
);
