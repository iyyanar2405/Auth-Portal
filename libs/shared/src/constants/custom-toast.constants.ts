import {
  ToastOptionModel,
  ToastSeverity,
  ToastSeverityIcons,
  ToastSeveritySummary,
} from '../models/custom-toast.model';

export const TOAST_OPTIONS_MAP: { [key: string]: ToastOptionModel } = {
  [ToastSeverity.Success]: {
    severity: ToastSeverity.Success,
    summary: ToastSeveritySummary.Success,
    icon: ToastSeverityIcons.CheckCircle,
  },
  [ToastSeverity.Info]: {
    severity: ToastSeverity.Info,
    summary: ToastSeveritySummary.Info,
    icon: ToastSeverityIcons.InfoCircle,
  },
  [ToastSeverity.Error]: {
    severity: ToastSeverity.Error,
    summary: ToastSeveritySummary.Error,
    icon: ToastSeverityIcons.ExclamationCircle,
  },
  [ToastSeverity.Warn]: {
    severity: ToastSeverity.Warn,
    summary: ToastSeveritySummary.Warn,
    icon: ToastSeverityIcons.ExclamationCircle,
  },
  [ToastSeverity.Alert]: {
    severity: ToastSeverity.Alert,
    summary: ToastSeveritySummary.Alert,
    icon: ToastSeverityIcons.ExclamationTriangle,
  },
  [ToastSeverity.UploadSuccess]: {
    severity: ToastSeverity.Success,
    summary: ToastSeveritySummary.UploadSuccess,
    icon: ToastSeverityIcons.CheckCircle,
  },
  [ToastSeverity.UploadError]: {
    severity: ToastSeverity.Error,
    summary: ToastSeveritySummary.UploadError,
    icon: ToastSeverityIcons.ExclamationCircle,
  },
  [ToastSeverity.DeleteSuccess]: {
    severity: ToastSeverity.Success,
    summary: ToastSeveritySummary.DeleteSuccess,
    icon: ToastSeverityIcons.CheckCircle,
  },
  [ToastSeverity.DeleteError]: {
    severity: ToastSeverity.Error,
    summary: ToastSeveritySummary.DeleteError,
    icon: ToastSeverityIcons.ExclamationCircle,
  },
  [ToastSeverity.DownloadError]: {
    severity: ToastSeverity.Error,
    summary: ToastSeveritySummary.DownloadError,
    icon: ToastSeverityIcons.ExclamationCircle,
  },
  [ToastSeverity.DownloadSuccess]: {
    severity: ToastSeverity.Success,
    summary: ToastSeveritySummary.DownloadSuccess,
    icon: ToastSeverityIcons.CheckCircle,
  },
  [ToastSeverity.DownloadStart]: {
    severity: ToastSeverity.Success,
    summary: ToastSeveritySummary.DownloadStart,
    icon: ToastSeverityIcons.CheckCircle,
  },
  [ToastSeverity.ExportFail]: {
    severity: ToastSeverity.Error,
    summary: ToastSeveritySummary.ExportFail,
    icon: ToastSeverityIcons.ExclamationCircle,
  },
  [ToastSeverity.FormIsMandatory]: {
    severity: ToastSeverity.Warn,
    summary: ToastSeveritySummary.FormIsMandatory,
    icon: ToastSeverityIcons.ExclamationCircle,
  },
  [ToastSeverity.DataSubmitSuccess]: {
    severity: ToastSeverity.Success,
    summary: ToastSeveritySummary.DataSubmitSuccess,
    icon: ToastSeverityIcons.CheckCircle,
  },
  [ToastSeverity.SomethingWentWrong]: {
    severity: ToastSeverity.Error,
    summary: ToastSeveritySummary.SomethingWentWrong,
    icon: ToastSeverityIcons.ExclamationCircle,
  },
};
