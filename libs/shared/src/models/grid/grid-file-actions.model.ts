export interface GridFileAction {
  label: string;
  iconClass: string;
  url?: string;
  actionType: GridFileActionType;
}

export enum GridFileActionType {
  Download = 'download',
  Delete = 'delete',
  Redirect = 'redirect',
}

export interface GridFileActionEvent {
  url?: string;
  actionType: GridFileActionType;
}
