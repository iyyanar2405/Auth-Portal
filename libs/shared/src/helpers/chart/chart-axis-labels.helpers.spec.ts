import { trimLabel } from './chart-axis-labels.helpers';

describe('trimLabel', () => {
  test('should return the full label when it is shorter than maxLabelLength', () => {
    // Arrange
    const label = 'Short Label';
    const maxLabelLength = 20;

    // Act
    const result = trimLabel(label, maxLabelLength);

    // Assert
    expect(result).toBe('Short Label');
  });

  test('should truncate and add ellipsis when label exceeds maxLabelLength', () => {
    // Arrange
    const label = 'This is a very long label that should be trimmed';
    const maxLabelLength = 10;

    // Act
    const result = trimLabel(label, maxLabelLength);

    // Assert
    expect(result).toBe('This is a ...');
  });

  test('should handle exact maxLabelLength correctly without adding ellipsis', () => {
    // Arrange
    const label = 'ExactlyTwentyChars';
    const maxLabelLength = 20;

    // Act
    const result = trimLabel(label, maxLabelLength);

    // Assert
    expect(result).toBe('ExactlyTwentyChars');
  });

  test('should return empty string when input label is empty', () => {
    // Arrange
    const label = '';
    const maxLabelLength = 10;

    // Act
    const result = trimLabel(label, maxLabelLength);

    // Assert
    expect(result).toBe('');
  });

  test('should use default maxLabelLength when not provided', () => {
    // Arrange
    const label =
      'This is a long label that should be trimmed to default length';

    // Act
    const result = trimLabel(label);

    // Assert
    expect(result).toBe('This is a long label...');
  });
});
