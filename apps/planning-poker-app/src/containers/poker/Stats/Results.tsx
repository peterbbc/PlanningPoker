import { HoritzontalSpacing } from '@we-agile-you/react-base';
import cx from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { DonutChart } from '../../../components/molecules/DonutChart/DonutChart';
import { mapPlayersToResults } from '../../../spaces/poker-table/actions/playerActions';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';
import { getAgreementFromResults } from '../../../spaces/poker-table/utils/getAgreementFromResults';
import { getAverageFromResults } from '../../../spaces/poker-table/utils/getAverageFromResults';
import { getMostVoredCardsFromResults } from '../../../spaces/poker-table/utils/getMostVoredCardsFromResults';
import { AppState } from "../../../spaces/rootReducer";

import styles from './Results.module.scss';
import { StatsItem } from './StatsItem/StatsItem';
import { StatsKpi } from './StatsKpi/StatsKpi';

const Results: React.FC = () => {
  const { results: resultsTable } = useSelector(
    (state: AppState) => state.pokerTable,
  );
  const { pokerTable } = useCurrentTable();

  const results = resultsTable ? mapPlayersToResults(pokerTable.players) : null;

  if (!results || !results.votes.length || !pokerTable.deck)
    return <div>No votes</div>;

  const totalPlayers = results.total || 0;
  const average = getAverageFromResults(results);
  const agreement = getAgreementFromResults(pokerTable.deck, results);

  const cardsWithVotes = results.votes
    .filter((vote) => !!vote.playersVoted.length)
    .sort((voteA, voteB) =>
      pokerTable.deck.indexOf(voteA.card) < pokerTable.deck.indexOf(voteB.card)
        ? -1
        : 1,
    );
  const mostVotedCards = getMostVoredCardsFromResults(results);

  return (
    <div className={cx(styles['stats'])}>
      <ul className={cx(styles['stats-items'])}>
        {cardsWithVotes.map(({ card, playersVoted }) => (
          <li key={card}>
            <StatsItem
              card={card}
              cardVotes={playersVoted.length}
              totalVotes={totalPlayers}
              isMostVoted={mostVotedCards.includes(card)}
            />
          </li>
        ))}
      </ul>
      {(average !== null || agreement !== null) && (
        <>
          <HoritzontalSpacing spacing="spacing-xxl" />
          <div className={cx(styles['kpis'])}>
            <>
              {average !== null && (
                <StatsKpi
                  label="Average:"
                  value={Math.round(average * 10) / 10}
                />
              )}
              {agreement !== null && (
                <StatsKpi
                  label="Agreement:"
                  isChart
                  value={<DonutChart percentatge={agreement || 2} />}
                />
              )}
            </>
          </div>
        </>
      )}
    </div>
  );
};

export default Results;
