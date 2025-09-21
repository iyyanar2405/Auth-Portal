export interface ColumnDefinition {
  field: string;
  displayName: string;
  type: ColumnType;
  cellType: CellType;
  hidden: boolean;
  fixed: boolean;
  sticky: boolean;
  hideFromColumnManagement?: boolean;
  customClass?: string;
  width?: string;
  routeIdField?: string;
}

export enum ColumnType {
  Actions = 'actions',
  Checkbox = 'checkbox',
  CheckboxFilter = 'checkboxFilter',
  DateFilter = 'dateFilter',
  EventActions = 'eventActions',
  SearchCheckboxFilter = 'searchCheckboxFilter',
  TextSearchFilter = 'textSearchFilter',
  Text = 'text',
}

export enum CellType {
  Actions = 'actions',
  Checkbox = 'checkbox',
  Date = 'date',
  DateWithIcon = 'dateWithIcon',
  EventActions = 'eventActions',
  Link = 'link',
  Status = 'status',
  Tag = 'tag',
  Text = 'text',
  FullText = 'fullText',
  TextWithIcon = 'textWithIcon',
  CustomTemplate = 'customTemplate',
  HtmlText = 'htmlText',
}
