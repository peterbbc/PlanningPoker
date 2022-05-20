export const getMinutesAndSecondsFromMinutes = (minutes: number) => {
  const minutesNumber = Number(minutes);

  if (isNaN(minutesNumber)) return '';

  const minutesInt = Math.floor(minutesNumber);

  const seconds = ((minutes - minutesInt) * 60).toFixed(0);

  return `${minutesInt < 10 ? `0${minutesInt}` : minutesInt}:${
    seconds.length === 1 ? `0${seconds}` : seconds
  }`;
};
