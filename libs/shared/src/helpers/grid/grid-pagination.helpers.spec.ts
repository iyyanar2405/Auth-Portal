import { GridLazyLoadEvent } from '../../models';
import {
  applyPagination,
  createPaginationConfig,
} from './grid-pagination.helpers';

describe('grid-pagination helpers', () => {
  describe('createPaginationConfig function', () => {
    test('should return pagination config with default values when event is not provided', () => {
      // Arrange
      const event: GridLazyLoadEvent = { paginationEnabled: true };

      // Act
      const result = createPaginationConfig(event);

      // Assert
      expect(result.paginationEnabled).toBe(true);
      expect(result.startIndex).toBe(0);
      expect(result.pageSize).toBe(10);
    });

    test('should return pagination config with provided startIndex and default pageSize', () => {
      // Arrange
      const event: GridLazyLoadEvent = {
        paginationEnabled: true,
        first: 20,
      };

      // Act
      const result = createPaginationConfig(event);

      // Assert
      expect(result.startIndex).toBe(20);
      expect(result.pageSize).toBe(10);
      expect(result.paginationEnabled).toBe(true);
    });

    test('should return pagination config with provided pageSize and default startIndex', () => {
      // Arrange
      const event: GridLazyLoadEvent = {
        paginationEnabled: true,
        rows: 15,
      };

      // Act
      const result = createPaginationConfig(event);

      // Assert
      expect(result.startIndex).toBe(0);
      expect(result.pageSize).toBe(15);
      expect(result.paginationEnabled).toBe(true);
    });

    test('should return pagination config with provided startIndex and pageSize', () => {
      // Arrange
      const event: GridLazyLoadEvent = {
        paginationEnabled: true,
        first: 30,
        rows: 25,
      };

      // Act
      const result = createPaginationConfig(event);

      // Assert
      expect(result.startIndex).toBe(30);
      expect(result.pageSize).toBe(25);
      expect(result.paginationEnabled).toBe(true);
    });
  });

  describe('applyPagination function', () => {
    const data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
    ];

    test('should return the correct number of items for a given pageSize and startIndex', () => {
      // Arrange
      const config = { pageSize: 2, startIndex: 1, paginationEnabled: true };

      // Act
      const result = applyPagination(data, config);

      // Assert
      expect(result).toEqual([
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ]);
    });

    test('should return an empty array if startIndex is out of bounds', () => {
      // Arrange
      const config = { pageSize: 2, startIndex: 10, paginationEnabled: true };

      // Act
      const result = applyPagination(data, config);

      // Assert
      expect(result).toEqual([]);
    });

    test('should return the remaining items if pageSize exceeds the number of available items', () => {
      // Arrange
      const config = { pageSize: 10, startIndex: 3, paginationEnabled: true };

      // Act
      const result = applyPagination(data, config);

      // Assert
      expect(result).toEqual([
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
      ]);
    });

    test('should return all items if pageSize is large enough to include all from startIndex', () => {
      // Arrange
      const config = { pageSize: 10, startIndex: 0, paginationEnabled: true };

      // Act
      const result = applyPagination(data, config);

      // Assert
      expect(result).toEqual(data);
    });

    test('should return all items if paginationEnabled is false', () => {
      // Arrange
      const config = { pageSize: 1, startIndex: 0, paginationEnabled: false };

      // Act
      const result = applyPagination(data, config);

      // Assert
      expect(result).toEqual(data);
    });

    test('should handle pageSize of zero correctly', () => {
      // Arrange
      const config = { pageSize: 0, startIndex: 2, paginationEnabled: true };

      // Act
      const result = applyPagination(data, config);

      // Assert
      expect(result).toEqual([]);
    });

    test('should handle startIndex of zero correctly', () => {
      // Arrange
      const config = { pageSize: 2, startIndex: 0, paginationEnabled: true };

      // Act
      const result = applyPagination(data, config);

      // Assert
      expect(result).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]);
    });

    test('should handle an empty data array correctly', () => {
      // Arrange
      const config = { pageSize: 2, startIndex: 1, paginationEnabled: true };

      // Act
      const result = applyPagination([], config);

      // Assert
      expect(result).toEqual([]);
    });

    test('should handle pagination with negative startIndex', () => {
      // Arrange
      const config = { pageSize: 2, startIndex: -1, paginationEnabled: true };

      // Act
      const result = applyPagination(data, config);

      // Assert
      expect(result).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ]);
    });
  });
});
