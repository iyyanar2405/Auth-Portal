/* eslint-disable prettier/prettier */
import { GridConfig, GridLazyLoadEvent } from '../../models';
import { GridConfigProcessor } from './grid-config.processor';
import { createFilteringConfig } from './grid-filtering.helpers';
import { createPaginationConfig } from './grid-pagination.helpers';
import { createSortingConfig } from './grid-sorting.helpers';

export const createGridConfig = (event: GridLazyLoadEvent): GridConfig => ({
  sorting: createSortingConfig(event),
  pagination: createPaginationConfig(event),
  filtering: createFilteringConfig(event),
});

export const applyGridConfig = <T extends Record<string, any>>(
  data: T[],
  config: GridConfig,
): T[] =>
  new GridConfigProcessor(data, config)
    .applyFilters()
    .applySorting()
    .applyPagination();

export const applyGridConfigWithoutPagination = <T extends Record<string, any>>(
  data: T[],
  config: GridConfig,
): T[] =>
  new GridConfigProcessor(data, config).applyFilters().applySorting().getData();

export const getNumberOfFilteredRecords = <T extends Record<string, any>>(
  data: T[],
  config: GridConfig,
): number =>
  new GridConfigProcessor(data, config).applyFilters().getData().length;
