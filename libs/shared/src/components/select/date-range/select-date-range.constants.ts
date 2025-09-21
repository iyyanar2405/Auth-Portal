import { TimeRange } from '../../../models';

export const SHARED_SELECT_DATE_RANGE_LABEL_FORMAT = 'dd-MM-yyyy';
export const SHARED_SELECT_DATE_RANGE_OPTION_HEIGHT_PX = 40;
export const SHARED_SELECT_DATE_RANGE_SCROLL_BAR_LIMIT = 5;
export const SHARED_SELECT_DATE_RANGE_SCROLL_PADDING_PX = 16;
export const SHARED_SELECT_DATE_RANGE_SCROLL_HEIGHT_PX =
  SHARED_SELECT_DATE_RANGE_OPTION_HEIGHT_PX *
    SHARED_SELECT_DATE_RANGE_SCROLL_BAR_LIMIT +
  SHARED_SELECT_DATE_RANGE_SCROLL_PADDING_PX;

export const SHARED_SELECT_DATE_RANGE_DEFAULT_DATA: TimeRange[] = [
  TimeRange.YearCurrent,
  TimeRange.MonthPrevious,
  TimeRange.MonthCurrent,
  TimeRange.MonthNext,
  TimeRange.Custom,
];
