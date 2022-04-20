import { SidebarLayoutWrapper } from '../../../containers/poker/SidebarLayoutWrapper/SidebarLayoutWrapper';
import { throttle } from 'lodash';
import { updatecurrentUserVotingCount } from '../../../spaces/auth/data/user';
import { usePrevious } from '@we-agile-you/react-base';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';
import { useUpdateCurrentUserGameHistory } from '../../../spaces/auth/hooks/useUpdateCurrentUserGames';
import React, { useEffect, useState } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { Helmet } from 'react-helmet';
import { PokerNavigation } from '../../../containers/poker/navigation/PokerNavigation';
import Room from '../../../containers/poker/Room/Room';
import { ModalAlerting } from '../../../containers/ModalAlerting/ModalAlerting';
import { RobotAlerting } from '../../../containers/RobotAlerting/RobotAlerting';
import { DEFAULT_GAME_NAME } from '../../../spaces/poker-table/constants';
import { sendEvent } from '../../../spaces/events/events';
import useSubscribeToPokerTable from '../../../spaces/poker-table/hooks/useSubscribeToPokerTable';
import useBuildPresenceInTable from '../../../spaces/poker-table/hooks/useBuildPresence';
import { NotFoundTemplate } from '../NotFoundTemplate/NotFoundTemplate';
import { PremiumInFreeGameAlert } from '../../../containers/PremiumInFreeGameAlert/PremiumInFreeGameAlert';

const USE_PANEL_POPUP_MEDIA_QUERY = 920;

interface PokerTableTemplateProps {
  tableId: string;
}

export const PokerTableTemplate = ({ tableId }: PokerTableTemplateProps) => {
  const { tableExists } = useSubscribeToPokerTable(tableId);
  useBuildPresenceInTable();
  useUpdateCurrentUserGameHistory();

  const { pokerTable } = useCurrentTable();
  const { uid } = useCurrentUser();
  const [isUsingMobileLayout, setIsUsingMobileLayout] = useState<
    boolean | null
  >(null);
  const ownerId = pokerTable.ownerId;

  const showCards = pokerTable.cardsUp;
  const previousShowCards = usePrevious(showCards);
  const isMoreThanOnePlayerInTable =
    !!pokerTable.players && pokerTable.players.length > 1;

  useEffect(() => {
    if (uid && tableId && ownerId) {
      try {
        sendEvent({
          id: 'poker-table-page-view',
          tableId,
          isOwner: ownerId === uid,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [uid, tableId, ownerId]);

  useEffect(() => {
    if (
      isMoreThanOnePlayerInTable &&
      previousShowCards === false &&
      showCards
    ) {
      sendEvent({
        id: 'poker-table-show-cards',
      });
    }
  }, [previousShowCards, showCards, isMoreThanOnePlayerInTable]);

  useEffect(() => {
    if (previousShowCards === false && showCards) {
      updatecurrentUserVotingCount();
    }
  }, [previousShowCards, showCards]);

  useEffect(() => {
    setIsUsingMobileLayout(window.innerWidth < USE_PANEL_POPUP_MEDIA_QUERY);

    const handleWindowResize = throttle(() => {
      setIsUsingMobileLayout(window.innerWidth < USE_PANEL_POPUP_MEDIA_QUERY);
    }, 1000);

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const title = pokerTable?.name ? pokerTable.name : DEFAULT_GAME_NAME;

  if (tableExists === false) {
    return <NotFoundTemplate />;
  }

  return (
    <>
      <Helmet title={title}>
        <style type="text/css">{`
        html, body {
            background-color: #f9f9f9;
        }
        
        @media (min-width: 920px) and (max-height: 750px) {
          html { font-size: 57%; }
        }

        @media (min-width: 920px) and (max-height: 650px) {
          html { font-size: 50%; }
        }

    `}</style>
      </Helmet>
      <SidebarLayoutWrapper>
        <PokerNavigation />
        <Room isUsingMobileLayout={isUsingMobileLayout} />
      </SidebarLayoutWrapper>
      <RobotAlerting />
      <ModalAlerting />
      <PremiumInFreeGameAlert />
    </>
  );
};
