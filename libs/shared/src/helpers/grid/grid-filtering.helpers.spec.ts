import { TableLazyLoadEvent } from 'primeng/table';

import { BLANK_FILTER } from '../../constants';
import { FilteringConfig, FilterMode, FilterOperator } from '../../models';
import {
  applyDateRangeFilter,
  applyInFilter,
  applySingleDateFilter,
  compareFilterEquality,
  createFilteringConfig,
  filterData,
  getActiveFilters,
  isAnyFilterActive,
  mapFilterConfigToValues,
} from './grid-filtering.helpers';

describe('grid-filtering helper tests', () => {
  describe('isAnyFilterActive function', () => {
    test('should return true if any filter has at least one active filter', () => {
      // Arrange
      const filteringConfig: FilteringConfig = {
        filter1: {
          value: [{ label: 'Label 1', value: 'Value 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filter2: {
          value: [],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filter3: {
          value: [{ label: 'Label 2', value: 'Value 2' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result = isAnyFilterActive(filteringConfig);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false if no filter has any active filter', () => {
      // Arrange
      const filteringConfig: FilteringConfig = {
        filter1: {
          value: [],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filter2: {
          value: [],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filter3: {
          value: [],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result = isAnyFilterActive(filteringConfig);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false if filteringConfig is empty', () => {
      // Arrange
      const filteringConfig: FilteringConfig = {};

      // Act
      const result = isAnyFilterActive(filteringConfig);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getActiveFilters function', () => {
    test('should return an empty array when no filters are active', () => {
      // Arrange
      const config: FilteringConfig = {
        filter1: {
          value: [],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filter2: {
          value: [],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result = getActiveFilters(config);

      // Assert
      expect(result).toEqual([]);
    });

    test('should return active filters when some filters have values', () => {
      // Arrange
      const config: FilteringConfig = {
        filter1: {
          value: [{ label: 'Label 1', value: 'Value 1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filter2: {
          value: [],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filter3: {
          value: [
            { label: 'Label 2', value: 'Value 2' },
            { label: 'Label 3', value: 'Value 3' },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result = getActiveFilters(config);

      // Assert
      expect(result).toEqual(['filter1', 'filter3']);
    });

    test('should return multiple active filters', () => {
      // Arrange
      const config: FilteringConfig = {
        filter1: {
          value: [{ label: 'activeValue1', value: 'activeValue1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filter2: {
          value: [{ label: 'activeValue2', value: 'activeValue2' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filter3: {
          value: [],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filter4: {
          value: [
            { label: 'activeValue3', value: 'activeValue5' },
            { label: 'activeValue4', value: 'activeValue4' },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result = getActiveFilters(config);

      // Assert
      expect(result).toEqual(['filter1', 'filter2', 'filter4']);
    });

    test('should return active filters in the order they are defined', () => {
      // Arrange
      const config: FilteringConfig = {
        filterA: {
          value: [],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filterB: {
          value: [{ label: 'label1', value: 'value1' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        filterC: {
          value: [{ label: 'label2', value: 'value2' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result = getActiveFilters(config);

      // Assert
      expect(result).toEqual(['filterB', 'filterC']);
    });
  });

  describe('createFilteringConfig function', () => {
    test('returns an empty object when event filters are null', () => {
      // Arrange
      const event = { filters: null } as unknown as TableLazyLoadEvent;

      // Act
      const result = createFilteringConfig(event);

      // Assert
      expect(result).toEqual({});
    });

    test('returns an empty object when event filters are empty', () => {
      // Arrange
      const event = { filters: {} };

      // Act
      const result = createFilteringConfig(event);

      // Assert
      expect(result).toEqual({});
    });

    test('creates FilteringConfig from event filters', () => {
      // Arrange
      const event = {
        filters: {
          name: { value: 'John', matchMode: 'equals', operator: 'and' },
          age: { value: 30, matchMode: 'gte', operator: 'or' },
        },
      };

      // Act
      const result = createFilteringConfig(event);

      // Assert
      expect(result).toEqual({
        name: { value: 'John', matchMode: 'equals', operator: 'and' },
        age: { value: 30, matchMode: 'gte', operator: 'or' },
      });
    });

    test('creates FilteringConfig from event filters with null values', () => {
      // Arrange
      const event = {
        filters: {
          name: { value: null, matchMode: 'equals', operator: 'and' },
          age: { value: 30, matchMode: 'gte', operator: 'or' },
        },
      };

      // Act
      const result = createFilteringConfig(event);

      // Assert
      expect(result).toEqual({
        age: { value: 30, matchMode: 'gte', operator: 'or' },
      });
    });

    test('creates FilteringConfig from event filters with arrays', () => {
      // Arrange
      const event = {
        filters: {
          name: [
            { value: 'John', matchMode: 'equals', operator: 'and' },
            { value: 'Doe', matchMode: 'contains', operator: 'or' },
            { value: null, matchMode: 'contains', operator: 'or' }, // Filter with null value should be skipped
          ],
          age: { value: 30, matchMode: 'gte', operator: 'or' },
        },
      };

      // Act
      const result = createFilteringConfig(event);

      // Assert
      expect(result).toEqual({
        name: { value: ['John'], matchMode: 'equals', operator: 'and' },
        age: { value: 30, matchMode: 'gte', operator: 'or' },
      });
    });
  });

  describe('applyInFilter function', () => {
    const testData: { [key: string]: string | null }[] = [
      { name: 'John', age: '30', dateOfBirth: '01-01-1990' },
      { name: 'Jane', age: '25', dateOfBirth: '05-05-1995' },
      { name: 'Doe', age: '40', dateOfBirth: '10-10-1980' },
    ];

    const testFilter: FilteringConfig = {
      name: {
        value: [{ label: 'John', value: 'John' }],
        operator: FilterOperator.And,
        matchMode: FilterMode.In,
      },
      age: {
        value: [{ label: '30', value: '30' }],
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
      },
      dateOfBirth: {
        value: [{ label: '01-01-1990', value: '01-01-1990' }],
        matchMode: FilterMode.DateAfter,
        operator: FilterOperator.And,
      },
    };

    test('filters blank data', () => {
      // Arrange
      const filter = {
        value: [{ label: 'blank', value: BLANK_FILTER }],
        operator: FilterOperator.And,
        matchMode: FilterMode.In,
      };
      const itemValue = '';

      // Act
      const result = applyInFilter(itemValue, filter);

      // Assert
      expect(result).toBe(true);
    });

    test('trims extra spaces from filter and item values', () => {
      // Arrange
      const filter = {
        value: [{ label: ' John ', value: ' John ' }],
        operator: FilterOperator.And,
        matchMode: FilterMode.In,
      };
      const itemValue = '  John  ';

      // Act
      const result = applyInFilter(itemValue, filter);

      // Assert
      expect(result).toBe(true);
    });

    test('filters data based on provided filter config', () => {
      // Act
      const filteredData = filterData(testData, testFilter);

      // Assert
      expect(filteredData).toEqual([
        { name: 'John', age: '30', dateOfBirth: '01-01-1990' },
      ]);
    });

    test('returns empty array when no data matches the filter', () => {
      // Arrange
      const emptyFilter: FilteringConfig = {
        name: {
          value: [{ label: 'Unknown', value: 'unknown' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        age: {
          value: [{ label: '50', value: '50' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        dateOfBirth: {
          value: [{ label: '01-01-2000', value: '01-01-2000' }],
          matchMode: FilterMode.DateAfter,
          operator: FilterOperator.And,
        },
      };

      // Act
      const filteredData = filterData(testData, emptyFilter);

      // Assert
      expect(filteredData).toEqual([]);
    });

    test('returns original data when filter config is empty', () => {
      // Act
      const filteredData = filterData(testData, {});

      // Assert
      expect(filteredData).toEqual(testData);
    });

    test('returns original data when data array is empty', () => {
      // Act
      const filteredData = filterData([], testFilter);

      // Assert
      expect(filteredData).toEqual([]);
    });

    test('excludes items that have null value', () => {
      // Arrange
      testData.push({
        name: null,
        age: '40',
        dateOfBirth: '10-10-1980',
      });

      // Act
      const filteredData = filterData(testData, testFilter);

      // Assert
      expect(filteredData).toEqual([
        { name: 'John', age: '30', dateOfBirth: '01-01-1990' },
      ]);
    });

    test('returns empty values when filter value is empty string', () => {
      // Arrange
      testData.push({
        name: 'test',
        age: '40',
        dateOfBirth: '',
      });

      const filters: FilteringConfig = {
        dateOfBirth: {
          value: [{ label: 'noData', value: '' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const filteredData = filterData(testData, filters);

      // Assert
      expect(filteredData).toEqual([
        { name: 'test', age: '40', dateOfBirth: '' },
      ]);
    });
  });

  describe('mapFilterConfigToValues', () => {
    const filterName = 'auditId';
    const values = [
      { label: 'Label 1', value: 'Value 1' },
      { label: 'Label 2', value: 'Value 2' },
    ];
    const filterConfig: FilteringConfig = {
      [filterName]: {
        value: values,
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
      },
    };

    test('returns null if filterName is not present in filterConfig', () => {
      // Act
      const result = mapFilterConfigToValues({}, filterName);

      // Assert
      expect(result).toBeNull();
    });

    test('returns null if values are empty', () => {
      // Act
      const result = mapFilterConfigToValues(
        {
          [filterName]: {
            value: [],
            matchMode: FilterMode.In,
            operator: FilterOperator.And,
          },
        },
        filterName,
      );

      // Assert
      expect(result).toBeNull();
    });

    test('returns values without conversion when filterConfig and filterName are valid, and no convertFunc is provided', () => {
      // Act
      const result = mapFilterConfigToValues(filterConfig, filterName);

      // Assert
      expect(result).toEqual(['Value 1', 'Value 2']);
    });

    test('returns values with conversion when filterConfig and filterName are valid, and convertFunc is provided', () => {
      // Arrange
      const convertFunc = (value: string) => value.toUpperCase();

      // Act
      const result = mapFilterConfigToValues(
        filterConfig,
        filterName,
        null,
        convertFunc,
      );

      // Assert
      expect(result).toEqual(['VALUE 1', 'VALUE 2']);
    });
  });

  describe('applyDateFilter function', () => {
    test('filters blank data', () => {
      // Arrange
      const filter = {
        value: [{ label: 'blank', value: BLANK_FILTER }],
        operator: FilterOperator.And,
        matchMode: FilterMode.DateAfter,
      };
      const itemValue = '';

      // Act
      const result = applyInFilter(itemValue, filter);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('applySingleDateFilter function', () => {
    test('should return true when dates match', () => {
      // Arrange
      const itemValue = '23-05-2024';
      const filterValue = [
        {
          label: '23-05-2024',
          value: '23-05-2024',
        },
      ];

      // Act
      const result = applySingleDateFilter(itemValue, filterValue);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true when dates do not match', () => {
      // Arrange
      const itemValue = '01-01-2024';
      const filterValue = [
        {
          label: '23-05-2024',
          value: '23-05-2024',
        },
      ];

      // Act
      const result = applySingleDateFilter(itemValue, filterValue);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for invalid date format in itemValue', () => {
      // Arrange
      const itemValue = '05-23-2024';
      const filterValue = [
        {
          label: '23-05-2024',
          value: '23-05-2024',
        },
      ];

      // Act
      const result = applySingleDateFilter(itemValue, filterValue);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('applyDateRangeFilter function', () => {
    test('should return true if the date is within the range', () => {
      // Arrange
      const itemValue = '15-05-2024';
      const filterValue = [{ value: '01-05-2024' }, { value: '31-05-2024' }];

      // Act
      const result = applyDateRangeFilter(itemValue, filterValue);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false if the date is before the range', () => {
      // Arrange
      const itemValue = '30-04-2024';
      const filterValue = [{ value: '01-05-2024' }, { value: '31-05-2024' }];

      // Act
      const result = applyDateRangeFilter(itemValue, filterValue);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false if the date is after the range', () => {
      // Arrange
      const itemValue = '01-06-2024';
      const filterValue = [{ value: '01-05-2024' }, { value: '31-05-2024' }];

      // Act
      const result = applyDateRangeFilter(itemValue, filterValue);

      // Assert
      expect(result).toBe(false);
    });

    test('should return true if the date is exactly the start of the range', () => {
      // Arrange
      const itemValue = '01-05-2024';
      const filterValue = [{ value: '01-05-2024' }, { value: '31-05-2024' }];

      // Act
      const result = applyDateRangeFilter(itemValue, filterValue);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true if the date is exactly the end of the range', () => {
      // Arrange
      const itemValue = '31-05-2024';
      const filterValue = [{ value: '01-05-2024' }, { value: '31-05-2024' }];

      // Act
      const result = applyDateRangeFilter(itemValue, filterValue);

      // Assert
      expect(result).toBe(true);
    });

    test('should handle invalid date formats gracefully', () => {
      // Arrange
      const itemValue = 'invalid-date';
      const filterValue = [{ value: '01-05-2024' }, { value: '31-05-2024' }];

      // Act
      const result = applyDateRangeFilter(itemValue, filterValue);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('applySearchFilter function', () => {
    const testData: { [key: string]: string | null }[] = [
      { name: 'John', age: '30', dateOfBirth: '01-01-1990' },
      { name: 'Jane', age: '25', dateOfBirth: '05-05-1995' },
      { name: 'Doe', age: '40', dateOfBirth: '10-10-1980' },
    ];
    test('should return all data when filter value length is 0', () => {
      // Arrange
      const testFilter: FilteringConfig = {
        name: {
          value: [],
          matchMode: FilterMode.StartsWidth,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result = filterData(testData, testFilter);

      // Assert
      expect(result.length).toBe(testData.length);
    });

    test('should return 1 object where name value starts with filter value', () => {
      // Arrange
      const testFilter: FilteringConfig = {
        name: {
          value: [{ label: 'Jo', value: 'Jo' }],
          matchMode: FilterMode.StartsWidth,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result = filterData(testData, testFilter);

      // Assert
      expect(result).toEqual([
        { name: 'John', age: '30', dateOfBirth: '01-01-1990' },
      ]);
    });

    test('should return no data when filter value does not corespond with filter value', () => {
      // Arrange
      const testFilter: FilteringConfig = {
        name: {
          value: [{ label: 'no', value: 'no' }],
          matchMode: FilterMode.StartsWidth,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result = filterData(testData, testFilter);

      // Assert
      expect(result).toEqual([]);
    });

    test('should handle case insensitivity', () => {
      // Arrange
      const testFilter: FilteringConfig = {
        name: {
          value: [{ label: 'do', value: 'do' }],
          matchMode: FilterMode.StartsWidth,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result = filterData(testData, testFilter);

      // Assert
      expect(result).toEqual([
        {
          name: 'Doe',
          age: '40',
          dateOfBirth: '10-10-1980',
        },
      ]);
    });

    test('should handle null itemValue', () => {
      // Arrange
      const testFilter: FilteringConfig = {
        name: {
          value: [{ label: 'j', value: 'j' }],
          matchMode: FilterMode.StartsWidth,
          operator: FilterOperator.And,
        },
      };
      testData.push({
        name: null,
        age: '40',
        dateOfBirth: '10-10-1980',
      });

      // Act
      const result = filterData(testData, testFilter);

      // Assert
      expect(result.length).toBe(2);
    });
  });

  describe('compareFilterEquality', () => {
    test('should return true for two identical primitive values', () => {
      // Arrange
      const value1 = 42;
      const value2 = 42;

      // Act
      const result = compareFilterEquality(value1, value2);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false for two different primitive values', () => {
      // Arrange
      const value1 = 42;
      const value2 = 43;

      // Act
      const result = compareFilterEquality(value1, value2);

      // Assert
      expect(result).toBe(false);
    });

    test('should return true for two identical objects', () => {
      // Arrange
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 2 };

      // Act
      const result = compareFilterEquality(obj1, obj2);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false for two objects with different properties', () => {
      // Arrange
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };

      // Act
      const result = compareFilterEquality(obj1, obj2);

      // Assert
      expect(result).toBe(false);
    });

    test('should return true if objects have common properties with the same value', () => {
      // Arrange
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, c: 2 };

      // Act
      const result = compareFilterEquality(obj1, obj2);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false if objects have common properties but with different values', () => {
      // Arrange
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 2, c: 2 };

      // Act
      const result = compareFilterEquality(obj1, obj2);

      // Assert
      expect(result).toBe(false);
    });

    test('should return true for two identical nested objects', () => {
      // Arrange
      const obj1 = { a: 1, b: { c: 2, d: 3 } };
      const obj2 = { a: 1, b: { c: 2, d: 3 } };

      // Act
      const result = compareFilterEquality(obj1, obj2);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false for two different nested objects', () => {
      // Arrange
      const obj1 = { a: 1, b: { c: 2, d: 3 } };
      const obj2 = { a: 1, b: { c: 2, d: 4 } };

      // Act
      const result = compareFilterEquality(obj1, obj2);

      // Assert
      expect(result).toBe(false);
    });

    test('should return true for two identical arrays', () => {
      // Arrange
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3];

      // Act
      const result = compareFilterEquality(arr1, arr2);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false for arrays of different lengths', () => {
      // Arrange
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2];

      // Act
      const result = compareFilterEquality(arr1, arr2);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for arrays with different elements', () => {
      // Arrange
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 4];

      // Act
      const result = compareFilterEquality(arr1, arr2);

      // Assert
      expect(result).toBe(false);
    });

    test('should return true for deeply nested arrays and objects', () => {
      // Arrange
      const obj1 = { a: [1, { b: [2, 3] }], c: 4 };
      const obj2 = { a: [1, { b: [3, 2] }], c: 4 };

      // Act
      const result = compareFilterEquality(obj1, obj2);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false for different null values', () => {
      // Arrange
      const obj1 = { a: null };
      const obj2 = { a: undefined };

      // Act
      const result = compareFilterEquality(obj1, obj2);

      // Assert
      expect(result).toBe(false);
    });

    test('should return true for two identical empty objects', () => {
      // Arrange
      const obj1 = {};
      const obj2 = {};

      // Act
      const result = compareFilterEquality(obj1, obj2);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true for two identical empty arrays', () => {
      // Arrange
      const arr1: any[] = [];
      const arr2: any[] = [];

      // Act
      const result = compareFilterEquality(arr1, arr2);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true for objects with identical references', () => {
      // Arrange
      const obj1 = { a: 1 };
      const obj2 = obj1;

      // Act
      const result = compareFilterEquality(obj1, obj2);

      // Assert
      expect(result).toBe(true);
    });

    test('should return true for arrays with identical references', () => {
      // Arrange
      const arr1 = [1, 2, 3];
      const arr2 = arr1;

      // Act
      const result = compareFilterEquality(arr1, arr2);

      // Assert
      expect(result).toBe(true);
    });

    test('should return false for comparing a primitive with an object', () => {
      // Arrange
      const value = 42;
      const obj = { a: 42 };

      // Act
      const result = compareFilterEquality(value, obj);

      // Assert
      expect(result).toBe(false);
    });

    test('should return false for comparing an array with an object', () => {
      // Arrange
      const arr = [1, 2, 3];
      const obj = { 0: 1, 1: 2, 2: 3 };

      // Act
      const result = compareFilterEquality(arr, obj);

      // Assert
      expect(result).toBe(false);
    });

    test('should return true for comparing an empty array with null', () => {
      // Arrange
      const arr: any[] = [];
      const obj = null;

      // Act
      const result = compareFilterEquality(arr, obj);

      // Assert
      expect(result).toBe(true);
    });
  });
});
