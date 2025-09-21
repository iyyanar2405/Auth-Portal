export enum ToastSeverity {
  Success = 'success',
  Info = 'info',
  Error = 'error',
  Warn = 'warn',
  Alert = 'alert',
  UploadSuccess = 'uploadSuccess',
  UploadError = 'uploadError',
  DeleteSuccess = 'deleteSuccess',
  DeleteError = 'deleteError',
  DownloadError = 'downloadError',
  DownloadSuccess = 'downloadSuccess',
  DownloadStart = 'downloadStart',
  ExportFail = 'exportFail',
  FormIsMandatory = 'formIsMandatory',
  DataSubmitSuccess = 'dataSubmitSuccess',
  SomethingWentWrong = 'somethingWentWrong',
}

export enum ToastSeverityIcons {
  CheckCircle = 'pi-check-circle',
  InfoCircle = 'pi-info-circle',
  ExclamationCircle = 'pi-exclamation-circle',
  ExclamationTriangle = 'pi-exclamation-triangle',
}

// TODO: To be changed
export enum ToastSeveritySummary {
  Success = 'Success',
  Info = 'Info',
  Error = 'Error',
  Warn = 'Warn',
  Alert = 'Alert',
  UploadSuccess = 'uploadSuccess',
  UploadError = 'uploadError',
  DeleteSuccess = 'Document is deleted.',
  DeleteError = 'Document is not deleted.',
  DownloadStart = 'Download starts shortly',
  DownloadError = 'Download has failed.',
  DownloadSuccess = 'Download is ready.',
  ExportFail = 'Your download failed. Please try again.',
  FormIsMandatory = 'All fields are mandatory',
  DataSubmitSuccess = 'Data submitted successfully',
  SomethingWentWrong = 'Something went wrong! Please try again.',
}

export interface ToastOptionModel {
  severity: ToastSeverity;
  summary: ToastSeveritySummary;
  icon: ToastSeverityIcons;
}
