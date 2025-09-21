import saveAs from 'file-saver';

jest.mock('file-saver');

import { downloadFromByteArray, getContentType } from './download-helpers';

describe('Helper Functions', () => {
  describe('getContentType', () => {
    test('should return the correct content type for a valid extension', () => {
      // Arrange
      const testCases = [
        { filename: 'file.txt', expected: 'text/plain' },
        { filename: 'document.pdf', expected: 'application/pdf' },
        { filename: 'image.jpeg', expected: 'image/jpeg' },
        { filename: 'music.mp3', expected: 'audio/mpeg' },
        { filename: 'video.mp4', expected: 'video/mp4' },
      ];

      testCases.forEach(({ filename, expected }) => {
        // Act
        const result = getContentType(filename);

        // Assert
        expect(result).toBe(expected);
      });
    });

    test('should throw an error for an invalid extension', () => {
      // Assert
      expect(() => getContentType('file.unknown')).toThrow(
        'Invalid or unsupported file extension',
      );
    });

    test('should throw an error if no extension is provided', () => {
      // Assert
      expect(() => getContentType('file')).toThrow(
        'Invalid or unsupported file extension',
      );
    });

    test('should return only file extension is hasExtension flag is set to true ', () => {
      // Arrange
      const filename = 'testfile.zip';
      const hasExtension = true;
      const expected = 'zip';

      // Act
      const result = getContentType(filename, hasExtension);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('downloadFromByteArray', () => {
    test('should call saveAs with a Blob and the correct filename', () => {
      // Arrange
      const mockData = { body: new Uint8Array([65, 66, 67]) };
      const fileName = 'test.txt';

      const saveAsSpy = jest.spyOn(saveAs, 'saveAs');

      // Act
      downloadFromByteArray(mockData, fileName);

      // Assert
      expect(saveAsSpy).toHaveBeenCalled();
      const blobArg = saveAsSpy.mock.calls[0][0];
      expect(blobArg instanceof Blob).toBe(true);
      expect((blobArg as Blob).type).toBe('text/plain');
      expect(saveAsSpy.mock.calls[0][1]).toBe(fileName);
    });

    test('should throw an error if an unsupported file extension is used', () => {
      // Arrange
      const mockData = { body: new Uint8Array([65, 66, 67]) };

      // Assert
      expect(() => downloadFromByteArray(mockData, 'file.unknown')).toThrow(
        'Invalid or unsupported file extension',
      );
    });
  });
});
