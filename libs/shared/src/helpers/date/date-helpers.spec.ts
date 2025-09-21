import { DateTime } from 'luxon';

import {
  calculateWeekRange,
  convertStringToDate,
  convertToUtcDate,
  dateToFormat,
  extractTimeFromIsoDate,
  formatDateToGivenZoneAndFormat,
  formatDateToGivenZoneAndLocale,
  getDateMinusDays,
  getDateWithoutTimezone,
  getMonthStartEnd,
  getYearBoundsAsDates,
  getYearBoundsAsStrings,
  utcDateToPayloadFormat,
} from './date.helpers';

describe('date helpers tests', () => {
  describe('convertStringToDate function', () => {
    test('it should convert a valid date string to a Date object', () => {
      // Arrange
      const dateString = '10-05-2024';
      const expectedDate = new Date(2024, 4, 10);

      // Act
      const result = convertStringToDate(dateString);

      // Assert
      expect(result).toEqual(expectedDate);
    });

    test('it should throw an error for an invalid date string format', () => {
      // Arrange
      const dateString = '2024-05-10'; // Invalid format

      // Act & Assert
      expect(() => convertStringToDate(dateString)).toThrow(
        'Invalid date string format. Date string must be in dd-mm-yyyy format.',
      );
    });

    test('it should throw an error for an invalid date', () => {
      // Arrange
      const dateString = '31-02-2024'; // February 31st is not a valid date

      // Act & Assert
      expect(() => convertStringToDate(dateString)).toThrow(
        'Invalid date. The resulting date does not match the input string.',
      );
    });

    test('it should correctly handle leap years', () => {
      // Arrange
      const dateString = '29-02-2024'; // Leap year (valid date)
      const expectedDate = new Date(2024, 1, 29);

      // Act
      const result = convertStringToDate(dateString);

      // Assert
      expect(result).toEqual(expectedDate);
    });

    test('it should correctly handle single digit day and month', () => {
      // Arrange
      const dateString = '01-01-2024'; // Single digit day and month (valid date)
      const expectedDate = new Date(2024, 0, 1);

      // Act
      const result = convertStringToDate(dateString);

      // Assert
      expect(result).toEqual(expectedDate);
    });

    test('it should correctly handle date string with leading and trailing spaces', () => {
      // Arrange
      const dateString = '  10-05-2024  '; // Date string with leading and trailing spaces
      const expectedDate = new Date(2024, 4, 10);

      // Act
      const result = convertStringToDate(dateString);

      // Assert
      expect(result).toEqual(expectedDate);
    });
  });

  describe('getYearBoundsAsStrings function', () => {
    test('should return first and last day of a given year with default format', () => {
      // Arrange
      const year = '2024';
      const expectedFirstDay = DateTime.fromObject({
        year: 2024,
        month: 1,
        day: 1,
      }).toFormat('dd-MM-yyyy');
      const expectedLastDay = DateTime.fromObject({
        year: 2024,
        month: 12,
        day: 31,
      }).toFormat('dd-MM-yyyy');

      // Act
      const { firstDay, lastDay } = getYearBoundsAsStrings(year);

      // Assert
      expect(firstDay).toBe(expectedFirstDay);
      expect(lastDay).toBe(expectedLastDay);
    });

    test('should return first and last day of a given year with a custom format', () => {
      // Arrange
      const year = '2024';
      const format = 'yyyy/MM/dd';

      const expectedFirstDay = DateTime.fromObject({
        year: 2024,
        month: 1,
        day: 1,
      }).toFormat(format);
      const expectedLastDay = DateTime.fromObject({
        year: 2024,
        month: 12,
        day: 31,
      }).toFormat(format);

      // Act
      const { firstDay, lastDay } = getYearBoundsAsStrings(year, format);

      // Assert
      expect(firstDay).toBe(expectedFirstDay);
      expect(lastDay).toBe(expectedLastDay);
    });

    test('should throw an error for invalid year input', () => {
      // Arrange
      const invalidYear = 'abcd';

      // Act + Assert
      expect(() => {
        getYearBoundsAsStrings(invalidYear);
      }).toThrow('Invalid year input');
    });

    test('should throw an error for an empty year input', () => {
      // Arrange
      const emptyYear = '';

      // Act + Assert
      expect(() => {
        getYearBoundsAsStrings(emptyYear);
      }).toThrow('Invalid year input');
    });

    test('should handle leap years correctly', () => {
      // Arrange
      const year = '2020'; // Leap year
      const format = 'dd-MM-yyyy';

      const expectedFirstDay = DateTime.fromObject({
        year: 2020,
        month: 1,
        day: 1,
      }).toFormat(format);
      const expectedLastDay = DateTime.fromObject({
        year: 2020,
        month: 12,
        day: 31,
      }).toFormat(format);

      // Act
      const { firstDay, lastDay } = getYearBoundsAsStrings(year, format);

      // Assert
      expect(firstDay).toBe(expectedFirstDay);
      expect(lastDay).toBe(expectedLastDay);
    });
  });

  describe('getYearBoundsAsDates function', () => {
    test('should return first and last day of a given year', () => {
      // Arrange
      const year = '2024';
      const expectedFirstDay = new Date(2024, 0, 1);
      const expectedLastDay = new Date(2024, 11, 31);

      // Act
      const { firstDay, lastDay } = getYearBoundsAsDates(year);

      // Assert
      expect(firstDay).toStrictEqual(expectedFirstDay);
      expect(lastDay).toStrictEqual(expectedLastDay);
    });

    test('should throw an error for invalid year input', () => {
      // Arrange
      const invalidYear = 'abcd';

      // Act + Assert
      expect(() => {
        getYearBoundsAsDates(invalidYear);
      }).toThrow('Invalid year input');
    });

    test('should throw an error for an empty year input', () => {
      // Arrange
      const emptyYear = '';

      // Act + Assert
      expect(() => {
        getYearBoundsAsDates(emptyYear);
      }).toThrow('Invalid year input');
    });
  });

  describe('convertToUtcDate function', () => {
    test('should return empty string if inputDateTime is not provided', () => {
      // Arrange
      const expectedResult = '';

      // Act
      const result = convertToUtcDate();

      // Assert
      expect(result).toEqual(expectedResult);
    });

    test('should return empty string if inputDateTime is empty string', () => {
      // Arrange
      const expectedResult = '';

      // Act
      const result = convertToUtcDate('');

      // Assert
      expect(result).toEqual(expectedResult);
    });

    test('should return empty string if inputDateTime is undefined', () => {
      // Arrange
      const expectedResult = '';

      // Act
      const result = convertToUtcDate(undefined);

      // Assert
      expect(result).toEqual(expectedResult);
    });

    test('should convert inputDateTime to UTC format', () => {
      // Arrange
      const mockFromISO = jest
        .spyOn(DateTime, 'fromISO')
        .mockReturnValueOnce(DateTime.fromISO('2024-05-13T12:00:00Z'));

      // Act
      const result = convertToUtcDate('2024-05-13T12:00:00Z');

      // Assert
      expect(mockFromISO).toHaveBeenCalledWith('2024-05-13T12:00:00Z', {
        zone: 'utc',
      });

      expect(result).toEqual('13-05-2024');
      mockFromISO.mockRestore();
    });

    test('should format the date correctly with a valid custom format (dd.MM.yyyy)', () => {
      // Arrange
      const inputDateTime = '2024-06-20T12:00:00Z';
      const format = 'dd.MM.yyyy';
      const expectedOutput = DateTime.fromISO(inputDateTime, {
        zone: 'utc',
      }).toFormat(format);

      // Act
      const result = convertToUtcDate(inputDateTime, format);

      // Assert
      expect(result).toBe(expectedOutput);
    });

    test('should format the date correctly with a valid custom format (yyyy/MM/dd)', () => {
      // Arrange
      const inputDateTime = '2024-06-20T12:00:00Z';
      const format = 'yyyy/MM/dd';
      const expectedOutput = DateTime.fromISO(inputDateTime, {
        zone: 'utc',
      }).toFormat(format);

      // Act
      const result = convertToUtcDate(inputDateTime, format);

      // Assert
      expect(result).toBe(expectedOutput);
    });

    test('should handle correctly invalid date format', () => {
      // Arrange
      const inputDateTime = '2024-06-20T12:00:00Z';
      const format = 'invalid-format';
      const expectedOutput = DateTime.fromISO(inputDateTime, {
        zone: 'utc',
      }).toFormat(format);

      // Act
      const result = convertToUtcDate(inputDateTime, format);

      // Assert
      expect(result).toBe(expectedOutput);
    });

    test('should handle invalid date input correctly', () => {
      // Arrange
      const inputDateTime = 'invalid-date';

      // Act
      const result = convertToUtcDate(inputDateTime);

      // Assert
      expect(result).toBe('Invalid DateTime');
    });
  });

  describe('dateToFormat function', () => {
    const date = new Date('2024-12-18T15:15:45Z');

    test('should format the date using the default format', () => {
      // Act
      const result = dateToFormat(date);

      // Assert
      expect(result).toBe('18-12-2024');
    });

    test('should format the date using a custom format', () => {
      // Arrange
      const customFormat = 'yyyy-MM-dd';

      // Act
      const result = dateToFormat(date, customFormat);

      // Assert
      expect(result).toBe('2024-12-18');
    });

    test('should return an empty string for an invalid date', () => {
      // Act
      const result = dateToFormat(new Date('invalid-date'));

      // Assert
      expect(result).toBe('');
    });
  });

  describe('utcDateToPayloadFormat function', () => {
    test('should convert valid date from dd-MM-yyyy to yyyy-MM-dd', () => {
      // Assert
      const inputDate = '25-12-2021';
      const expectedOutput = '2021-12-25';

      // Act
      const result = utcDateToPayloadFormat(inputDate);

      // Assert
      expect(result).toBe(expectedOutput);
    });

    test('should handle invalid date format appropriately', () => {
      // Assert
      const inputDate = '25/12/2021';

      // Act
      const result = utcDateToPayloadFormat(inputDate);

      // Assert
      expect(result).toBe('Invalid DateTime');
    });

    test('should return invalid date if date does not exist', () => {
      // Assert
      const inputDate = '32-12-2021';

      // Act
      const result = utcDateToPayloadFormat(inputDate);

      // Assert
      expect(result).toBe('Invalid DateTime');
    });

    test('should return invalid date if month does not exist', () => {
      // Assert
      const inputDate = '25-13-2021';

      // Act
      const result = utcDateToPayloadFormat(inputDate);

      // Assert
      expect(result).toBe('Invalid DateTime');
    });

    test('should return a correctly formatted leap year date', () => {
      // Assert
      const inputDate = '29-02-2020';
      const expectedOutput = '2020-02-29';

      // Act
      const result = utcDateToPayloadFormat(inputDate);

      // Assert
      expect(result).toBe(expectedOutput);
    });

    test('should handle empty string input appropriately', () => {
      // Assert
      const inputDate = '';

      // Act
      const result = utcDateToPayloadFormat(inputDate);

      // Assert
      expect(result).toBe('Invalid DateTime');
    });
  });

  describe('extractTimeFromIsoDate function', () => {
    test('should return an empty string if no input is provided', () => {
      // Act
      const result = extractTimeFromIsoDate();

      // Assert
      expect(result).toBe('');
    });

    test('should return the correct time in HH:MM format for a valid ISO date string', () => {
      // Arrange
      const inputDateTime = '2024-06-11T14:30:00Z';

      // Act
      const result = extractTimeFromIsoDate(inputDateTime);

      // Assert
      expect(result).toBe('14:30');
    });

    test('should handle different valid ISO date strings correctly', () => {
      // Arrange
      const inputDateTime1 = '2024-06-11T08:45:00Z';
      const inputDateTime2 = '2024-12-25T23:59:00Z';

      // Act
      const result1 = extractTimeFromIsoDate(inputDateTime1);
      const result2 = extractTimeFromIsoDate(inputDateTime2);

      // Assert
      expect(result1).toBe('08:45');
      expect(result2).toBe('23:59');
    });

    test('should handle ISO date strings with milliseconds correctly', () => {
      // Arrange
      const inputDateTime = '2024-06-11T14:30:00.123Z';

      // Act
      const result = extractTimeFromIsoDate(inputDateTime);

      // Assert
      expect(result).toBe('14:30');
    });

    test('should handle ISO date strings with time zone offsets correctly', () => {
      // Arrange
      const inputDateTime = '2024-06-11T14:30:00+02:00';

      // Act
      const result = extractTimeFromIsoDate(inputDateTime);

      // Assert
      expect(result).toBe('12:30');
    });

    test('should return Invalid DateTime string for invalid ISO date strings', () => {
      // Arrange
      const inputDateTime = 'invalid-date-string';

      // Act
      const result = extractTimeFromIsoDate(inputDateTime);

      // Assert
      expect(result).toBe('Invalid DateTime');
    });
  });

  describe('formatDateToGivenZoneAndFormat', () => {
    test('should return an empty string if no input is provided', () => {
      // Act
      const result = formatDateToGivenZoneAndFormat('', 'Europe/Bucharest');

      // Assert
      expect(result).toBe('');
    });

    test('should return "Invalid DateTime" if wrong date is provided', () => {
      // Act
      const result = formatDateToGivenZoneAndFormat(
        '20024-06-11T11:30:00Z',
        'Europe/Bucharest',
      );

      // Assert
      expect(result).toBe('Invalid DateTime');
    });

    test('should format date and time to the specified time zone', () => {
      // Arrange
      const expectedDateTime = '11-06-2024 14:30';

      // Act
      const result = formatDateToGivenZoneAndFormat(
        '2024-06-11T11:30:00Z',
        'Europe/Bucharest',
      );

      // Assert
      expect(result).toBe(expectedDateTime);
    });

    test('should format date and time to the specified time zone and format string', () => {
      // Arrange
      const expectedFormat = 'July 06, 2017 22:50';
      const displayFormat = 'MMMM dd, yyyy HH:mm';

      // Act
      const result = formatDateToGivenZoneAndFormat(
        '2017-07-06T19:50:00Z',
        'Europe/Bucharest',
        displayFormat,
      );

      // Assert
      expect(result).toBe(expectedFormat);
    });
  });

  describe('formatDateToGivenZoneAndLocale', () => {
    test('should return the date in the local "Europe/Bucharest" format', () => {
      // Assert
      const expectedDateTime = '20.06.2024';
      const inputDate = '2024-06-20T00:00:00Z';
      const timeZone = 'Europe/Bucharest';
      const locale = 'ro-RO';

      // Act
      const result = formatDateToGivenZoneAndLocale(
        inputDate,
        timeZone,
        locale,
      );

      // Assert
      expect(result).toBe(expectedDateTime);
    });

    test('should return the date in the local "Europe/London" format', () => {
      // Assert
      const expectedDateTime = '20/06/2024';
      const inputDate = '2024-06-20T00:00:00Z';
      const timeZone = 'Europe/London';
      const locale = 'en-GB';

      // Act
      const result = formatDateToGivenZoneAndLocale(
        inputDate,
        timeZone,
        locale,
      );

      // Assert
      expect(result).toBe(expectedDateTime);
    });

    test('should return the date in the local "America/Los_Angeles" format', () => {
      // Assert
      const expectedDateTime = '6/19/2024';
      const inputDate = '2024-06-20T00:00:00Z';
      const timeZone = 'America/Los_Angeles';
      const locale = 'en-US';

      // Act
      const result = formatDateToGivenZoneAndLocale(
        inputDate,
        timeZone,
        locale,
      );

      // Assert
      expect(result).toBe(expectedDateTime);
    });
  });

  describe('calculateWeekRange', () => {
    const mockDate = (dateString: string) => {
      const mockDateInstance = new Date(dateString);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDateInstance);
    };

    beforeEach(() => {
      mockDate('2024-10-30');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should return the same Monday for a date that is a Monday', () => {
      // Arrange
      const inputDate = new Date('2024-10-21');
      const expectedStart = new Date('2024-10-21');
      const expectedEnd = new Date('2024-10-27');

      // Act
      const result = calculateWeekRange(inputDate);

      // Assert
      expect(result[0].toDateString()).toBe(expectedStart.toDateString());
      expect(result[1].toDateString()).toBe(expectedEnd.toDateString());
    });

    test('should return today as the start of the week and the next Sunday when the input date is a Sunday', () => {
      // Arrange
      const inputDate = new Date('2024-10-20');
      const expectedStart = new Date('2024-10-24');
      const expectedEnd = new Date('2024-10-30');

      // Act
      const result = calculateWeekRange(inputDate);

      // Assert
      expect(result[0].toDateString()).toBe(expectedStart.toDateString());
      expect(result[1].toDateString()).toBe(expectedEnd.toDateString());
    });

    test('should return the correct week range for a weekday', () => {
      // Arrange
      const inputDate = new Date('2024-10-23');
      const expectedStart = new Date('2024-10-24');
      const expectedEnd = new Date('2024-10-30');

      // Act
      const result = calculateWeekRange(inputDate);

      // Assert
      expect(result[0].toDateString()).toBe(expectedStart.toDateString());
      expect(result[1].toDateString()).toBe(expectedEnd.toDateString());
    });

    test('should return today as the start of the week if calculated start is in the past', () => {
      // Arrange
      const inputDate = new Date('2024-01-01'); // A past date
      const today = new Date('2024-10-24'); // Mocked current date
      const expectedStart = new Date(today.setHours(0, 0, 0, 0)); // Start of today
      const expectedEnd = new Date(expectedStart);
      expectedEnd.setDate(
        expectedStart.getDate() + (7 - expectedStart.getDay()),
      );

      // Act
      const result = calculateWeekRange(inputDate);

      // Assert
      expect(result[0].toDateString()).toBe(expectedStart.toDateString());
      expect(result[1].toDateString()).toBe(expectedEnd.toDateString());
    });

    test('should return today as the start of the week when the input date is today', () => {
      // Arrange
      const inputDate = new Date();
      const expectedStart = new Date(inputDate.setHours(0, 0, 0, 0));
      const expectedEnd = new Date(expectedStart);
      expectedEnd.setDate(
        expectedStart.getDate() + (7 - expectedStart.getDay()),
      );

      // Act
      const result = calculateWeekRange(inputDate);

      // Assert
      expect(result[0].toDateString()).toBe(expectedStart.toDateString());
      expect(result[1].toDateString()).toBe(expectedEnd.toDateString());
    });
  });

  describe('getDateMinusDays', () => {
    test('should return a date object representing the specified days ago', () => {
      // Arrange
      const daysOffset = 90;
      const currentDate = new Date();
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(currentDate.getDate() - daysOffset);

      // Act
      const result = getDateMinusDays(daysOffset);

      // Assert
      expect(result.toDateString()).toBe(expectedDate.toDateString());
    });

    test('should handle a zero offset correctly', () => {
      // Arrange
      const daysOffset = 0;
      const currentDate = new Date();

      // Act
      const result = getDateMinusDays(daysOffset);

      // Assert
      expect(result.toDateString()).toBe(currentDate.toDateString());
    });

    test('should handle a negative offset (future dates)', () => {
      // Arrange
      const daysOffset = -10;
      const currentDate = new Date();
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(currentDate.getDate() - daysOffset);

      // Act
      const result = getDateMinusDays(daysOffset);

      // Assert
      expect(result.toDateString()).toBe(expectedDate.toDateString());
    });

    test('should return a valid Date object for large offsets', () => {
      // Arrange
      const daysOffset = 365;
      const currentDate = new Date();
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(currentDate.getDate() - daysOffset);

      // Act
      const result = getDateMinusDays(daysOffset);

      // Assert
      expect(result).toBeInstanceOf(Date);
      expect(Number.isNaN(result.getTime())).toBe(false);
      expect(result.toDateString()).toBe(expectedDate.toDateString());
    });
  });

  describe('getMonthStartEnd', () => {
    test('should transform month name into the JavaScript Date objects (timezone-independent)', () => {
      // Arrange
      const currentYear = DateTime.now().year;
      const testCases = ['January', 'february', 'MARCH'];

      const expectedResults = [
        {
          start: new Date(currentYear, 0, 1),
          end: new Date(currentYear, 0, 31, 23, 59, 59, 999),
        },
        {
          start: new Date(currentYear, 1, 1),
          end: new Date(
            currentYear,
            1,
            currentYear % 4 === 0 ? 29 : 28,
            23,
            59,
            59,
            999,
          ),
        },
        {
          start: new Date(currentYear, 2, 1),
          end: new Date(currentYear, 2, 31, 23, 59, 59, 999),
        },
      ];

      testCases.forEach((month, index) => {
        // Act
        const result = getMonthStartEnd(month);

        // Assert
        expect(result.startDate.getTime()).toBe(
          expectedResults[index].start.getTime(),
        );
        expect(result.endDate.getTime()).toBe(
          expectedResults[index].end.getTime(),
        );
      });
    });

    test('should throw error for an invalid month name', () => {
      expect(() => getMonthStartEnd('aprill')).toThrow(
        'Invalid month name: "aprill"',
      );
    });
  });

  describe('getDateWithoutTimezone', () => {
    test('should return formated data without timezone', () => {
      // Arrange
      const date = new Date('Sat Jun 14 2025');

      // Act
      const result = getDateWithoutTimezone(date);

      // Assert
      expect(result).toBe('2025-06-14T00:00:00.000Z');
    });
  });
});
