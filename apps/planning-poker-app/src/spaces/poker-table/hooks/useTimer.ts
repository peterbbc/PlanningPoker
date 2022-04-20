import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from './../../../vendors/hotjar/identify';
import { usePrevious } from '@we-agile-you/react-base';
import { useState, useEffect } from 'react';
import { useCurrentTable } from './useCurrentTable';
export const useTimer = () => {
  const [timeLeftMinutes, setTimeLeftMinutes] = useState<number | null>(null);
  const { pokerTable } = useCurrentTable();

  const {
    timerStartedAt,
    id,
    timerDurationMinutes,
    timerCurrentDurationMinutes,
  } = pokerTable;

  const isLoading = id === null;
  const timeLeftMinutesPrevious = usePrevious(timeLeftMinutes);
  const timerCurrentDurationMinutesInt = Number(timerCurrentDurationMinutes);
  const isTimerEnded = timeLeftMinutes === -1;
  const isTimerRuning =
    timeLeftMinutes !== -1 &&
    !!timerCurrentDurationMinutesInt &&
    !!timerStartedAt;

  useEffect(() => {
    if (!timerStartedAt || !timerCurrentDurationMinutesInt) {
      setTimeLeftMinutes(null);

      return;
    }

    const updateTimeLeft = (inervalID?: number) => {
      const nowMinutes = Date.now() / 1000 / 60;
      const timerStartedMinutes = timerStartedAt.getTime() / 1000 / 60;
      const timeLeftMinutes =
        timerCurrentDurationMinutesInt - (nowMinutes - timerStartedMinutes);

      if (timeLeftMinutes < 0) {
        setTimeLeftMinutes(-1);
        if (inervalID) clearInterval(inervalID);
      } else {
        setTimeLeftMinutes(timeLeftMinutes);
      }
    };

    updateTimeLeft();

    const inervalID = window.setInterval(() => updateTimeLeft(inervalID), 300);

    return () => {
      if (inervalID) clearInterval(inervalID);
    };
  }, [timerStartedAt, timerCurrentDurationMinutesInt]);
  useEffect(() => {
    if (!isTimerRuning) {
      return;
    }

    hotjarIdentify(HOTJAR_IDENTIFY_KEYS.VIEWED_TIMER);
  }, [isTimerRuning]);

  const ellapsedPercent =
    timeLeftMinutes && timerCurrentDurationMinutesInt
      ? ((timerCurrentDurationMinutesInt - timeLeftMinutes) /
          timerCurrentDurationMinutesInt) *
        100
      : 0;

  return {
    isLoading,
    isTimerRuning,
    isTimerEnded,
    timerDurationMinutes,
    timeLeftMinutes,
    timeLeftMinutesPrevious,
    timerCurrentDurationMinutesInt,
    ellapsedPercent,
    timerStartedAt,
  };
};
