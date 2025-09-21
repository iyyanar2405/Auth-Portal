import {
  FilterableColumnDefinition,
  FilterMode,
  FilterOperator,
  GridConfig,
  SortingMode,
} from '../../models';
import {
  getFilterOptions,
  getFilterOptionsForColumn,
} from './grid-filter-options.helpers';

describe('grid-filter-options helper tests', () => {
  describe('getFilterOptionsForColumn', () => {
    test('should return unique values with labels when no delimiter is provided', () => {
      const dataList = [
        { id: '0', status: 'In progress', city: 'Arnhem' },
        { id: '1', status: 'To be confirmed', city: 'Nordstemmen' },
        { id: '2', status: 'Completed', city: 'Arnhem' },
      ];
      const result = getFilterOptionsForColumn(dataList, 'status');
      expect(result).toEqual([
        { label: 'In progress', value: 'In progress' },
        { label: 'To be confirmed', value: 'To be confirmed' },
        { label: 'Completed', value: 'Completed' },
      ]);
    });

    test('should split values by the provided delimiter and return unique trimmed values', () => {
      const dataList = [{ tags: 'a, b, c' }, { tags: 'b, c, d' }];
      const result = getFilterOptionsForColumn(dataList, 'tags', ',');
      expect(result).toEqual([
        { label: 'a', value: 'a' },
        { label: 'b', value: 'b' },
        { label: 'c', value: 'c' },
        { label: 'd', value: 'd' },
      ]);
    });

    test('should filter out empty strings and add "BLANK" option at the end', () => {
      const dataList = [
        { id: '0', status: 'In progress', city: 'Arnhem' },
        { id: '1', status: 'To be confirmed', city: '' },
        { id: '2', status: 'Completed', city: 'Nordstemmen' },
      ];
      const result = getFilterOptionsForColumn(dataList, 'city');
      expect(result).toEqual([
        { label: 'Arnhem', value: 'Arnhem' },
        { label: 'Nordstemmen', value: 'Nordstemmen' },
        { label: 'BLANK', value: 'BLANK' },
      ]);
    });

    test('should handle columns with mixed types and ensure uniqueness', () => {
      const dataList = [
        { mixed: '1' },
        { mixed: 1 },
        { mixed: '2' },
        { mixed: 2 },
      ];
      const result = getFilterOptionsForColumn(dataList, 'mixed');
      expect(result).toEqual([
        { label: '1', value: '1' },
        { label: '1', value: 1 },
        { label: '2', value: '2' },
        { label: '2', value: 2 },
      ]);
    });

    test('should return an empty array if the column does not exist', () => {
      const dataList = [
        { id: '0', status: 'In progress', city: 'Arnhem' },
        { id: '1', status: 'To be confirmed', city: 'Nordstemmen' },
      ];
      const result = getFilterOptionsForColumn(dataList, 'nonExistentColumn');
      expect(result).toEqual([]);
    });

    test('should handle data with delimiters and extra spaces', () => {
      const dataList = [{ tags: ' a , b , c ' }, { tags: ' b , c , d ' }];
      const result = getFilterOptionsForColumn(dataList, 'tags', ',');
      expect(result).toEqual([
        { label: 'a', value: 'a' },
        { label: 'b', value: 'b' },
        { label: 'c', value: 'c' },
        { label: 'd', value: 'd' },
      ]);
    });
  });

  describe('getFilterOptions', () => {
    const data = [
      {
        id: '0',
        status: 'In progress',
        city: 'Arnhem',
        service: 'Service 1 || Service 2',
      },
      {
        id: '1',
        status: 'To be confirmed',
        city: 'Nordstemmen',
        service: 'Service 1',
      },
      { id: '2', status: 'Completed', city: 'Arnhem', service: 'Service 2' },
      {
        id: '3',
        status: 'In progress',
        city: 'Arnhem',
        service: 'Service 2 || Service 3',
      },
    ];

    const defaultGridConfig: GridConfig = {
      filtering: {},
      sorting: { mode: SortingMode.Multiple, rules: [] },
      pagination: {
        paginationEnabled: true,
        pageSize: 10,
        startIndex: 0,
      },
    };

    const columnDefinitions: FilterableColumnDefinition[] = [
      { field: 'id', hasColumnDelimiter: false },
      { field: 'status', hasColumnDelimiter: false },
      { field: 'city', hasColumnDelimiter: false },
      { field: 'service', hasColumnDelimiter: true },
    ];

    test('should return an empty object if columnDefinitions is empty', () => {
      // Arrange
      const emptyColumnDefinitions: FilterableColumnDefinition[] = [];

      // Act
      const result = getFilterOptions(
        data,
        defaultGridConfig,
        emptyColumnDefinitions,
      );

      // Assert
      expect(result).toEqual({});
    });

    test('should return unique filter options for each column based on the provided data', () => {
      // Arrange
      const gridConfig: GridConfig = {
        filtering: {
          id: {
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
            value: [
              {
                label: '0',
                value: '0',
              },
            ],
          },
        },
        sorting: { mode: SortingMode.Multiple, rules: [] },
        pagination: {
          paginationEnabled: true,
          pageSize: 10,
          startIndex: 0,
        },
      };
      // Act
      const result = getFilterOptions(data, gridConfig, columnDefinitions);

      // Assert
      expect(result).toStrictEqual({
        id: [
          {
            label: '0',
            value: '0',
          },
          {
            label: '1',
            value: '1',
          },
          {
            label: '2',
            value: '2',
          },
          {
            label: '3',
            value: '3',
          },
        ],
        status: [
          {
            label: 'In progress',
            value: 'In progress',
          },
        ],
        city: [
          {
            label: 'Arnhem',
            value: 'Arnhem',
          },
        ],
        service: [
          {
            label: 'Service 1',
            value: 'Service 1',
          },
          {
            label: 'Service 2',
            value: 'Service 2',
          },
        ],
      });
    });

    test('should return unique filter options for each column based on the provided data when filtering on other column than id', () => {
      // Arrange
      const gridConfig: GridConfig = {
        filtering: {
          service: {
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
            value: [
              {
                label: 'Service 2',
                value: 'Service 2',
              },
            ],
          },
        },
        sorting: { mode: SortingMode.Multiple, rules: [] },
        pagination: {
          paginationEnabled: true,
          pageSize: 10,
          startIndex: 0,
        },
      };
      // Act
      const result = getFilterOptions(data, gridConfig, columnDefinitions);

      // Assert
      expect(result).toStrictEqual({
        id: [
          {
            label: '0',
            value: '0',
          },
          {
            label: '2',
            value: '2',
          },
          {
            label: '3',
            value: '3',
          },
        ],
        status: [
          {
            label: 'In progress',
            value: 'In progress',
          },
          {
            label: 'Completed',
            value: 'Completed',
          },
        ],
        city: [
          {
            label: 'Arnhem',
            value: 'Arnhem',
          },
        ],
        service: [
          {
            label: 'Service 1',
            value: 'Service 1',
          },
          {
            label: 'Service 2',
            value: 'Service 2',
          },
          {
            label: 'Service 3',
            value: 'Service 3',
          },
        ],
      });
    });

    test('should return filtered unique options when filtering by multiple columns', () => {
      // Arrange
      const gridConfig: GridConfig = {
        filtering: {
          id: {
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
            value: [
              {
                label: '2',
                value: '2',
              },
            ],
          },
          status: {
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
            value: [
              {
                label: 'Completed',
                value: 'Completed',
              },
            ],
          },
        },
        sorting: { mode: SortingMode.Multiple, rules: [] },
        pagination: {
          paginationEnabled: true,
          pageSize: 10,
          startIndex: 0,
        },
      };
      // Act
      const result = getFilterOptions(data, gridConfig, columnDefinitions);

      // Assert
      expect(result).toStrictEqual({
        id: [
          {
            label: '2',
            value: '2',
          },
        ],
        status: [
          {
            label: 'Completed',
            value: 'Completed',
          },
        ],
        city: [
          {
            label: 'Arnhem',
            value: 'Arnhem',
          },
        ],
        service: [
          {
            label: 'Service 2',
            value: 'Service 2',
          },
        ],
      });
    });
  });
});
