import {
  Button,
  ButtonDropdown,
  DropdownItem,
  HoritzontalSpacing,
  Icon,
} from '@we-agile-you/react-base';
import cx from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from '../../../../components/atoms/Link/Link';
import { Crown } from '../../../../components/atoms/Crown/Crown';
import { DEFAULT_GAME_NAME } from '../../../../spaces/poker-table/constants';
import { useCurrentTable } from '../../../../spaces/poker-table/hooks/useCurrentTable';

import { AuthButton } from '../../../AuthButton/AuthButton';
import { SidebarStateContext } from '../../SidebarLayoutWrapper/SidebarLayoutWrapper';
import styles from './HeaderPoker.module.scss';
import { useAppContext } from '../../../../spaces/app/hooks/useAppContext';
import { InviteTooltip } from '../InviteTooltip';
import { IssuesTooltip } from '../IssuesTooltip';
import { FormatedTextContainer } from '../../../../components/molecules/FormatedTextContainer/FormatedTextContainer';
import { useTimer } from '../../../../spaces/poker-table/hooks/useTimer';
import { LogoIcon } from '../../../../components/atoms/LogoIcon/LogoIcon';
import { BurgerButtonDropdown } from '../../../../components/molecules/BurgerButtonDropdown/BurgerButtonDropdown';

export const HeaderPoker = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);
  const { pokerTable, currentIssueIndex } = useCurrentTable();
  const hasClickedInvite = useRef(false);
  const hasClickedIssues = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useContext(SidebarStateContext);
  const appContext = useAppContext();

  const inviteButtonRef = useRef<HTMLButtonElement>(null);
  const issuesButtonRef = useRef<HTMLButtonElement>(null);

  const currentIssue =
    currentIssueIndex !== null &&
    !!pokerTable.issues &&
    pokerTable.issues[currentIssueIndex];

  useEffect(() => {
    const handleWindowScroll = () => {
      setIsScrolled(
        document.body.scrollTop > 20 || document.documentElement.scrollTop > 20,
      );
    };

    window.addEventListener('scroll', handleWindowScroll);

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  const handleInviteClick = () => {
    hasClickedInvite.current = true;

    appContext.invitePlayersModal[1](true);
  };

  const handleIssuesClick = () => {
    hasClickedIssues.current = true;

    setIsSidebarOpen(!isSidebarOpen);
  };

  const className = cx(styles['header'], {
    [styles['header--scrolled']]: isScrolled,
    [styles['header--is-sidebar-open']]: isSidebarOpen,
  });

  const isLoading = !pokerTable.id;

  const { ellapsedPercent, timerStartedAt, isTimerEnded } = useTimer();

  return (
    <div className={className}>
      <div className={styles['left']}>
        <div className={styles['burger-button']}>
          <BurgerButtonDropdown isPoker />
        </div>
        <Link to="/" className={styles['logo-link']}>
          <LogoIcon className={styles['logo-icon']} color="primary" />
        </Link>
      </div>
      <div
        className={cx(
          styles['middle'],
          currentIssue && styles['middle--with-summary'],
        )}
      >
        {!isLoading && (
          <>
            <div className={styles['game-name-container']}>
              {timerStartedAt && !isTimerEnded && (
                <span className={styles['timer-circle']}>
                  <svg className={styles['svg']} viewBox="0 0 32 32">
                    <circle
                      className={cx(
                        styles['circle'],
                        ellapsedPercent > 75 &&
                          ellapsedPercent < 90 &&
                          styles['circle--warning'],
                        ellapsedPercent > 90 && styles['circle--danger'],
                      )}
                      style={{
                        strokeDasharray: `${ellapsedPercent} 100`,
                      }}
                      r="16"
                      cx="16"
                      cy="16"
                    />
                  </svg>
                </span>
              )}
              {pokerTable.isPremium && (
                <>
                  <Crown type="game" />
                  <HoritzontalSpacing spacing="spacing-s" />
                </>
              )}
              <ButtonDropdown
                isOpen={isGameMenuOpen}
                onIsOpenChange={setIsGameMenuOpen}
                className={styles['game-name']}
                dropdown={
                  <>
                    <DropdownItem
                      label="Game settings"
                      onClick={() => {
                        appContext.settingsModal[1](true);
                        setIsGameMenuOpen(false);
                      }}
                      icon={<Icon icon="cog" />}
                    ></DropdownItem>
                    <DropdownItem
                      label="Voting History"
                      icon={<Icon icon="issues" />}
                      onClick={() => {
                        appContext.votingHistoryModal[1](true);
                        setIsGameMenuOpen(false);
                      }}
                    ></DropdownItem>
                  </>
                }
              >
                <span>{pokerTable.name || DEFAULT_GAME_NAME}</span>
              </ButtonDropdown>
            </div>
            {!!currentIssue && (
              <>
                <div className={styles['current-issue-summary']}>
                  <span className={styles['voting-now-label']}>Voting: </span>
                  {currentIssue.provider === 'jira' && currentIssue.url ? (
                    <a href={currentIssue.url} target="_blank" rel="noreferrer">
                      {currentIssue.summary}
                    </a>
                  ) : (
                    <FormatedTextContainer
                      mode="summary-header"
                      text={currentIssue.summary}
                    />
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className={styles['right']}>
        <div className={styles['auth-button']}>
          <AuthButton buttonColor="primary" />
        </div>
        <div className={styles['header-actions']}>
          <div
            className={cx(styles['header-action'], styles['invite-players'])}
          >
            <Button
              ref={inviteButtonRef}
              buttonStyle="secondary"
              onClick={handleInviteClick}
              icon={<Icon icon="invite" />}
              isHeaderButton
              tooltip={currentIssue && 'Invite players'}
            >
              {!currentIssue && <span>Invite players</span>}
            </Button>
          </div>
          <div className={styles['header-action']}>
            <Button
              ref={issuesButtonRef}
              buttonStyle="secondary"
              isActive={!!isSidebarOpen}
              icon={<Icon icon="issues" />}
              tooltip={isSidebarOpen ? 'Hide issues' : 'Show issues'}
              onClick={handleIssuesClick}
              isHeaderButton
            ></Button>
          </div>
          <InviteTooltip
            refNode={inviteButtonRef}
            hasClickedInvite={hasClickedInvite.current}
          />
          <IssuesTooltip
            refNode={issuesButtonRef}
            hasClickedIssues={hasClickedIssues.current}
          />
        </div>
      </div>
    </div>
  );
};
