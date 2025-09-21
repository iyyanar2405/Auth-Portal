import { BLANK_FILTER, COLUMN_DELIMITER } from '../../constants';
import { FilterableColumnDefinition, GridConfig } from '../../models';
import { applyGridConfigWithoutPagination } from './grid-config.helpers';
import { getActiveFilters } from './grid-filtering.helpers';

export const getFilterOptionsForColumn = <T>(
  dataList: T[],
  col: string,
  delimiter?: string,
) => {
  const allFilterOptions = dataList.map((el: T) => (el as any)[col]);
  let columnSet = allFilterOptions.filter((v) => v);

  const hasColumn = dataList.some((el) => col in (el as any));

  const hasEmptyValues =
    hasColumn &&
    allFilterOptions.some(
      (value) => value === '' || value === null || value === undefined,
    );

  if (delimiter) {
    columnSet = columnSet
      .flatMap((value: any) => value.toString().split(delimiter))
      .map((el) => el.trim());
  }

  const notEmptyColumnSet = columnSet.filter((value) => value !== '');
  const uniqueData = [...new Set(notEmptyColumnSet)];

  const uniqueDataMapped = uniqueData.map((el) => ({
    label: el.toString(),
    value: el,
  }));

  return !hasEmptyValues
    ? uniqueDataMapped
    : [...uniqueDataMapped, { label: BLANK_FILTER, value: BLANK_FILTER }];
};

export const getFilterOptions = <T extends Record<string, any>>(
  data: T[],
  gridConfig: GridConfig,
  columnDefinitions: FilterableColumnDefinition[],
): Record<string, any> => {
  if (!columnDefinitions.length) return {};

  const filterOptions: Record<string, any> = {};

  const activeFilters = getActiveFilters(gridConfig.filtering);

  const filteredItems = applyGridConfigWithoutPagination(data, gridConfig);

  columnDefinitions.forEach(({ field, hasColumnDelimiter }) => {
    const delimiter = hasColumnDelimiter ? COLUMN_DELIMITER : undefined;
    filterOptions[field] = getFilterOptionsForColumn(
      filteredItems,
      field,
      delimiter,
    );
  });

  // If only one active filter exists, recalculate its options based on unfiltered data
  if (activeFilters.length === 1) {
    const activeFilterField = activeFilters[0];
    const activeColumnDefinition = columnDefinitions.find(
      (columnDefinition) => columnDefinition.field === activeFilterField,
    )!;
    filterOptions[activeFilterField] = getFilterOptionsForColumn(
      data,
      activeFilterField,
      activeColumnDefinition?.hasColumnDelimiter ? COLUMN_DELIMITER : undefined,
    );
  }

  return filterOptions;
};
