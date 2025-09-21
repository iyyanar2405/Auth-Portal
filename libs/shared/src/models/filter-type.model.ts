import { FilterMetadata } from 'primeng/api';

export interface FilterTypeModel {
  [key: string]: FilterMetadata | FilterMetadata[];
}
