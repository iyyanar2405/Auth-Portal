export interface GridEventAction {
  id: number | string;
  actionType: GridEventActionType;
}

export enum GridEventActionType {
  Confirm = 'confirm',
  Reschedule = 'reschedule',
  ShareInvite = 'shareInvite',
  AddToCalendar = 'addToCalendar',
  UpdateReferenceNumber = 'updateReferenceNumber',
  UpdatePlannedPaymentDate = 'updatePlannedPaymentDate',
  Remove = 'remove',
  ManagePermissions = 'managePermissions',
  RequestChanges = 'requestChanges',
  ViewPortalAs = 'viewPortalAs',
}
