import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';

import { createMessageServiceMock } from '../../__mocks__';
import { FileUpload, ToastSeverity } from '../../models';
import { FileUploadToastHelper } from './toast-message-file-upload.helpers';

enum FileUploadErrors {
  Error_001 = 'findings.fileUpload.fileUploadWrongName',
  Error_002 = 'findings.fileUpload.fileUploadFailed',
  Error_003 = 'findings.fileUpload.fileUploadWrongSize',
  Error_004 = 'findings.fileUpload.fileUploadWrongNameLength',
  Error_005 = 'findings.fileUpload.fileUploadGenericError',
}

describe('FileUploadToastHelper', () => {
  let translocoServiceMock: Partial<TranslocoService>;
  const messageServiceMock: Partial<MessageService> =
    createMessageServiceMock();
  let fileUploadToastHelper: FileUploadToastHelper;

  beforeEach(() => {
    translocoServiceMock = {
      translate: jest.fn().mockImplementation((key) => `Translated: ${key}`),
    };
    fileUploadToastHelper = new FileUploadToastHelper(
      translocoServiceMock as any,
      messageServiceMock as MessageService,
    );
  });

  test('should generate success toast message for successful file upload', () => {
    // Arrange
    const uploadStatus: FileUpload = {
      isSuccess: true,
      data: { documentId: 1, fileName: 'testFile.txt' },
      error: { errorCode: '', fileName: '' },
      message: 'Success message',
    };

    // Act

    fileUploadToastHelper.generateToastMessageBasedOnFileUploadStatus(
      uploadStatus,
      FileUploadErrors,
      'uploadSuccess',
    );

    // Assert

    expect(translocoServiceMock.translate).nthCalledWith(1, 'uploadSuccess');

    expect(translocoServiceMock.translate).nthCalledWith(2, 'uploadSuccess', {
      filename: 'testFile.txt',
    });

    expect(messageServiceMock.add).toHaveBeenCalled();
  });

  test('should generate failure toast message for failed file upload', () => {
    // Arrange
    const uploadStatus: FileUpload = {
      isSuccess: false,
      data: { documentId: 1, fileName: 'testFile.txt' },
      error: { errorCode: 'Error_001', fileName: 'testFile.txt' },
      message: 'Success fail',
    };

    // Act

    fileUploadToastHelper.generateToastMessageBasedOnFileUploadStatus(
      uploadStatus,
      FileUploadErrors,
      '',
    );

    // Assert

    expect(translocoServiceMock.translate).nthCalledWith(
      1,
      ToastSeverity.UploadError,
    );

    expect(translocoServiceMock.translate).nthCalledWith(
      2,
      FileUploadErrors.Error_001,
      {
        filename: 'testFile.txt',
      },
    );

    expect(messageServiceMock.add).toHaveBeenCalled();
  });
});
