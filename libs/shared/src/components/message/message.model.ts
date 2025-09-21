export interface MessageModel {
  severity: MessageSeverity;
  summary: string;
  showCloseButton: boolean;
  detail?: string;
  label?: string;
}

export enum MessageSeverity {
  Success = 'success',
  Info = 'info',
  Alert = 'alert',
  Warn = 'warn',
  Error = 'error',
}
