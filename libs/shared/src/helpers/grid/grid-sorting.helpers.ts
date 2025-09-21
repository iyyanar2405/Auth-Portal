import { DateTime } from 'luxon';
import { TableLazyLoadEvent } from 'primeng/table';

import { DEFAULT_DATE_FORMAT } from '../../constants';
import {
  SortingConfig,
  SortingDirection,
  SortingMode,
  SortingRule,
} from '../../models';

const DATE_REGEX = /^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;

const isDate = <T>(value: T) =>
  typeof value === 'string' && DATE_REGEX.test(value);

const isNullOrEmpty = <T>(value: T) => value == null || value === '';

const compareValues = <T>(a: T, b: T, direction: SortingDirection): number => {
  const order = direction === SortingDirection.Ascending ? 1 : -1;

  if (isNullOrEmpty(a) && !isNullOrEmpty(b)) return 1 * order;
  if (!isNullOrEmpty(a) && isNullOrEmpty(b)) return -1 * order;
  if (isNullOrEmpty(a) && isNullOrEmpty(b)) return 0;

  if (isDate(a) && isDate(b)) {
    const dateA = DateTime.fromFormat(a as string, DEFAULT_DATE_FORMAT);
    const dateB = DateTime.fromFormat(b as string, DEFAULT_DATE_FORMAT);

    if (dateA.isValid && dateB.isValid) {
      if (dateA < dateB) return -1 * order;
      if (dateA > dateB) return 1 * order;

      return 0;
    }
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b) * order;
  }

  if (a < b) return -1 * order;
  if (a > b) return 1 * order;

  return 0;
};

export const sortData = <T extends Record<string, any>>(
  data: T[],
  config: SortingConfig,
): T[] => {
  if (data.length === 0 || config.rules.length === 0) return data;

  const { mode, rules } = config;

  if (mode === SortingMode.Single) {
    const { field, direction } = rules[0];

    return data
      .slice()
      .sort((a, b) => compareValues(a[field], b[field], direction));
  }

  return data.slice().sort((a, b) =>
    rules.reduce((comparison, { field, direction }) => {
      if (comparison !== 0) return comparison;

      return compareValues(a[field], b[field], direction);
    }, 0),
  );
};

export const createSortingConfig = (
  event: TableLazyLoadEvent,
): SortingConfig => {
  const { sortField, multiSortMeta, sortOrder } = event;

  const mode =
    sortField !== undefined && !multiSortMeta
      ? SortingMode.Single
      : SortingMode.Multiple;

  if (!sortField && !multiSortMeta) {
    return {
      mode: SortingMode.Single,
      rules: [],
    };
  }

  let rules: SortingRule[] = [];

  if (mode === SortingMode.Single && sortField && sortOrder !== undefined) {
    rules = [
      {
        field: sortField as string,
        direction:
          sortOrder === 1
            ? SortingDirection.Ascending
            : SortingDirection.Descending,
      },
    ];
  } else if (mode === SortingMode.Multiple && multiSortMeta?.length) {
    rules = multiSortMeta
      .filter((meta) => meta.field && meta.order !== undefined)
      .map((meta) => ({
        field: meta.field as string,
        direction:
          meta.order === 1
            ? SortingDirection.Ascending
            : SortingDirection.Descending,
      }));
  }

  return { mode, rules };
};
