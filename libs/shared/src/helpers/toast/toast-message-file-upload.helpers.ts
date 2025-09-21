import { TranslocoService } from '@jsverse/transloco';
import { Message, MessageService } from 'primeng/api';

import { FileUpload, ToastSeverity } from '../../models';
import { getToastContentBySeverity } from '../custom-toast';

interface BaseFileUploadErrors {
  [key: string]: string;
}

export class FileUploadToastHelper {
  constructor(
    private ts: TranslocoService,
    private messageSvc: MessageService,
  ) {}

  public generateToastMessageBasedOnFileUploadStatus(
    uploadStatus: FileUpload,
    fileUploadErrors: BaseFileUploadErrors,
    fileUploadSuccess: string,
  ): void {
    if (uploadStatus.isSuccess) {
      const message: Message = getToastContentBySeverity(
        ToastSeverity.UploadSuccess,
      );
      message.summary = this.ts.translate(message.summary!);
      message.detail = this.ts.translate(fileUploadSuccess, {
        filename: uploadStatus.data.fileName,
      });
      this.messageSvc.add(message);
    } else {
      const message: Message = getToastContentBySeverity(
        ToastSeverity.UploadError,
      );
      message.summary = this.ts.translate(message.summary!);
      const detail =
        fileUploadErrors[
          uploadStatus.error!.errorCode as keyof typeof fileUploadErrors
        ];

      message.detail = this.ts.translate(detail, {
        filename: uploadStatus.error!.fileName,
      });
      this.messageSvc.add(message);
    }
  }
}
