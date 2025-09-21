import { TableLazyLoadEvent } from 'primeng/table';

export interface GridLazyLoadEvent extends TableLazyLoadEvent {
  paginationEnabled: boolean;
}
