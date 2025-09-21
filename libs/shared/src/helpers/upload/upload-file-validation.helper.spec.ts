import { validateFileHelper } from './upload-file-validation.helpers';

describe('validateFileHelper', () => {
  const errorMessages = {
    wrongFileSize: 'File size is too large.',
    wrongFileNameLength: 'File name is too long.',
    wrongTotalFileSize: 'Total file size is too large.',
  };

  // Correct approach to mock a File with specific size, type, and name
  function mockFile(size: number, type: string, name: string): File {
    const blobParts = new Blob([new ArrayBuffer(size)]);

    return new File([blobParts], name, { type });
  }

  test('returns wrongFileSize error for large files', () => {
    // Arrange
    const file = mockFile(5000000, 'image/png', 'photo.png'); // 5MB file

    // Act
    const errors = validateFileHelper(file, errorMessages, 10); // 1MB maxFileSize
    // Assert
    expect(errors).toContain(errorMessages.wrongFileSize);
  });

  test('returns wrongFileNameLength error for long file names', () => {
    // Arrange
    const file = mockFile(100000, 'image/jpeg', `${'a'.repeat(255)}.jpg`); // 255 characters long name
    // Act
    const errors = validateFileHelper(file, errorMessages, 1000000);
    // Assert
    expect(errors).toContain(errorMessages.wrongFileNameLength);
  });

  test('returns no errors for valid files', () => {
    // Arrange
    const file = mockFile(100000, 'image/jpeg', 'photo.jpg');
    // Act
    const errors = validateFileHelper(file, errorMessages, 1000000);
    // Assert
    expect(errors).toHaveLength(0);
  });
});
