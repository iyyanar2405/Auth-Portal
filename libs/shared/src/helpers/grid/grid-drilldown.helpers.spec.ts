import {
  FilterMode,
  FilterOperator,
  GridConfig,
  SortingMode,
} from '../../models';
import {
  checkIsDateType,
  createFilter,
  extractAppliedFilters,
  extractLocationChartFilters,
  formatFilter,
  updateGridConfigBasedOnFilters,
} from './grid-drilldown.helpers';

jest.mock('../date/date.helpers', () => ({
  dateToFormat: (date: Date) => date.toISOString().split('T')[0],
}));

describe('grid drilldown helpers', () => {
  describe('checkIsDateType', () => {
    test('should return false for string', () => {
      // Arrange
      const input = '2024-04-17';

      // Act
      const result = checkIsDateType(input);

      // Assert
      expect(result).toBe(false);
    });

    test('should return true for Date object', () => {
      // Arrange
      const input = new Date();

      // Act
      const result = checkIsDateType(input);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('createFilter', () => {
    test('should return correct filter structure', () => {
      // Arrange
      const key = 'status';
      const value = 'Completed';

      // Act
      const result = createFilter(key, value);

      // Assert
      expect(result).toEqual({
        label: 'status',
        value: [{ label: 'Completed', value: 'Completed' }],
      });
    });
  });

  describe('formatFilter', () => {
    test('should format string array', () => {
      // Arrange
      const payload = ['Done', 'In Progress'];
      const type = 'status';

      // Act
      const result = formatFilter(payload, type);

      // Assert
      expect(result).toEqual([
        {
          label: 'status',
          value: [
            { label: 'Done', value: 'Done' },
            { label: 'In Progress', value: 'In Progress' },
          ],
        },
      ]);
    });

    test('should format date array', () => {
      // Arrange
      const date1 = new Date('2024-04-17');
      const date2 = new Date('2025-01-01');

      // Act
      const result = formatFilter([date1, date2], 'startDate');

      // Assert
      expect(result).toEqual([
        {
          label: 'startDate',
          value: [
            { label: '2024-04-17', value: '2024-04-17' },
            { label: '2025-01-01', value: '2025-01-01' },
          ],
        },
      ]);
    });
  });

  describe('extractAppliedFilters', () => {
    test('should match selected indices and format result', () => {
      // Arrange
      const available = [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 2 },
      ];
      const selected = [2];
      const label = 'status';

      // Act
      const result = extractAppliedFilters(available, selected, label);

      // Assert
      expect(result).toEqual([
        {
          label: 'status',
          value: [{ label: 'Inactive', value: 'Inactive' }],
        },
      ]);
    });

    test('should return empty value if nothing matches', () => {
      // Arrange
      const available = [{ label: 'Active', value: 1 }];
      const selected = [3];
      const label = 'status';

      // Act
      const result = extractAppliedFilters(available, selected, label);

      // Assert
      expect(result).toEqual([
        {
          label: 'status',
          value: [],
        },
      ]);
    });
  });

  describe('updateGridConfigBasedOnFilters', () => {
    test('should merge new filters into gridConfig', () => {
      // Arrange
      const gridConfig: GridConfig = {
        filtering: {},
        pagination: {
          paginationEnabled: true,
          pageSize: 50,
          startIndex: 0,
        },
        sorting: {
          mode: SortingMode.Single,
          rules: [],
        },
      };

      const filters = [
        {
          label: 'status',
          value: [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ],
        },
      ];

      // Act
      const result = updateGridConfigBasedOnFilters(gridConfig, filters);

      // Assert
      expect(result.filtering['status']).toEqual({
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
        value: [
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ],
      });
    });

    test('should append filters if already present', () => {
      // Arrange
      const gridConfig: GridConfig = {
        filtering: {
          status: {
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
            value: [{ label: 'Pending', value: 'Pending' }],
          },
        },
        pagination: {
          paginationEnabled: true,
          pageSize: 50,
          startIndex: 0,
        },
        sorting: {
          mode: SortingMode.Single,
          rules: [],
        },
      };

      const filters = [
        {
          label: 'status',
          value: [{ label: 'Approved', value: 'Approved' }],
        },
      ];

      // Act
      const result = updateGridConfigBasedOnFilters(gridConfig, filters);

      // Assert
      expect(result.filtering['status'].value).toEqual([
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
      ]);
    });
  });

  describe('extractLocationChartFilters', () => {
    test('should return filtered countries, cities, and sites based on depth', () => {
      // Arrange
      const data = [
        { label: 'USA', depth: 0 },
        { label: 'NYC', depth: 1 },
        { label: 'Site A', depth: 2 },
        { label: 'Canada', depth: 0 },
        { label: 'Toronto', depth: 1 },
        { label: 'Site B', depth: 2 },
      ];

      // Act
      const result = extractLocationChartFilters(data);

      // Assert
      expect(result).toEqual({
        countries: ['USA', 'Canada'],
        cities: ['NYC', 'Toronto'],
        sites: ['Site A', 'Site B'],
      });
    });

    test('should return empty arrays if no matching depth', () => {
      // Arrange
      const data: any = [];

      // Act
      const result = extractLocationChartFilters(data);

      // Assert
      expect(result).toEqual({
        countries: [],
        cities: [],
        sites: [],
      });
    });
  });
});
