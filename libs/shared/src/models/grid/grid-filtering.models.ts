export interface FilterOptions {
  [key: string]: { label: string; value: string }[];
}

export interface FilteringConfig {
  [key: string]: Filter;
}

export interface Filter {
  value: FilterValue[];
  matchMode: FilterMode;
  operator: FilterOperator;
}

export interface FilterValue {
  label: string;
  value: any;
}

export interface IndividualFilter {
  label: string;
  value: string;
}

export enum FilterMode {
  In = 'in',
  DateAfter = 'dateAfter',
  DateBefore = 'dateBefore',
  StartsWidth = 'startsWith',
}

export enum FilterOperator {
  And = 'and',
  Or = 'or',
}

export interface FilterToRemove {
  fieldName: string;
  filterValue: string;
}
