import { FilterValue } from '../../models';
import { shouldApplyFilter } from './chart-filter.helper';

describe('shouldApplyFilter', () => {
  test('should return true when tooltipFilters is empty', () => {
    // Arrange
    const tooltipFilters: FilterValue[] = [];
    const label = 'Test Label';

    // Act
    const result = shouldApplyFilter(tooltipFilters, label);

    // Assert
    expect(result).toBe(true);
  });

  test('should return true when label is not in tooltipFilters', () => {
    // Arrange
    const tooltipFilters: FilterValue[] = [
      { label: 'Other Label', value: 123 },
    ];
    const label = 'Test Label';

    // Act
    const result = shouldApplyFilter(tooltipFilters, label);

    // Assert
    expect(result).toBe(true);
  });

  test('should return false when label is in tooltipFilters', () => {
    // Arrange
    const tooltipFilters: FilterValue[] = [
      { label: 'Test Label', value: 123 },
      { label: 'Another Label', value: 456 },
    ];
    const label = 'Test Label';

    // Act
    const result = shouldApplyFilter(tooltipFilters, label);

    // Assert
    expect(result).toBe(false);
  });
});
