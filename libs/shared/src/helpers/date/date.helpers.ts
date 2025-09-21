import { DateTime } from 'luxon';

import { DEFAULT_DATE_FORMAT } from '../../constants';

/**
 * Converts a string in dd-mm-yyyy format to a Date object.
 * @param dateString The date string in dd-mm-yyyy format.
 * @returns The Date object corresponding to the input string.
 */
export const convertStringToDate = (dateString: string): Date => {
  const trimmedDateString = dateString.trim();
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;

  if (!dateRegex.test(trimmedDateString)) {
    throw new Error(
      'Invalid date string format. Date string must be in dd-mm-yyyy format.',
    );
  }

  const [day, month, year] = trimmedDateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const [parsedDay, parsedMonth, parsedYear] = [
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
  ];

  if (day !== parsedDay || month !== parsedMonth || year !== parsedYear) {
    throw new Error(
      'Invalid date. The resulting date does not match the input string.',
    );
  }

  return date;
};

const getYearBounds = (
  year: string,
): { firstDay: DateTime; lastDay: DateTime } => {
  const yearNum = parseInt(year, 10);

  if (Number.isNaN(yearNum)) {
    throw new Error('Invalid year input');
  }

  return {
    firstDay: DateTime.fromObject({ year: yearNum, month: 1, day: 1 }),
    lastDay: DateTime.fromObject({ year: yearNum, month: 12, day: 31 }),
  };
};

export const getYearBoundsAsDates = (year: string) => {
  const { firstDay, lastDay } = getYearBounds(year);

  return { firstDay: firstDay.toJSDate(), lastDay: lastDay.toJSDate() };
};

export const getYearBoundsAsStrings = (
  year: string,
  format = DEFAULT_DATE_FORMAT,
) => {
  const { firstDay, lastDay } = getYearBounds(year);

  return {
    firstDay: firstDay.toFormat(format),
    lastDay: lastDay.toFormat(format),
  };
};

export const convertToUtcDate = (
  inputDateTime?: string,
  format = DEFAULT_DATE_FORMAT,
): string => {
  if (!inputDateTime) {
    return '';
  }

  const dateTime = DateTime.fromISO(inputDateTime, { zone: 'utc' });

  return dateTime.toFormat(format);
};

export const dateToFormat = (
  inputDate: Date,
  format = DEFAULT_DATE_FORMAT,
): string => {
  const dateTime = DateTime.fromJSDate(inputDate);

  return dateTime.isValid ? dateTime.toFormat(format) : '';
};

export const utcDateToPayloadFormat = (
  inputDate: string,
  format = 'yyyy-MM-dd',
): string => {
  const parsedDate = DateTime.fromFormat(inputDate, DEFAULT_DATE_FORMAT);

  return parsedDate.toFormat(format);
};

export const extractTimeFromIsoDate = (inputDateTime?: string): string => {
  if (!inputDateTime) {
    return '';
  }

  const dateTime = DateTime.fromISO(inputDateTime, { zone: 'utc' });

  return dateTime.toFormat('HH:mm');
};

export const formatDateToGivenZoneAndFormat = (
  inputDateTime: string,
  zone: string,
  format = `${DEFAULT_DATE_FORMAT} HH:mm`,
): string => {
  if (!inputDateTime) {
    return '';
  }

  const localDateTime = DateTime.fromISO(inputDateTime).setZone(zone);

  return localDateTime.toFormat(format);
};

export const formatDateToGivenZoneAndLocale = (
  utcDate: string,
  timeZone: string,
  locale: string,
): string =>
  DateTime.fromISO(utcDate)
    .setZone(timeZone)
    .setLocale(locale)
    .toLocaleString(DateTime.DATE_SHORT);

export const isDateInPast = (date: string): boolean =>
  new Date(date).getTime() < new Date(new Date()).getTime();

export const calculateWeekRange = (date: Date): [Date, Date] => {
  const inputDate = new Date(date);

  const dayOfWeek = inputDate.getDay();

  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  let startOfWeek = new Date(inputDate);
  startOfWeek.setDate(inputDate.getDate() - diffToMonday);

  const today = new Date();

  if (startOfWeek < today) {
    startOfWeek = today;
  }

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + (7 - endOfWeek.getDay()));

  return [startOfWeek, endOfWeek];
};

export const getDateMinusDays = (daysOffset: number): Date => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - daysOffset);

  return currentDate;
};

export const getMonthStartEnd = (
  monthName: string,
): { startDate: Date; endDate: Date } => {
  const currentYear = DateTime.now().year;
  const monthDate = DateTime.fromFormat(monthName.toLowerCase(), 'LLLL', {
    locale: 'en',
  });

  if (!monthDate.isValid) {
    throw new Error(`Invalid month name: "${monthName}"`);
  }

  const startOfMonth = DateTime.local(currentYear, monthDate.month, 1);
  const endOfMonth = startOfMonth.endOf('month');

  return {
    startDate: startOfMonth.toJSDate(),
    endDate: endOfMonth.toJSDate(),
  };
};

export const getDateWithoutTimezone = (date: Date): string => {
  const tzoffset = date.getTimezoneOffset() * 60000;
  const withoutTimezone = new Date(date.valueOf() - tzoffset).toISOString();

  return withoutTimezone;
};
