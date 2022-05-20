import { Grid, Modal } from '../../../../packages/react-base';
import React, { ReactNode } from 'react';

import styles from './ModalWithSidebar.module.scss';

interface ModalWithSidebarProps {
  title: ReactNode;
  onClose: () => void;
  sidebar: ReactNode;
  actionsTopBar: ReactNode;
  content: ReactNode;
}
export const ModalWithSidebar = ({
  title,
  onClose,
  actionsTopBar,
  sidebar,
  content,
}: ModalWithSidebarProps) => {
  return (
    <Modal
      onClose={onClose}
      width="big"
      height="full-height"
      isNoPadding
      titleTopBar={title}
      actionsTopBar={actionsTopBar}
    >
      <Grid container className={styles.container}>
        <Grid xs={4} item className={styles.sidebar}>
          {sidebar}
        </Grid>
        <Grid xs={8} item className={styles.content}>
          {content}
        </Grid>
      </Grid>
    </Modal>
  );
};
