import { FilterTypeModel } from './filter-type.model';

export interface PreferenceDataModel {
  filters: FilterTypeModel;
  rowsPerPage: number;
  columns: any[];
  showDefaultColumnsButton: boolean;
}
