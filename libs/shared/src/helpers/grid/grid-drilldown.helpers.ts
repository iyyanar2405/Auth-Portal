import { DateTime } from 'luxon';

import { DEFAULT_DATE_FORMAT } from '../../constants';
import {
  FilterMode,
  FilterOperator,
  FilterValue,
  GridConfig,
} from '../../models';
import { dateToFormat } from '../date/date.helpers';

export const checkIsDateType = (s: string | Date): boolean =>
  typeof s !== 'string';

// TODO: refactor this
const isDateRange = (value: any[]): boolean =>
  value.length === 2 &&
  DateTime.fromFormat(value[0].value, DEFAULT_DATE_FORMAT).isValid &&
  DateTime.fromFormat(value[1].value, DEFAULT_DATE_FORMAT).isValid;

export const createFilter = (
  filterKey: string,
  filterValue: string,
): FilterValue => ({
  label: filterKey,
  value: [
    {
      label: filterValue,
      value: filterValue,
    },
  ],
});

export const formatFilter = (
  payload: string[] | Date[],
  type: string,
): FilterValue[] => {
  const formattedFilter = payload.map((item) => {
    const value = checkIsDateType(item) ? dateToFormat(item as Date) : item;

    return { label: value, value };
  });

  return [{ label: type, value: formattedFilter }];
};

export const extractAppliedFilters = (
  available: any[],
  selected: number[],
  label: string,
): FilterValue[] => {
  const matchedLabels = available
    .filter((item) => selected.includes(item.value))
    .map((item) => item.label);

  return formatFilter(matchedLabels, label);
};

export const updateGridConfigBasedOnFilters = (
  gridConfig: GridConfig,
  filters: FilterValue[],
): GridConfig => {
  const updatedFiltering = { ...gridConfig.filtering };

  filters.forEach(({ label, value }) => {
    updatedFiltering[label] = {
      matchMode: isDateRange(value) ? FilterMode.DateBefore : FilterMode.In,
      operator: FilterOperator.And,
      value: updatedFiltering[label]
        ? [...updatedFiltering[label].value, ...value]
        : [...value],
    };
  });

  const updatedGridConfig = {
    ...gridConfig,
    filtering: updatedFiltering,
  };

  return updatedGridConfig;
};

const filterByDepth = (data: any[], depth: number) =>
  Array.from(
    new Set(
      data.filter((item) => item.depth === depth).map((item) => item.label),
    ),
  );

export const extractLocationChartFilters = (
  data: any[],
): {
  countries: string[];
  cities: string[];
  sites: string[];
} => ({
  countries: filterByDepth(data, 0),
  cities: filterByDepth(data, 1),
  sites: filterByDepth(data, 2),
});
