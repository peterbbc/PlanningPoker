import cx from 'classnames';
import React, { useEffect } from 'react';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

import Panel from '../Panel/Panel';
import Results from '../Stats/Results';
import Table from '../Table/Table';
import { Timer } from '../Timer/Timer';
import styles from './Room.module.scss';

interface RoomProps {
  isUsingMobileLayout: boolean | null;
}

const Room = ({ isUsingMobileLayout }: RoomProps) => {
  const { pokerTable } = useCurrentTable();
  const { user } = useCurrentUser();
  const setIsEditDisplayNameModalOpen = useAppContext().editDisplayNameModal[1];

  const hasToOpen = !!user && !user.displayName;
  useEffect(() => {
    if (hasToOpen) {
      setIsEditDisplayNameModalOpen('prompted');
    }
  }, [hasToOpen]);

  return (
    <div className={cx(styles.wrapper)}>
      <div className={styles['spacer-top']} />
      {!!user && (
        <>
          <div
            className={cx(
              styles['table'],
              pokerTable.cardsUp && styles['table-open'],
            )}
          >
            <Timer />
            <Table layout={isUsingMobileLayout ? 'vertical' : 'horizontal'} />
          </div>
          <div
            className={cx(
              styles['room-bottom'],
              pokerTable.cardsUp && styles['room-bottom--results'],
            )}
          >
            <div
              className={cx(
                styles['panel'],
                !pokerTable.cardsUp && styles['panel--is-open'],
              )}
            >
              <Panel />
            </div>
            <div
              className={cx(
                styles['results'],
                pokerTable.cardsUp && styles['results--is-open'],
              )}
            >
              <Results />
            </div>
          </div>
        </>
      )}
      <div
        className={cx(
          styles['spacer-bottom'],
          !!pokerTable.cardsUp && styles['spacer-bottom--is-results'],
        )}
      />
    </div>
  );
};

export default Room;
