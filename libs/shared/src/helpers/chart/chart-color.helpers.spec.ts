import {
  buildStatusColorPalette,
  DEFAULT_COLOR_PALETTE,
  getPaletteColorOrFallback,
  UNMAPPED_COLOR,
} from './chart-color.helpers';

describe('chart color helpers', () => {
  describe('getPaletteColorOrFallback', () => {
    const testColorPalette = [
      '#4B9CD5',
      '#1B338C',
      '#A7D4EE',
      '#579A42',
      '#AAFCBA',
      '#3A5F71',
      '#EFE6D6',
      '#5BBEBA',
      '#FBF486',
      '#A4A9E2',
      '#D7423B',
      '#CCCBC9',
      '#A96C20',
      '#968F87',
    ];

    test('should return the correct color for a valid positive index', () => {
      // Act
      const color0 = getPaletteColorOrFallback(0, testColorPalette);
      const color4 = getPaletteColorOrFallback(4, testColorPalette);
      const color12 = getPaletteColorOrFallback(12, testColorPalette);

      // Assert
      expect(color0).toBe('#4B9CD5');
      expect(color4).toBe('#AAFCBA');
      expect(color12).toBe('#A96C20');
    });

    test('should return the unmapped color for an index greater than or equal to the length of the array', () => {
      // Act
      const color14 = getPaletteColorOrFallback(14, testColorPalette);
      const color100 = getPaletteColorOrFallback(100, testColorPalette);

      // Assert
      expect(color14).toBe('#000000');
      expect(color100).toBe('#000000');
    });

    test('should return the unmapped color for a negative index', () => {
      // Act
      const colorMinus1 = getPaletteColorOrFallback(-1, testColorPalette);
      const colorMinus10 = getPaletteColorOrFallback(-10, testColorPalette);

      // Assert
      expect(colorMinus1).toBe('#000000');
      expect(colorMinus10).toBe('#000000');
    });

    test('should return the correct color for a valid index within bounds', () => {
      // Act
      const color5 = getPaletteColorOrFallback(5, testColorPalette);
      const color2 = getPaletteColorOrFallback(2, testColorPalette);

      // Assert
      expect(color5).toBe('#3A5F71');
      expect(color2).toBe('#A7D4EE');
    });

    test('should handle an empty palette and return the unmapped color for any index', () => {
      const emptyPalette: string[] = [];

      // Act
      const colorEmpty0 = getPaletteColorOrFallback(0, emptyPalette);
      const colorEmptyMinus1 = getPaletteColorOrFallback(-1, emptyPalette);
      const colorEmpty100 = getPaletteColorOrFallback(100, emptyPalette);

      // Assert
      expect(colorEmpty0).toBe('#000000');
      expect(colorEmptyMinus1).toBe('#000000');
      expect(colorEmpty100).toBe('#000000');
    });
  });

  describe('buildStatusColorPalette', () => {
    test('should return mapped colors when all statuses are found in statusColors', () => {
      // Arrange
      const statuses = ['open', 'closed'];
      const statusColors = {
        open: '#00FF00',
        closed: '#FF0000',
      };

      // Act
      const result = buildStatusColorPalette(statuses, statusColors);

      // Assert
      expect(result).toEqual(['#00FF00', '#FF0000']);
    });

    test('should use fallback colors when statuses are not found in statusColors', () => {
      // Arrange
      const statuses = ['new', 'in-progress'];
      const statusColors = {};

      // Act
      const result = buildStatusColorPalette(statuses, statusColors);

      // Assert
      expect(result).toEqual([
        DEFAULT_COLOR_PALETTE[0],
        DEFAULT_COLOR_PALETTE[1],
      ]);
    });

    test('should use mixed mapped and fallback colors', () => {
      // Arrange
      const statuses = ['new', 'open', 'closed', 'archived'];
      const statusColors = {
        open: '#00FF00',
        closed: '#FF0000',
      };

      // Act
      const result = buildStatusColorPalette(statuses, statusColors);

      // Assert
      expect(result).toEqual([
        DEFAULT_COLOR_PALETTE[0],
        '#00FF00',
        '#FF0000',
        DEFAULT_COLOR_PALETTE[1],
      ]);
    });

    test('should fallback to UNMAPPED_COLOR if palette is exhausted', () => {
      // Arrange
      const statuses = Array(10).fill('unknown');
      const statusColors = {};

      // Act
      const result = buildStatusColorPalette(statuses, statusColors);

      // Assert
      const expected = statuses.map(
        (_, index) => DEFAULT_COLOR_PALETTE[index] ?? UNMAPPED_COLOR,
      );
      expect(result).toEqual(expected);
    });
  });
});
