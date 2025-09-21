import { GridConfig } from '../../models';
import { filterData } from './grid-filtering.helpers';
import { applyPagination } from './grid-pagination.helpers';
import { sortData } from './grid-sorting.helpers';

export class GridConfigProcessor<T extends Record<string, any>> {
  private data: T[];
  private config: GridConfig;

  constructor(data: T[], config: GridConfig) {
    this.data = data;
    this.config = config;
  }

  applyFilters(): this {
    this.data = filterData(this.data, this.config.filtering);

    return this;
  }

  applyPagination(): T[] {
    return applyPagination(this.data, this.config.pagination);
  }

  applySorting(): this {
    this.data = sortData(this.data, this.config.sorting);

    return this;
  }

  getData(): T[] {
    return this.data;
  }
}
