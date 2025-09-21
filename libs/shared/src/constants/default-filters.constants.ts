import { ColumnType, Filter, FilterMode, FilterOperator } from '../models';

export const DEFAULT_FILTERS_MAP: Partial<Record<ColumnType, Filter>> = {
  [ColumnType.CheckboxFilter]: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [],
  },
  [ColumnType.SearchCheckboxFilter]: {
    matchMode: FilterMode.In,
    operator: FilterOperator.And,
    value: [],
  },
  [ColumnType.DateFilter]: {
    matchMode: FilterMode.DateAfter,
    operator: FilterOperator.And,
    value: [],
  },
};
