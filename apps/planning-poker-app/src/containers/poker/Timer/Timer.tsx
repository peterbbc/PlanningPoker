import { getMinutesAndSecondsFromMinutes } from '@we-agile-you/js-base';
import {
  Button,
  ButtonDropdown,
  ButtonLink,
  DropdownItem,
  FlexBox,
  FormInput,
  Icon,
  Span,
  Switch,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import {
  cancelTimerForGame,
  updateCurrentTimerForGame,
  startTimerForGame,
  updateTimerAutoRestart,
} from '../../../spaces/poker-table/data/poker';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

import styles from './Timer.module.scss';
import { useTimer } from '../../../spaces/poker-table/hooks/useTimer';

const DEFAULT_TIMER_MINUTES = 45;

export const Timer = () => {
  const { pokerTable } = useCurrentTable();
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isShowEndedAlert, setIsShowEndedAlert] = useState(false);
  const [timerDurationInputValue, setTimerDurationInputValue] = useState<
    null | string
  >(null);

  const {
    isLoading,
    timerDurationMinutes,
    timeLeftMinutes,
    timeLeftMinutesPrevious,
    timerCurrentDurationMinutesInt,
    timerStartedAt,
    isTimerEnded,
    ellapsedPercent,
    isTimerRuning,
  } = useTimer();

  useEffect(() => {
    if (!isLoading) {
      setTimerDurationInputValue(
        timerDurationMinutes?.toString() || DEFAULT_TIMER_MINUTES.toString(),
      );
    }
  }, [isLoading, timerDurationMinutes]);

  useEffect(() => {
    if (
      timeLeftMinutes === -1 &&
      typeof timeLeftMinutesPrevious === 'number' &&
      timeLeftMinutesPrevious !== -1 &&
      !isShowEndedAlert
    ) {
      setIsShowEndedAlert(true);
      return;
    }
    if (
      !timeLeftMinutes ||
      (isShowEndedAlert && timeLeftMinutes && timeLeftMinutes > -1)
    ) {
      setIsShowEndedAlert(false);
      return;
    }
  }, [timeLeftMinutes, timeLeftMinutesPrevious, isShowEndedAlert]);

  const handleTimerStartFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const value = Number(timerDurationInputValue);

    if (!pokerTable.id || Number.isNaN(value)) return;

    startTimerForGame(pokerTable.id, value);
    setIsSettingsDropdownOpen(false);
  };

  const handleTimerRestart = () => {
    if (!pokerTable.id || !pokerTable.timerDurationMinutes) return;

    setIsSettingsDropdownOpen(false);
    startTimerForGame(pokerTable.id, pokerTable.timerDurationMinutes);
  };

  const handleTimerCancel = () => {
    if (!pokerTable.id) return;

    setIsSettingsDropdownOpen(false);
    cancelTimerForGame(pokerTable.id);
  };

  const handleAdd1Minute = () => {
    if (!pokerTable.id || !timerCurrentDurationMinutesInt) return;

    updateCurrentTimerForGame(
      pokerTable.id,
      timerCurrentDurationMinutesInt + 1,
    );
  };

  const handleAutoRestartSwitch = () => {
    if (!pokerTable.id) return;

    updateTimerAutoRestart(pokerTable.id, !pokerTable.timerAutoRestart);
  };

  const handleisOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setIsShowEndedAlert(false);
    }

    setIsSettingsDropdownOpen(isOpen);
  };

  const renderTooltip = () => {
    if (!isTimerRuning && !isSettingsDropdownOpen) {
      return null;
    }
    if (timeLeftMinutes && timeLeftMinutes > -1) {
      return getMinutesAndSecondsFromMinutes(timeLeftMinutes);
    }

    return 'Activate timer';
  };

  if (timerDurationInputValue === null) return null;

  return (
    <div
      className={cx(
        styles['timer'],
        !isSettingsDropdownOpen &&
          (!timerStartedAt || (isTimerEnded && !isShowEndedAlert)) &&
          styles['timer--is-idle'],
      )}
    >
      <ButtonDropdown
        isIconButton
        isFloatingButton
        isOpen={isSettingsDropdownOpen}
        isNoOpactity={isShowEndedAlert || (timerStartedAt && !isTimerEnded)}
        onIsOpenChange={handleisOpenChange}
        align="bottom-right"
        size="s"
        buttonTooltip={renderTooltip()}
        tooltipPosition="right"
        isShowTooltipWhenOpen={isTimerRuning}
        isShowTooltipOnSmallScreen
        dropdown={
          <div>
            {isTimerRuning ? (
              <div>
                <DropdownItem
                  icon={<Icon icon="add" />}
                  label="Add 1 minute"
                  onClick={handleAdd1Minute}
                />
                <DropdownItem
                  label="Restart Timer"
                  onClick={handleTimerRestart}
                  icon={<Icon icon="reset" />}
                />
                <DropdownItem
                  label="Cancel Timer"
                  onClick={handleTimerCancel}
                  icon={<Icon icon="close" />}
                />
                <DropdownItem
                  label="Auto reset"
                  onClick={handleAutoRestartSwitch}
                  icon={<Icon icon="restart" />}
                  rightContent={
                    <Switch isChecked={!!pokerTable.timerAutoRestart} />
                  }
                />
              </div>
            ) : (
              <>
                <div className={styles['start-timer-container']}>
                  <form onSubmit={handleTimerStartFormSubmit}>
                    <FormInput
                      label="Minutes"
                      isNoMargin
                      value={timerDurationInputValue}
                      onChange={setTimerDurationInputValue}
                    />
                    <VerticalSpacing spacing="spacing-xs" />
                    <FlexBox
                      onClick={handleAutoRestartSwitch}
                      justifyContent="space-between"
                      className={styles['sync-votings']}
                    >
                      <Span>Auto reset</Span>
                      <Switch isChecked={!!pokerTable.timerAutoRestart} />
                    </FlexBox>
                    <VerticalSpacing spacing="spacing-m" />
                    <Button
                      icon={<Icon icon="play" />}
                      buttonType="submit"
                      isBlock
                    >
                      Start
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        }
      >
        {isTimerRuning ? (
          <div className={styles['timer-circle']}>
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
          </div>
        ) : (
          <Icon icon="timer" />
        )}
      </ButtonDropdown>
      {isShowEndedAlert && (
        <div className={styles['ended-alert']}>
          <div>Time is up!</div>
          <ButtonLink
            size="small"
            onClick={handleTimerRestart}
            buttonColor="light"
          >
            Restart
          </ButtonLink>
          <button
            onClick={() => setIsShowEndedAlert(false)}
            className={styles['ended-alert__close']}
          >
            <Icon icon="close" />
          </button>
        </div>
      )}
    </div>
  );
};
