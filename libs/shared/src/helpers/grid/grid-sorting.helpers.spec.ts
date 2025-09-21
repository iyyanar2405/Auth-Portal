import { TableLazyLoadEvent } from 'primeng/table';

import { SortingConfig, SortingDirection, SortingMode } from '../../models';
import { createSortingConfig } from './grid-sorting.helpers';

describe('createSortingConfig function', () => {
  test('it should return single sorting config when only sortField and sortOrder are provided', () => {
    // Arrange
    const event: TableLazyLoadEvent = {
      sortField: 'name',
      sortOrder: 1,
    };
    const expectedConfig: SortingConfig = {
      mode: SortingMode.Single,
      rules: [{ field: 'name', direction: SortingDirection.Ascending }],
    };

    // Act
    const result = createSortingConfig(event);

    // Assert
    expect(result).toEqual(expectedConfig);
  });

  test('it should return multiple sorting config when multiSortMeta is provided', () => {
    // Arrange
    const event: TableLazyLoadEvent = {
      sortField: undefined,
      sortOrder: undefined,
      multiSortMeta: [
        { field: 'name', order: 1 },
        { field: 'age', order: -1 },
      ],
    };
    const expectedConfig: SortingConfig = {
      mode: SortingMode.Multiple,
      rules: [
        { field: 'name', direction: SortingDirection.Ascending },
        { field: 'age', direction: SortingDirection.Descending },
      ],
    };

    // Act
    const result = createSortingConfig(event);

    // Assert
    expect(result).toEqual(expectedConfig);
  });

  test('it should return default sorting config when neither sortField nor multiSortMeta is provided', () => {
    // Arrange
    const event = {};
    const expectedConfig: SortingConfig = {
      mode: SortingMode.Single,
      rules: [],
    };

    // Act
    const result = createSortingConfig(event);

    // Assert
    expect(result).toEqual(expectedConfig);
  });

  test('it should return default sorting config when sortField or multiSortMeta is null', () => {
    // Arrange
    const event = {
      sortField: null,
      multiSortMeta: null,
    };
    const expectedConfig: SortingConfig = {
      mode: SortingMode.Single,
      rules: [],
    };

    // Act
    const result = createSortingConfig(event);

    // Assert
    expect(result).toEqual(expectedConfig);
  });

  test('it should return sorting configuration for multiple mode with valid multiSortMeta', () => {
    // Arrange
    const event = {
      sordField: undefined,
      sortOrder: undefined,
      multiSortMeta: [
        { field: 'name', order: 1 },
        { field: 'age', order: -1 },
      ],
    };
    const expectedConfig: SortingConfig = {
      mode: SortingMode.Multiple,
      rules: [
        { field: 'name', direction: SortingDirection.Ascending },
        { field: 'age', direction: SortingDirection.Descending },
      ],
    };

    // Act
    const result = createSortingConfig(event);

    // Assert
    expect(result).toEqual(expectedConfig);
  });
});
