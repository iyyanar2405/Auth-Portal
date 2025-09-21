import { GridLazyLoadEvent, PaginationConfig } from '../../models';

const DEFAULT_GRID_START_INDEX = 0;
const DEFAULT_GRID_PAGE_SIZE = 10;

export const createPaginationConfig = (
  event: GridLazyLoadEvent,
): PaginationConfig => {
  const { first, rows, paginationEnabled } = event;

  return {
    paginationEnabled,
    startIndex: first || DEFAULT_GRID_START_INDEX,
    pageSize: rows || DEFAULT_GRID_PAGE_SIZE,
  };
};

export const applyPagination = <T extends Record<string, any>>(
  data: T[],
  config: PaginationConfig,
): T[] => {
  const { pageSize, startIndex, paginationEnabled } = config;

  if (!paginationEnabled || data.length === 0) {
    return data;
  }

  const start = Math.max(0, startIndex);
  const end = Math.min(data.length, start + pageSize);

  return data.slice(start, end);
};
