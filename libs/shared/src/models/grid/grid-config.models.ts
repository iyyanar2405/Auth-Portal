import { FilteringConfig } from './grid-filtering.models';
import { PaginationConfig } from './grid-pagination.models';
import { SortingConfig } from './grid-sorting.models';

export interface GridConfig {
  sorting: SortingConfig;
  pagination: PaginationConfig;
  filtering: FilteringConfig;
}
