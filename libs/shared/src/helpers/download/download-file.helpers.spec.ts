import saveAs from 'file-saver';

import {
  downloadFileFromBase64,
  downloadFileFromByteArray,
} from './download-file.helpers';

jest.mock('file-saver');

describe('download-file.helpers tests', () => {
  describe('downloadExcelFromByteArray', () => {
    test('should convert input array to Uint8Array and call saveAs with correct arguments', () => {
      // Arrange
      const inputArray = [1, 2, 3, 4];
      const fileName = 'test.xlsx';
      const mimeType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      // Act
      downloadFileFromByteArray(inputArray, fileName, mimeType);

      // Assert
      const expectedUint8Array = new Uint8Array(inputArray);
      const expectedBlob = new Blob([expectedUint8Array], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      expect(saveAs).toHaveBeenCalledWith(expectedBlob, fileName);
    });
  });

  describe('downloadFileFromBase64', () => {
    test('should decode base64 to Uint8Array and call saveAs with correct arguments', () => {
      // Arrange
      const base64String = btoa('Hello, world!');
      const fileName = 'test.txt';
      const mimeType = 'text/plain';

      // Assert
      downloadFileFromBase64(base64String, fileName, mimeType);

      // Assert
      const expectedByteArray = new Uint8Array(
        atob(base64String)
          .split('')
          .map((char) => char.charCodeAt(0)),
      );
      const expectedBlob = new Blob([expectedByteArray], { type: mimeType });

      expect(saveAs).toHaveBeenCalledWith(expectedBlob, fileName);
    });
  });
});
