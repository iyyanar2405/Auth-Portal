import {
  ActiveFilterTag,
  CellType,
  ColumnType,
  FilteringConfig,
  FilterMode,
  FilterOperator,
  FilterTypeModel,
} from '../../../../models';
import { ActiveFilterTagsComponent } from './active-filter-tags.component';

describe('ActiveFilterTagsComponent', () => {
  let component: ActiveFilterTagsComponent;

  beforeEach(async () => {
    jest.clearAllMocks();
    component = new ActiveFilterTagsComponent();
    component.columns = [
      {
        field: 'auditNumber',
        displayName: 'Audit #',
        type: ColumnType.SearchCheckboxFilter,
        cellType: CellType.Link,
        hidden: false,
        fixed: true,
        sticky: false,
      },
      {
        field: 'status',
        displayName: 'Status',
        type: ColumnType.CheckboxFilter,
        cellType: CellType.Tag,
        hidden: false,
        fixed: false,
        sticky: false,
      },
      {
        field: 'service',
        displayName: 'Service',
        type: ColumnType.SearchCheckboxFilter,
        cellType: CellType.Text,
        hidden: false,
        fixed: false,
        sticky: false,
      },
      {
        field: 'startDate',
        displayName: 'Start Date',
        type: ColumnType.DateFilter,
        cellType: CellType.Date,
        hidden: false,
        fixed: false,
        sticky: false,
      },
    ];
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should trigger removeFilter output when on remove filter is call', () => {
    // Arrange
    const removeFilterSpy = jest.spyOn(component.removeFilter, 'emit');

    // Act
    component.onRemoveFilter({
      label: '',
      value: '',
      displayName: '',
      field: '',
    });

    // Assert
    expect(removeFilterSpy).toHaveBeenCalled();
  });

  test('should trigger removeFilter output 2 times if the removed filter is date', () => {
    // Arrange
    const removeFilterSpy = jest.spyOn(component.removeFilter, 'emit');

    // Act
    component.onRemoveFilter({
      label: '11-11-2021 - 12-11-2021',
      values: ['11-11-2021', '12-11-2021'],
      displayName: 'Start Date',
      field: 'startDate',
    });

    // Assert
    expect(removeFilterSpy).toHaveBeenCalledTimes(2);
    expect(removeFilterSpy).toHaveBeenNthCalledWith(1, {
      fieldName: 'startDate',
      filterValue: '11-11-2021',
    });
    expect(removeFilterSpy).toHaveBeenNthCalledWith(2, {
      fieldName: 'startDate',
      filterValue: '12-11-2021',
    });
  });

  test('should trigger once saveFilter output when handleFilterPreferenceAction is called with FilterPreferenceAction.Save and tag is not date', () => {
    // Arrange
    const saveFilterSpy = jest.spyOn(component.saveFilter, 'emit');

    // Act
    component.handleFilterPreferenceAction(
      {
        label: '',
        value: '',
        displayName: '',
        field: 'status',
        isSaved: false,
      },
      component.FilterPreferenceAction.Save,
    );

    // Assert
    expect(saveFilterSpy).toHaveBeenCalledTimes(1);
  });

  test('should trigger twice saveFilter output when handleFilterPreferenceAction is called with FilterPreferenceAction.Save and tag date', () => {
    // Arrange
    const saveFilterSpy = jest.spyOn(component.saveFilter, 'emit');

    // Act
    component.handleFilterPreferenceAction(
      {
        label: '11-11-2021 - 12-11-2021',
        values: ['11-11-2021', '12-11-2021'],
        displayName: 'Start Date',
        field: 'startDate',
        isSaved: false,
      },
      component.FilterPreferenceAction.Save,
    );

    // Assert
    expect(saveFilterSpy).toHaveBeenCalledTimes(2);
  });

  test('should trigger once deleteSavedFilter output when handleFilterPreferenceAction is called with FilterPreferenceAction.Delete and tag is not date', () => {
    // Arrange
    const deleteSavedFilterSpy = jest.spyOn(
      component.deleteSavedFilter,
      'emit',
    );

    // Act
    component.handleFilterPreferenceAction(
      {
        label: '',
        value: '',
        displayName: '',
        field: 'status',
        isSaved: false,
      },
      component.FilterPreferenceAction.Delete,
    );

    // Assert
    expect(deleteSavedFilterSpy).toHaveBeenCalledTimes(1);
  });

  test('should trigger twice deleteSavedFilter output when handleFilterPreferenceAction is called with FilterPreferenceAction.Delete and tag date', () => {
    // Arrange
    const deleteSavedFilterSpy = jest.spyOn(
      component.deleteSavedFilter,
      'emit',
    );

    // Act
    component.handleFilterPreferenceAction(
      {
        label: '11-11-2021 - 12-11-2021',
        values: ['11-11-2021', '12-11-2021'],
        displayName: 'Start Date',
        field: 'startDate',
        isSaved: false,
      },
      component.FilterPreferenceAction.Delete,
    );

    // Assert
    expect(deleteSavedFilterSpy).toHaveBeenCalledTimes(2);
  });

  test('should update activeFilter after filtering config changes', () => {
    // Arrange
    const activeFiltersSpy = jest.spyOn(component.activeFilters, 'set');
    const updatesAfterFilteringSpy = jest.spyOn(
      component as any,
      'updatesAfterFilteringConfigChanges',
    );

    // Act
    component.filteringConfig = {
      key: {
        value: [{ label: 'text', value: 'text' }],
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
      },
    };

    // Assert
    expect(updatesAfterFilteringSpy).toHaveBeenCalled();
    expect(activeFiltersSpy).toHaveBeenCalledWith([
      {
        label: 'text',
        value: 'text',
        displayName: 'key',
        field: 'key',
        isSaved: false,
      },
    ]);
  });

  test('should call mapFiltersToActiveFilterTag after filtering config changes', () => {
    // Arrage
    const mapFilterSpy = jest.spyOn(
      component as any,
      'mapFiltersToActiveFilterTag',
    );

    // Act
    component.filteringConfig = {
      key: {
        value: [{ label: 'text', value: 'text' }],
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
      },
    };

    // Assert
    expect(mapFilterSpy).toHaveBeenCalled();
  });

  test('should call getFilterNameByField afer filtering config changes', () => {
    // Arrage
    const columnSpy = jest.spyOn(component as any, 'getFilterNameByField');

    // Act
    component.filteringConfig = {
      key: {
        value: [{ label: 'text', value: 'text' }],
        matchMode: FilterMode.In,
        operator: FilterOperator.And,
      },
    };

    // Assert
    expect(columnSpy).toHaveBeenCalledWith('key');
  });

  describe('mapFiltersToActiveFilterTag', () => {
    test('should map filters to active filter tags', () => {
      // Arrange
      const filteringConfig: FilteringConfig = {
        status: {
          value: [
            { label: 'Open', value: 'OPEN' },
            { label: 'Accepted', value: 'ACCEPTED' },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        service: {
          value: [{ label: 'Audit Service', value: 'AUDIT_SERVICE' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
        startDate: {
          value: [
            { label: '2021-01-01', value: '2021-01-01' },
            { label: '2021-01-02', value: '2021-01-02' },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result: ActiveFilterTag[] =
        component['mapFiltersToActiveFilterTag'](filteringConfig);

      // Assert
      expect(result).toEqual([
        {
          label: 'Open',
          value: 'OPEN',
          displayName: 'Status',
          field: 'status',
          isSaved: false,
        },
        {
          label: 'Accepted',
          value: 'ACCEPTED',
          displayName: 'Status',
          field: 'status',
          isSaved: false,
        },
        {
          label: 'Audit Service',
          value: 'AUDIT_SERVICE',
          displayName: 'Service',
          field: 'service',
          isSaved: false,
        },
        {
          label: '2021-01-01 - 2021-01-02',
          values: ['2021-01-01', '2021-01-02'],
          displayName: 'Start Date',
          field: 'startDate',
          isSaved: false,
        },
      ]);
    });

    test('should handle an empty filteringConfig object', () => {
      // Arrange
      const filteringConfig: FilteringConfig = {};

      // Act
      const result: ActiveFilterTag[] =
        component['mapFiltersToActiveFilterTag'](filteringConfig);

      // Assert
      expect(result).toEqual([]);
    });

    test('should handle a filteringConfig with an empty value array', () => {
      // Arrange
      const filteringConfig: FilteringConfig = {
        status: {
          value: [],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      // Act
      const result: ActiveFilterTag[] =
        component['mapFiltersToActiveFilterTag'](filteringConfig);

      // Assert
      expect(result).toEqual([]);
    });

    test('should map filters to active filter tags with isSaved flag correctly set', () => {
      // Arrange
      component.filteringConfig = {
        status: {
          value: [
            { label: 'Open', value: 'OPEN' },
            { label: 'Accepted', value: 'ACCEPTED' },
          ],
          matchMode: 'in',
          operator: 'and',
        },
      } as FilteringConfig;
      component.savedFilters = {
        status: [
          {
            value: [{ label: 'Open', value: 'OPEN' }],
          },
        ],
      } as FilterTypeModel;

      // Act
      const result: ActiveFilterTag[] = component[
        'mapFiltersToActiveFilterTag'
      ](component.filteringConfig);

      // Assert
      expect(result).toEqual([
        {
          label: 'Open',
          value: 'OPEN',
          displayName: 'Status',
          field: 'status',
          isSaved: true,
        },
        {
          label: 'Accepted',
          value: 'ACCEPTED',
          displayName: 'Status',
          field: 'status',
          isSaved: false,
        },
      ]);
    });

    test('should return true from isFilterSaved when value is equal in non-array savedFilter', () => {
      // Arrange
      component.filteringConfig = {
        status: {
          value: [{ label: 'Open', value: 'OPEN' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };
      component.savedFilters = {
        status: {
          value: 'OPEN',
        },
      } as FilterTypeModel;

      // Act
      const result: ActiveFilterTag[] = component[
        'mapFiltersToActiveFilterTag'
      ](component.filteringConfig);

      // Assert
      expect(result).toEqual([
        {
          label: 'Open',
          value: 'OPEN',
          displayName: 'Status',
          field: 'status',
          isSaved: true,
        },
      ]);
    });

    test('should return false from isFilterSaved when value is not equal in non-array savedFilter', () => {
      // Arrange
      component.filteringConfig = {
        status: {
          value: [{ label: 'Open', value: 'OPEN' }],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };
      component.savedFilters = {
        status: {
          value: 'CLOSED',
        },
      } as FilterTypeModel;

      // Act
      const result: ActiveFilterTag[] = component[
        'mapFiltersToActiveFilterTag'
      ](component.filteringConfig);

      // Assert
      expect(result).toEqual([
        {
          label: 'Open',
          value: 'OPEN',
          displayName: 'Status',
          field: 'status',
          isSaved: false,
        },
      ]);
    });

    test('should call getActiveFilterDateTag for date filters and merge the startDate and endDate in one tag', () => {
      // Arrange
      const filteringConfig: FilteringConfig = {
        startDate: {
          value: [
            { label: '2021-01-01', value: '2021-01-01' },
            { label: '2021-01-02', value: '2021-01-02' },
          ],
          matchMode: FilterMode.In,
          operator: FilterOperator.And,
        },
      };

      const getActiveFilterDateTagSpy = jest.spyOn(
        component as any,
        'getActiveFilterDateTag',
      );

      // Act
      const result: ActiveFilterTag[] =
        component['mapFiltersToActiveFilterTag'](filteringConfig);

      // Assert
      expect(getActiveFilterDateTagSpy).toHaveBeenCalled();
      expect(result).toEqual([
        {
          label: '2021-01-01 - 2021-01-02',
          values: ['2021-01-01', '2021-01-02'],
          displayName: 'Start Date',
          field: 'startDate',
          isSaved: false,
        },
      ]);
    });
  });
});
