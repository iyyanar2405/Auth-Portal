export interface SortingConfig {
  mode: SortingMode;
  rules: SortingRule[];
}

export enum SortingMode {
  Single = 'single',
  Multiple = 'multiple',
}

export enum SortingDirection {
  Ascending = 'ascending',
  Descending = 'descending',
}

export interface SortingRule {
  field: string;
  direction: SortingDirection;
}
