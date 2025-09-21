import { GridConfig, SortingMode } from '../../models';
import { GridConfigProcessor } from './grid-config.processor';
import { filterData } from './grid-filtering.helpers';
import { applyPagination } from './grid-pagination.helpers';
import { sortData } from './grid-sorting.helpers';

const mockData = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Alice', age: 25 },
  { id: 3, name: 'Bob', age: 35 },
];

const mockConfig: GridConfig = {
  filtering: {},
  sorting: {
    mode: SortingMode.Single,
    rules: [],
  },
  pagination: {
    paginationEnabled: true,
    startIndex: 0,
    pageSize: 10,
  },
};

describe('GridConfigProcessor', () => {
  let gridConfigProcessor: GridConfigProcessor<(typeof mockData)[0]>;

  beforeEach(() => {
    gridConfigProcessor = new GridConfigProcessor(mockData, mockConfig);
  });

  it('should filter data correctly', () => {
    // Arrange
    const filteredData = filterData(mockData, mockConfig.filtering);

    // Act
    const result = gridConfigProcessor.applyFilters().getData();

    // Assert
    expect(result).toEqual(filteredData);
  });

  it('should sort data correctly', () => {
    // Arrange
    const sortedData = sortData(mockData, mockConfig.sorting);

    // Act
    const result = gridConfigProcessor.applySorting().getData();

    // Assert
    expect(result).toEqual(sortedData);
  });

  it('should apply pagination correctly', () => {
    // Arrange
    const paginatedData = applyPagination(mockData, mockConfig.pagination);

    // Act
    const result = gridConfigProcessor.applyPagination();

    // Assert
    expect(result).toEqual(paginatedData);
  });
});
