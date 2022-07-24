import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

import { Sidebar } from '../Sidebar/Sidebar';
import styles from './SidebarLayoutWrapper.module.scss';

interface SidebarLayoutWrapperProps {
  children: React.ReactNode;
}

type IssuesPanelState = boolean | null;
export const SidebarStateContext = React.createContext<
  [IssuesPanelState, React.Dispatch<React.SetStateAction<IssuesPanelState>>]
>([null, (isOpen) => isOpen]);

export const SidebarLayoutWrapper = ({
  children,
}: SidebarLayoutWrapperProps) => {
  const { pokerTable } = useCurrentTable();
  const [isSidebarOpen, setIsSidebarOpen] = useState<IssuesPanelState>(null);
  const isIssuesDefined = !!pokerTable.issues;

  useEffect(() => {
    if (isSidebarOpen === null && isIssuesDefined && window.innerWidth > 1400) {
      setIsSidebarOpen(true);
    }
  }, [isIssuesDefined, isSidebarOpen]);

  return (
    <>
      <SidebarStateContext.Provider value={[isSidebarOpen, setIsSidebarOpen]}>
        <div
          className={cx(
            styles.divider,
            isSidebarOpen && styles.dividerIsOpen,
          )}
        >
          <div className={styles.content}>{children}</div>
          <aside className={styles.sidebar}>
            <Sidebar />
          </aside>
          <div
            className={styles.overlay}
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      </SidebarStateContext.Provider>
    </>
  );
};
