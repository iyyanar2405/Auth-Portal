import { TOAST_OPTIONS_MAP } from '../../constants';
import { ToastOptionModel, ToastSeverity } from '../../models';

export const getToastContentBySeverity = (
  severity: ToastSeverity,
): ToastOptionModel => TOAST_OPTIONS_MAP[severity];
