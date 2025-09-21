import {
  FilterMode,
  FilterOperator,
  GridConfig,
  GridLazyLoadEvent,
  SortingDirection,
  SortingMode,
} from '../../models';
import {
  applyGridConfig,
  createGridConfig,
  getNumberOfFilteredRecords,
} from './grid-config.helpers';

describe('grid-config.helpers tests', () => {
  describe('createGridConfig function', () => {
    test('should return a valid GridConfig object', () => {
      // Arrange
      const event: GridLazyLoadEvent = {
        paginationEnabled: true,
        first: 30,
        rows: 25,
        sortField: 'name',
        sortOrder: 1,
        filters: {
          name: [
            {
              matchMode: 'in',
              operator: 'and',
              value: [{ label: 'Alice', value: 'Alice' }],
            },
          ],
        },
      };
      const expectedConfig: GridConfig = {
        pagination: {
          paginationEnabled: true,
          pageSize: 25,
          startIndex: 30,
        },
        sorting: {
          mode: SortingMode.Single,
          rules: [{ field: 'name', direction: SortingDirection.Ascending }],
        },
        filtering: {
          name: {
            value: [{ label: 'Alice', value: 'Alice' }],
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
          },
        },
      };

      // Act
      const result = createGridConfig(event);

      // Assert
      expect(result).toEqual(expectedConfig);
    });
  });

  describe('applyGridConfig function', () => {
    test('it should apply filters, sort, and pagination correctly', () => {
      // Arrange
      const testData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
      ];

      const testGridConfig: GridConfig = {
        filtering: {
          name: {
            value: [{ label: 'Alice', value: 'Alice' }],
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
          },
        },
        sorting: {
          mode: SortingMode.Single,
          rules: [
            {
              direction: SortingDirection.Ascending,
              field: 'name',
            },
          ],
        },
        pagination: { startIndex: 0, pageSize: 2, paginationEnabled: true },
      };

      // Act
      const result = applyGridConfig(testData, testGridConfig);

      expect(result).toEqual([
        { id: 2, name: 'Alice', age: 25 },
        { id: 4, name: 'Alice', age: 27 },
      ]);
    });

    test('it should handle no filtering, sorting, and pagination correctly', () => {
      // Arrange
      const testData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
      ];

      const testGridConfig: GridConfig = {
        filtering: {}, // No filtering
        sorting: { mode: SortingMode.Single, rules: [] }, // No sorting
        pagination: { startIndex: 0, pageSize: 10, paginationEnabled: false }, // No pagination
      };

      // Act
      const result = applyGridConfig(testData, testGridConfig);

      // Assert
      expect(result).toEqual(testData);
    });

    test('it should handle empty data array correctly', () => {
      // Arrange
      const testData: any[] = [];
      const testGridConfig: GridConfig = {
        filtering: {},
        sorting: { mode: SortingMode.Single, rules: [] },
        pagination: { startIndex: 0, pageSize: 10, paginationEnabled: false },
      };

      // Act
      const result = applyGridConfig(testData, testGridConfig);

      // Assert
      expect(result).toEqual([]);
    });

    test('it should handle filtering with no matching data correctly', () => {
      // Arrange
      const testData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
      ];

      const testGridConfig: GridConfig = {
        filtering: {
          name: {
            value: [{ label: 'David', value: 'David' }],
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
          },
        },
        sorting: { mode: SortingMode.Single, rules: [] },
        pagination: { startIndex: 0, pageSize: 10, paginationEnabled: false },
      };

      // Act
      const result = applyGridConfig(testData, testGridConfig);

      // Assert
      expect(result).toEqual([]);
    });

    test('it should handle pagination correctly', () => {
      // Arrange
      const testData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
      ];

      const testGridConfig: GridConfig = {
        filtering: {},
        sorting: { mode: SortingMode.Single, rules: [] },
        pagination: { startIndex: 1, pageSize: 2, paginationEnabled: true },
      };

      // Act
      const result = applyGridConfig(testData, testGridConfig);

      // Assert
      expect(result).toEqual([
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
      ]);
    });

    test('it should return all data when pagination is disabled', () => {
      // Arrange
      const testData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
      ];

      const testGridConfig: GridConfig = {
        filtering: {},
        sorting: { mode: SortingMode.Single, rules: [] },
        pagination: { startIndex: 1, pageSize: 2, paginationEnabled: false },
      };

      // Act
      const result = applyGridConfig(testData, testGridConfig);

      // Assert
      expect(result).toEqual([
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
      ]);
    });

    test('it should handle descending sorting mode correctly', () => {
      // Arrange
      const testData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
      ];

      const testGridConfig: GridConfig = {
        filtering: {},
        sorting: {
          mode: SortingMode.Single,
          rules: [
            {
              direction: SortingDirection.Descending,
              field: 'name',
            },
          ],
        },
        pagination: { startIndex: 0, pageSize: 10, paginationEnabled: false },
      };

      // Act
      const result = applyGridConfig(testData, testGridConfig);

      // Assert
      expect(result).toEqual([
        { id: 1, name: 'John', age: 30 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 4, name: 'Alice', age: 27 },
      ]);
    });

    test('it should handle sorting on multiple fields correctly', () => {
      // Arrange
      const testData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
      ];

      const testGridConfig: GridConfig = {
        filtering: {},
        sorting: {
          mode: SortingMode.Multiple,
          rules: [
            {
              direction: SortingDirection.Descending,
              field: 'name',
            },
            {
              direction: SortingDirection.Descending,
              field: 'age',
            },
          ],
        },
        pagination: { startIndex: 0, pageSize: 10, paginationEnabled: false },
      };

      // Act
      const result = applyGridConfig(testData, testGridConfig);

      // Assert
      expect(result).toEqual([
        { id: 1, name: 'John', age: 30 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
        { id: 2, name: 'Alice', age: 25 },
      ]);
    });
  });

  describe('getNumberOfFilteredRecords function', () => {
    test('should return the correct number of filtered records', () => {
      // Arrange
      const testData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
      ];

      const testGridConfig: GridConfig = {
        filtering: {
          name: {
            value: [{ label: 'Alice', value: 'Alice' }],
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
          },
        },
        sorting: {
          mode: SortingMode.Single,
          rules: [
            {
              direction: SortingDirection.Ascending,
              field: 'name',
            },
          ],
        },
        pagination: { startIndex: 0, pageSize: 2, paginationEnabled: false },
      };

      // Act
      const result = getNumberOfFilteredRecords(testData, testGridConfig);

      // Assert
      expect(result).toBe(2);
    });

    test('should return 0 if no records match the filter criteria', () => {
      // Arrange
      const testData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
      ];

      const testGridConfig: GridConfig = {
        filtering: {
          name: {
            value: [{ label: 'Mark', value: 'Mark' }],
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
          },
        },
        sorting: {
          mode: SortingMode.Single,
          rules: [
            {
              direction: SortingDirection.Ascending,
              field: 'name',
            },
          ],
        },
        pagination: { startIndex: 0, pageSize: 2, paginationEnabled: false },
      };

      // Act
      const result = getNumberOfFilteredRecords(testData, testGridConfig);

      // Assert
      expect(result).toBe(0);
    });

    test('should return the number of input items if no filters are applied', () => {
      // Arrange
      const testData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Alice', age: 25 },
        { id: 3, name: 'Bob', age: 35 },
        { id: 4, name: 'Alice', age: 27 },
      ];

      const testGridConfig: GridConfig = {
        filtering: {},
        sorting: {
          mode: SortingMode.Single,
          rules: [
            {
              direction: SortingDirection.Ascending,
              field: 'name',
            },
          ],
        },
        pagination: { startIndex: 0, pageSize: 2, paginationEnabled: false },
      };

      // Act
      const result = getNumberOfFilteredRecords(testData, testGridConfig);

      // Assert
      expect(result).toBe(testData.length);
    });
  });
});
