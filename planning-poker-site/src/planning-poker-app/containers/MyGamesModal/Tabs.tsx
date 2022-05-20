import cx from 'classnames';
import React from 'react';

import styles from './Tabs.module.scss';

type TabElement = {
  name: string;
  id: string;
};

interface TabsProps {
  selectedTab: string;
  onChange: (selectedTab: string) => void;
  elements: TabElement[];
}

export const Tabs: React.FC<TabsProps> = ({
  elements,
  selectedTab,
  onChange,
}) => {
  return (
    <div className={styles.tabs}>
      {elements.map((element) => (
        <button
          key={element.id}
          className={cx(
            styles.button,
            selectedTab === element.id && styles.active,
          )}
          onClick={() => onChange(element.id)}
        >
          {element.name}
        </button>
      ))}
    </div>
  );
};
