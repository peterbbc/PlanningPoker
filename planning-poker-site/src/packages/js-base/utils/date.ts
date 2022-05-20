const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getMonthWithDayInLocalTime = (date: Date, daysToAdd?: number) => {
  const resolvedDate = daysToAdd ? addDays(date, daysToAdd) : date;

  return `${monthNames[resolvedDate.getMonth()]} ${resolvedDate.getDate()}`;
};

export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const getMonthWithDayAndYearInLocalTime = (
  date: Date,
  daysToAdd?: number,
) => {
  const resolvedDate = daysToAdd ? addDays(date, daysToAdd) : date;

  return `${
    monthNames[resolvedDate.getMonth()]
  } ${resolvedDate.getDate()}, ${resolvedDate.getFullYear()}`;
};

export const getMonthWithDayAndYearAndTimeInLocalTime = (
  date: Date,
  daysToAdd?: number,
) => {
  const resolvedDate = daysToAdd ? addDays(date, daysToAdd) : date;

  const hours = resolvedDate.getHours();
  const hoursString = hours <= 9 ? `0${hours}` : hours.toString();
  const minutes = resolvedDate.getMinutes();
  const minutesString = minutes <= 9 ? `0${minutes}` : minutes.toString();

  return `${hoursString}:${minutesString} ${
    monthNames[resolvedDate.getMonth()]
  } ${resolvedDate.getDate()}, ${resolvedDate.getFullYear()}`;
};

export const getMinutesAndSecondsFromMilis = (duration: number) => {
  const seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const hoursStr = hours < 10 ? '0' + hours : hours;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  const secondsStr = seconds < 10 ? '0' + seconds : seconds;

  return hours > 0
    ? hoursStr + ':' + minutesStr + ':' + secondsStr
    : minutesStr + ':' + secondsStr;
};

function addDays(date: Date, days: number) {
  const newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + days);

  return newDate;
}
