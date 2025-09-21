/* eslint-disable no-param-reassign */
import { DateTime } from 'luxon';
import { TableLazyLoadEvent } from 'primeng/table';

import {
  BLANK_FILTER,
  COLUMN_DELIMITER,
  DEFAULT_DATE_FORMAT,
} from '../../constants';
import { Filter, FilteringConfig, FilterMode, FilterValue } from '../../models';

export const createFilteringConfig = (
  event: TableLazyLoadEvent,
): FilteringConfig => {
  const { filters } = event;

  if (filters) {
    return Object.keys(filters).reduce(
      (filtered: FilteringConfig, key: string) => {
        const filter = filters[key];

        if (Array.isArray(filter)) {
          const nonNullValues = filter.filter((f) => f.value !== null);

          if (nonNullValues.length > 0) {
            const firstNonNullValue = nonNullValues[0];
            filtered[key] = {
              matchMode: firstNonNullValue.matchMode as string,
              operator: firstNonNullValue.operator as string,
              value: Array.isArray(firstNonNullValue.value)
                ? firstNonNullValue.value
                : [firstNonNullValue.value],
            } as Filter;
          }
        } else if (filter && filter.value !== null) {
          filtered[key] = {
            value: filter.value,
            matchMode: filter.matchMode,
            operator: filter.operator,
          } as Filter;
        }

        return filtered;
      },
      {},
    );
  }

  return {};
};

export const applyInFilter = (itemValue: any, filter: Filter): boolean => {
  const filterValues = filter.value.map((v) =>
    v.value === BLANK_FILTER ? '' : v.value.trim(),
  );

  if (!itemValue) {
    itemValue = '';
  }

  const splitValues: string[] = itemValue.toString().split(COLUMN_DELIMITER);

  return (
    filterValues.length === 0 ||
    splitValues.some((splitValue) => filterValues.includes(splitValue.trim()))
  );
};

const applySearchFilter = (itemValue: any, filter: Filter): boolean => {
  const filterValue = filter.value[0];

  if (!itemValue) {
    itemValue = '';
  }

  return (
    filter.value.length === 0 ||
    itemValue.toLowerCase().startsWith(filterValue.value.toLowerCase())
  );
};

export const applySingleDateFilter = (
  itemValue: any,
  filterValue: any,
): boolean => {
  const rowDate = DateTime.fromFormat(itemValue, DEFAULT_DATE_FORMAT);
  const filterDate = DateTime.fromFormat(
    filterValue[0].value,
    DEFAULT_DATE_FORMAT,
  );

  return filterDate.equals(rowDate);
};

export const applyDateRangeFilter = (
  itemValue: any,
  filterValue: any,
): boolean => {
  const rowDate = DateTime.fromFormat(itemValue, DEFAULT_DATE_FORMAT);
  const startFilterDate = DateTime.fromFormat(
    filterValue[0].value,
    DEFAULT_DATE_FORMAT,
  );
  const endFilterDate = DateTime.fromFormat(
    filterValue[1].value,
    DEFAULT_DATE_FORMAT,
  );

  return startFilterDate <= rowDate && rowDate <= endFilterDate;
};

const applyDateFilter = (itemValue: any, filter: Filter): boolean => {
  const filterValue = filter.value.map((value) =>
    value.value === BLANK_FILTER ? { value: '' } : value,
  );

  if (filterValue.length === 1 && filterValue[0].value === '') {
    return filterValue[0].value === itemValue;
  }

  if (!filterValue || filterValue.length === 1)
    return applySingleDateFilter(itemValue, filterValue);

  if (!filterValue || filterValue.length !== 2) return true;

  if (filterValue.some((v) => v === null)) return true;

  return applyDateRangeFilter(itemValue, filterValue);
};

const filterHandlers = {
  [FilterMode.In]: applyInFilter,
  [FilterMode.DateAfter]: applyDateFilter,
  [FilterMode.DateBefore]: applyDateFilter,
  [FilterMode.StartsWidth]: applySearchFilter,
};

const applyFilter = (itemValue: any, filter: Filter): boolean => {
  const filterHandler = filterHandlers[filter.matchMode];

  if (filterHandler) {
    return filterHandler(itemValue, filter);
  }

  return true;
};

export const filterData = <T extends Record<string, any>>(
  data: T[],
  config: FilteringConfig,
): T[] => {
  const filteredData = data.filter((item) =>
    Object.keys(config).every((key) => applyFilter(item[key], config[key])),
  );

  return filteredData;
};

export const isAnyFilterActive = (config: FilteringConfig): boolean =>
  Object.keys(config).some((key) => {
    const filter = config[key];

    return Array.isArray(filter.value) && filter.value.length > 0;
  });

export const getActiveFilters = (config: FilteringConfig): string[] =>
  Object.keys(config).filter((key) => {
    const filter = config[key];

    return Array.isArray(filter.value) && filter.value.length > 0;
  });

const mapBlankValue = (filter: Filter): string[] | null => {
  const filterMapValue = {
    [FilterMode.In]: ['null'],
    [FilterMode.DateAfter]: ['01-01-0001', '01-01-0001'],
    [FilterMode.DateBefore]: ['01-01-0001', '01-01-0001'],
    [FilterMode.StartsWidth]: null,
  };

  return filterMapValue[filter.matchMode];
};

const hasBlankValue = (values: FilterValue[]): boolean =>
  values.some((v) => v.value === BLANK_FILTER);

export const mapFilterConfigToValues = (
  filterConfig: FilteringConfig,
  filterName: string,
  emptyValue: null | [] = null,
  convertFunc?: any,
) => {
  if (!filterConfig[filterName]) {
    return emptyValue;
  }

  const values = filterConfig[filterName].value;

  if (values && !values.length) {
    return emptyValue;
  }

  if (hasBlankValue(filterConfig[filterName].value)) {
    return mapBlankValue(filterConfig[filterName]);
  }

  return values.map((value) =>
    convertFunc ? convertFunc(value.value) : value.value,
  );
};

export const compareFilterEquality = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;

  if (
    (Array.isArray(obj1) && obj1.length === 0 && obj2 === null) ||
    (obj1 === null && Array.isArray(obj2) && obj2.length === 0)
  ) {
    return true;
  }

  if (
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object' ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    return obj1.every((item1) =>
      obj2.some((item2) => compareFilterEquality(item1, item2)),
    );
  }

  const commonKeys = Object.keys(obj1).filter((key) =>
    Object.keys(obj2).includes(key),
  );

  return commonKeys.every((key) => compareFilterEquality(obj1[key], obj2[key]));
};
