import { TimeRange } from '../../models';

const getMonthCurrent = () => new Date().getUTCMonth();

const getYearCurrent = () => new Date().getUTCFullYear();

export const getTimeRange = (range: TimeRange) => {
  const date = new Date().setUTCHours(0, 0, 0);

  switch (range) {
    case TimeRange.MonthPrevious:
      return [
        new Date(new Date(date).setUTCMonth(getMonthCurrent() - 1, 1)),
        new Date(new Date(date).setUTCMonth(getMonthCurrent(), 0)),
      ];
    case TimeRange.MonthCurrent:
      return [
        new Date(new Date(date).setUTCMonth(getMonthCurrent(), 1)),
        new Date(new Date(date).setUTCMonth(getMonthCurrent() + 1, 0)),
      ];
    case TimeRange.MonthNext:
      return [
        new Date(new Date(date).setUTCMonth(getMonthCurrent() + 1, 1)),
        new Date(new Date(date).setUTCMonth(getMonthCurrent() + 2, 0)),
      ];
    case TimeRange.YearPrevious:
      return [
        new Date(new Date(date).setUTCFullYear(getYearCurrent() - 1, 0, 1)),
        new Date(new Date(date).setUTCFullYear(getYearCurrent(), 0, 0)),
      ];
    case TimeRange.YearCurrent:
      return [
        new Date(new Date(date).setUTCFullYear(getYearCurrent(), 0, 1)),
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 1, 0, 0)),
      ];
    case TimeRange.YearNext:
      return [
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 1, 0, 1)),
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 2, 0, 0)),
      ];
    case TimeRange.YearCustom:
      return [
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 1 - 4, 0, 1)),
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 2 - 1, 0, 0)),
      ];
    case TimeRange.Custom:
      return [
        new Date(new Date(date).setUTCFullYear(getYearCurrent() - 3, 0, 1)),
        new Date(new Date(date).setUTCFullYear(getYearCurrent() + 1, 0, 0)),
      ];
    default:
      return [];
  }
};
