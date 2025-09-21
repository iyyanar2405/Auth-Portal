import { FilterMetadata, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';

import { DEFAULT_FILTERS_MAP } from '../../../constants';
import { createGridConfig } from '../../../helpers';
import {
  ActiveFilterTag,
  CellType,
  ColumnDefinition,
  ColumnType,
  FilterMode,
  GridLazyLoadEvent,
  PreferenceDataModel,
} from '../../../models';
import { GridComponent } from './grid.component';

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

describe('GridComponent', () => {
  let component: GridComponent;
  let dataTableMock: jest.Mocked<Partial<Table>>;
  let savePreferenceSpy: any;
  let updateDisplaySaveBtnVisibilitySpy: any;

  beforeEach(async () => {
    component = new GridComponent();
    savePreferenceSpy = jest.spyOn(component.savePreference, 'emit');
    updateDisplaySaveBtnVisibilitySpy = jest.spyOn(
      component as any,
      'updateDisplaySaveBtnVisibility',
    );
    dataTableMock = {
      _filter: jest.fn(),
      filters: {},
      clear: jest.fn(),
      filter: jest.fn(),
      _sortOrder: {},
      _multiSortMeta: {},
      tableService: {
        onSort: jest.fn(),
        onFilter: jest.fn(),
        onValueChange: jest.fn(),
      },
      value: [],
      columns: [],
      reset: jest.fn(),
      sort: jest.fn(),
      toggleRow: jest.fn(),
    } as unknown as jest.Mocked<Partial<Table>>;
    component.columns = [
      {
        field: 'findingNumber',
        displayName: 'Finding #',
        type: ColumnType.SearchCheckboxFilter,
        cellType: CellType.Link,
        hidden: false,
        fixed: false,
        sticky: false,
      },
      {
        field: 'status',
        displayName: 'Status',
        type: ColumnType.CheckboxFilter,
        cellType: CellType.Status,
        hidden: false,
        fixed: false,
        sticky: false,
      },
      {
        field: 'title',
        displayName: 'Title',
        type: ColumnType.SearchCheckboxFilter,
        cellType: CellType.Text,
        hidden: false,
        fixed: false,
        sticky: false,
      },
      {
        field: 'category',
        displayName: 'Category',
        type: ColumnType.SearchCheckboxFilter,
        cellType: CellType.Tag,
        hidden: false,
        fixed: false,
        sticky: false,
      },
      {
        field: 'services',
        displayName: 'Services',
        type: ColumnType.SearchCheckboxFilter,
        cellType: CellType.Text,
        hidden: false,
        fixed: false,
        sticky: false,
      },
    ];
    component.dataTable = dataTableMock as jest.Mocked<Table>;
    component.ngOnInit();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isPaginationVisible', () => {
    test('should return true if totalRecords is greater than value in rows and paginator is true', () => {
      // Arrange
      component.totalRecords = 20;
      component.rows = 10;
      component.paginator = true;

      // Assert
      expect(component.isPaginationVisible).toEqual(true);
    });

    test('should return false if totalRecords is greater than value in rows and paginator is false', () => {
      // Arrange
      component.totalRecords = 20;
      component.rows = 10;
      component.paginator = false;

      // Assert
      expect(component.isPaginationVisible).toEqual(false);
    });

    test('should return false if totalRecords is less than or equal to the value in rows and paginator is true', () => {
      // Arrange
      component.totalRecords = 10;
      component.rows = 10;
      component.paginator = true;

      // Assert
      expect(component.isPaginationVisible).toEqual(false);
    });

    test('should return false if totalRecords is less than or equal to the value in rows and paginator is false', () => {
      // Arrange
      component.totalRecords = 10;
      component.rows = 10;
      component.paginator = false;

      // Assert
      expect(component.isPaginationVisible).toEqual(false);
    });
  });

  describe('isGridEmpty', () => {
    test('should return true when totalRecords is 0', () => {
      // Arrange
      component.totalRecords = 0;

      // Assert
      expect(component.isGridEmpty).toEqual(true);
    });

    test('should return false when totalRecords is greater than 0', () => {
      // Arrange
      component.totalRecords = 5;

      // Assert
      expect(component.isGridEmpty).toEqual(false);
    });
  });

  describe('preferenceData', () => {
    test('should deep copy preferenceData using structuredClone', () => {
      // Arrange
      const preferenceData: PreferenceDataModel = {
        filters: {
          someFilter: { value: 'test' },
        },
        rowsPerPage: 10,
        columns: [{ name: 'Column1' }],
        showDefaultColumnsButton: true,
      };

      const cloneSpy = jest.spyOn(globalThis, 'structuredClone');

      // Act
      component.preferenceData = preferenceData;

      // Assert
      expect(cloneSpy).toHaveBeenCalledWith(preferenceData);
      cloneSpy.mockRestore();
    });

    test('should set preferenceToSave with a deep copy of preferenceData', () => {
      // Arrange
      const preferenceData: PreferenceDataModel = {
        filters: {
          someFilter: { value: 'test' },
        },
        rowsPerPage: 10,
        columns: [{ name: 'Column1' }],
        showDefaultColumnsButton: true,
      };

      // Act
      component.preferenceData = preferenceData;

      // Assert
      expect(component['preferenceToSave']).toEqual(preferenceData);
      expect(component['preferenceToSave']).not.toBe(preferenceData); // Ensures it's a deep copy, not a reference
    });
  });

  describe('ngAfterViewInit', () => {
    test('should set preferenceData and apply filters, paginator size, and columns', (done) => {
      // Arrange
      const preferenceData = {
        filters: { name: { value: 'testFilter' } },
        rowsPerPage: 20,
        columns: [{ field: 'name', header: 'Name' }],
        showDefaultColumnsButton: true,
      };
      component.preferenceData = preferenceData;
      const refreshVisibleColumnsSpy = jest.spyOn(
        component as any,
        'refreshVisibleColumns',
      );

      // Act
      component.ngAfterViewInit();

      // Assert
      expect(dataTableMock._filter).toHaveBeenCalled();
      expect((component as any).preferenceToSave).toEqual(preferenceData);
      expect(dataTableMock.filters).toEqual(preferenceData.filters);
      expect(component.rows).toBe(preferenceData.rowsPerPage);
      expect(component.userSortedCols).toEqual(preferenceData.columns);
      expect(component.showDefaultColumnsButton).toBe(true);
      setTimeout(() => {
        expect(refreshVisibleColumnsSpy).toHaveBeenCalled();
        done();
      }, 0);
    });
  });

  describe('onInit', () => {
    test('should call resizeTableCell with window width and initialize userSortedCols and colsNo', () => {
      // Act
      component.ngOnInit();

      // Assert
      expect(component.userSortedCols).toEqual(component.columns);
      expect(component.colsNo).toBe(String(component.columns.length));
    });

    test('should set colsNo as the string length of columns', () => {
      // Act
      component.ngOnInit();

      // Assert
      expect(component.colsNo).toBe('5');
    });

    test('should set userSortedCols with a deep copy of columns', () => {
      // Act
      component.ngOnInit();

      // Assert
      expect(component.userSortedCols).toEqual(component.columns);
      expect(component.userSortedCols).not.toBe(component.columns); // Ensures it's a deep copy, not a reference
    });
  });

  test('should save filters', () => {
    // Arrange
    (component as any).actualFilters = {
      auditNumber: [
        {
          value: [],
          matchMode: 'in',
          operator: 'and',
        },
      ],
      status: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
      service: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
      site: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
      city: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
    };
    component.userSortedCols = [
      {
        field: 'auditNumber',
        displayName: 'audit.auditList.auditNumber',
        type: 'searchCheckboxFilter',
        cellType: 'link',
        disabled: false,
        fixed: true,
      },
      {
        field: 'status',
        displayName: 'audit.auditList.status',
        type: 'checkboxFilter',
        cellType: 'status',
        disabled: false,
        fixed: false,
      },
      {
        field: 'service',
        displayName: 'audit.auditList.service',
        type: 'searchCheckboxFilter',
        cellType: 'text',
        disabled: false,
        fixed: false,
      },
      {
        field: 'site',
        displayName: 'audit.auditList.site',
        type: 'searchCheckboxFilter',
        cellType: 'text',
        disabled: false,
        fixed: false,
      },
      {
        field: 'city',
        displayName: 'audit.auditList.city',
        type: 'searchCheckboxFilter',
        cellType: 'text',
        disabled: false,
        fixed: false,
      },
      {
        field: 'type',
        displayName: 'audit.auditList.type',
        type: 'checkboxFilter',
        cellType: 'text',
        disabled: true,
        fixed: false,
      },
      {
        field: 'startDate',
        displayName: 'audit.auditList.startDate',
        type: 'dateFilter',
        cellType: 'date',
        disabled: true,
        fixed: false,
      },
      {
        field: 'endDate',
        displayName: 'audit.auditList.endDate',
        type: 'dateFilter',
        cellType: 'date',
        disabled: true,
        fixed: false,
      },
      {
        field: 'leadAuthor',
        displayName: 'audit.auditList.leadAuthor',
        type: 'checkboxFilter',
        cellType: 'text',
        disabled: true,
        fixed: false,
      },
    ];
    const expectedFiltersToSave = {
      auditNumber: [
        {
          value: [],
          matchMode: 'in',
          operator: 'and',
        },
      ],
      status: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
      service: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
      site: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
      city: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
      type: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
      startDate: [
        {
          matchMode: 'dateAfter',
          operator: 'and',
          value: [],
        },
      ],
      endDate: [
        {
          matchMode: 'dateAfter',
          operator: 'and',
          value: [],
        },
      ],
      leadAuthor: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
    };

    // Act
    component.onSaveFiltersClick();

    // Assert
    expect((component as any).preferenceToSave.filters).toEqual(
      expectedFiltersToSave,
    );
    expect(savePreferenceSpy).toHaveBeenCalledWith({
      filters: expectedFiltersToSave,
    });
    expect(updateDisplaySaveBtnVisibilitySpy).toHaveBeenCalled();
  });

  test('should save paginator size', () => {
    // Arrange
    const actualRows = 30;

    (component as any).actualRows = actualRows;

    // Act
    component.onSelectPaginationRows();

    // Assert
    expect((component as any).preferenceToSave.rowsPerPage).toBe(actualRows);
    expect(savePreferenceSpy).toHaveBeenCalledWith({
      rowsPerPage: actualRows,
    });
  });

  describe('onSaveIndividualFilter', () => {
    const activeFilterTag: ActiveFilterTag = {
      field: 'status',
      value: 'ACCEPTED',
      label: 'Accepted',
      displayName: 'type',
    };
    beforeEach(() => {
      (component as any).actualFilters = {
        status: [
          {
            value: [
              { label: 'OPEN', value: 'OPEN' },
              { label: 'ACCEPTED', value: 'ACCEPTED' },
            ],
            matchMode: 'in',
            operator: 'and',
          },
        ],
      };
      component.preferenceToSave = {
        filters: {
          status: [
            {
              value: [{ label: 'OPEN', value: 'OPEN' }],
              matchMode: 'in',
              operator: 'and',
            },
          ],
        },
      };
    });
    test('should merge values from actualFilters and preferences, and deduplicate them', () => {
      // Arrange
      const expectedFiltersToSave = [
        { label: 'OPEN', value: 'OPEN' },
        { label: 'ACCEPTED', value: 'ACCEPTED' },
      ];

      // Act
      component.onSaveIndividualFilter(activeFilterTag);
      const actualPreferenceToSave = component.preferenceToSave.filters![
        'status'
      ] as FilterMetadata[];

      // Assert
      expect(actualPreferenceToSave[0].value).toEqual(expectedFiltersToSave);
      expect(component.savePreference.emit).toHaveBeenCalledWith(
        component.preferenceToSave,
      );
      expect(updateDisplaySaveBtnVisibilitySpy).toHaveBeenCalled();
    });

    test('should not add duplicate values from actualFilters', () => {
      // Arrange
      const filterTag: ActiveFilterTag = {
        field: 'status',
        value: 'OPEN',
        label: 'open',
        displayName: 'type',
      };

      // Act
      component.onSaveIndividualFilter(filterTag);
      const actualPreferenceToSave = component.preferenceToSave.filters![
        'status'
      ] as FilterMetadata[];

      // Arrange
      expect(actualPreferenceToSave[0].value).toEqual([
        { label: 'OPEN', value: 'OPEN' },
      ]);
      expect(component.savePreference.emit).toHaveBeenCalledWith(
        component.preferenceToSave,
      );
    });

    test('should add a value from actualFilters if it is not in preferences', () => {
      // Arrange
      component.preferenceToSave.filters = { status: [] };

      // Act
      component.onSaveIndividualFilter(activeFilterTag);
      const actualPreferenceToSave = component.preferenceToSave.filters![
        'status'
      ] as FilterMetadata[];

      // Assert
      expect(actualPreferenceToSave[0].value).toEqual([
        { label: 'ACCEPTED', value: 'ACCEPTED' },
      ]);
      expect(component.savePreference.emit).toHaveBeenCalledWith(
        component.preferenceToSave,
      );
    });

    test('should handle an empty preferenceToSave filters', () => {
      // Arrange
      component.preferenceToSave.filters = {};

      // Act
      component.onSaveIndividualFilter(activeFilterTag);
      const actualPreferenceToSave = component.preferenceToSave.filters![
        'status'
      ] as FilterMetadata[];

      // Assert
      expect(actualPreferenceToSave[0].value).toEqual([
        { label: 'ACCEPTED', value: 'ACCEPTED' },
      ]);
      expect(component.savePreference.emit).toHaveBeenCalledWith(
        component.preferenceToSave,
      );
    });
  });

  describe('onDeleteIndividualFilter', () => {
    beforeEach(() => {
      (component as any).actualFilters = {
        status: [
          {
            value: [
              { label: 'OPEN', value: 'OPEN' },
              { label: 'ACCEPTED', value: 'ACCEPTED' },
            ],
            matchMode: 'in',
            operator: 'and',
          },
        ],
      };

      component.preferenceToSave = {
        filters: {
          status: [
            {
              value: [
                { label: 'OPEN', value: 'OPEN' },
                { label: 'ACCEPTED', value: 'ACCEPTED' },
              ],
              matchMode: 'in',
              operator: 'and',
            },
          ],
        },
      };
      component.userSortedCols = [{ field: 'status', type: 'checkboxFilter' }];
    });

    test('should remove the matching value from preferences', () => {
      // Arrange
      const activeFilter: ActiveFilterTag = {
        field: 'status',
        value: 'ACCEPTED',
        label: 'Accepted',
        displayName: 'type',
      };

      // Act
      component.onDeleteIndividualFilter(activeFilter);
      const actualPreferenceToSave = component.preferenceToSave.filters![
        'status'
      ] as FilterMetadata[];

      // Assert
      expect(actualPreferenceToSave[0].value).toEqual([
        { label: 'OPEN', value: 'OPEN' },
      ]);
      expect(component.savePreference.emit).toHaveBeenCalledWith(
        component.preferenceToSave,
      );
      expect(updateDisplaySaveBtnVisibilitySpy).toHaveBeenCalled();
    });

    test('should reset to default filter if all values are removed', () => {
      // Arrange
      const activeFilter: ActiveFilterTag = {
        field: 'status',
        value: 'OPEN',
        label: 'Open',
        displayName: 'type',
      };

      component.preferenceToSave.filters = {
        status: [
          {
            value: [{ label: 'OPEN', value: 'OPEN' }],
            matchMode: 'in',
            operator: 'and',
          },
        ],
      };

      // Act
      component.onDeleteIndividualFilter(activeFilter);
      const actualPreferenceToSave = component.preferenceToSave.filters![
        'status'
      ] as FilterMetadata[];

      // Assert
      expect(actualPreferenceToSave[0]).toEqual(
        DEFAULT_FILTERS_MAP['checkboxFilter'],
      );
      expect(component.savePreference.emit).toHaveBeenCalledWith(
        component.preferenceToSave,
      );
    });

    test('should do nothing if there is no matching value', () => {
      // Arrange
      const activeFilter: ActiveFilterTag = {
        field: 'status',
        value: 'CLOSED',
        label: 'Closed',
        displayName: 'type',
      };

      // Act
      component.onDeleteIndividualFilter(activeFilter);
      const actualPreferenceToSave = component.preferenceToSave.filters![
        'status'
      ] as FilterMetadata[];

      // Assert
      expect(actualPreferenceToSave[0].value).toEqual([
        { label: 'OPEN', value: 'OPEN' },
        { label: 'ACCEPTED', value: 'ACCEPTED' },
      ]);
      expect(component.savePreference.emit).toHaveBeenCalledWith(
        component.preferenceToSave,
      );
    });

    test('should handle empty preferenceToSave.filters', () => {
      // Arrange
      const activeFilter: ActiveFilterTag = {
        field: 'status',
        value: 'OPEN',
        label: 'Open',
        displayName: 'type',
      };
      component.preferenceToSave.filters = {};

      // Act
      component.onDeleteIndividualFilter(activeFilter);
      const actualPreferenceToSave = component.preferenceToSave.filters![
        'status'
      ] as FilterMetadata[];

      // Assert
      expect(actualPreferenceToSave[0]).toEqual(
        DEFAULT_FILTERS_MAP['checkboxFilter'],
      );
      expect(component.savePreference.emit).toHaveBeenCalledWith(
        component.preferenceToSave,
      );
    });
  });

  test('should apply and save columns preferences, delete filter and sort for disabled columns', () => {
    // Arrange
    const visibleColumn: ColumnDefinition = {
      field: 'category',
      displayName: 'Category',
      type: ColumnType.SearchCheckboxFilter,
      cellType: CellType.Checkbox,
      hidden: false,
      fixed: false,
      sticky: false,
    };
    const columns: ColumnDefinition[] = [
      {
        field: 'status',
        displayName: 'Status',
        type: ColumnType.CheckboxFilter,
        cellType: CellType.Checkbox,
        hidden: true,
        fixed: false,
        sticky: false,
      },
      visibleColumn,
    ];
    component.showDefaultColumnsButton = false;

    // Act
    component.onGridColumnsApplyClicked(columns);

    // Assert
    expect(component.userSortedCols).toEqual(columns);
    expect(component.visibleCols).toEqual([visibleColumn]);
    expect(dataTableMock.filter).toHaveBeenCalledWith(
      null,
      'status',
      FilterMode.In,
    );
    expect(component.showDefaultColumnsButton).toBe(true);
    expect(savePreferenceSpy).toHaveBeenCalledWith({
      columns,
      showDefaultColumnsButton: true,
    });
    expect(dataTableMock.tableService?.onSort).toHaveBeenCalledWith(null);
  });

  test('should default to intial columns preferences', () => {
    // Arrange
    component.columns = [
      {
        field: 'status',
        displayName: 'Status',
        type: ColumnType.CheckboxFilter,
        cellType: CellType.Checkbox,
        hidden: false,
        fixed: false,
        sticky: false,
      },
      {
        field: 'category',
        displayName: 'Category',
        type: ColumnType.SearchCheckboxFilter,
        hidden: false,
        cellType: CellType.Checkbox,
        fixed: false,
        sticky: false,
      },
    ];
    component.showDefaultColumnsButton = true;

    // Act
    component.onGridColumnDefaultClicked();

    // Assert
    expect(component.userSortedCols).toEqual(component.columns);
    expect(component.visibleCols).toEqual(component.columns);
    expect(component.showDefaultColumnsButton).toBe(false);
    expect(savePreferenceSpy).toHaveBeenCalledWith({
      columns: [],
      showDefaultColumnsButton: false,
    });
  });

  test('should call _filter on table when clearFilters is called, reset all filters in table & save', () => {
    // Arrange
    const saveFiltersClickSpy = jest.spyOn(component, 'onSaveFiltersClick');
    component.userSortedCols = [
      {
        field: 'auditNumber',
        displayName: 'audit.auditList.auditNumber',
        type: 'searchCheckboxFilter',
        cellType: 'link',
        disabled: false,
        fixed: true,
      },
      {
        field: 'status',
        displayName: 'audit.auditList.status',
        type: 'checkboxFilter',
        cellType: 'status',
        disabled: false,
        fixed: false,
      },
      {
        field: 'service',
        displayName: 'audit.auditList.service',
        type: 'searchCheckboxFilter',
        cellType: 'text',
        disabled: false,
        fixed: false,
      },
      {
        field: 'site',
        displayName: 'audit.auditList.site',
        type: 'searchCheckboxFilter',
        cellType: 'text',
        disabled: false,
        fixed: false,
      },
    ];
    dataTableMock.filters = {
      auditNumber: [
        {
          value: ['a'],
          matchMode: 'in',
          operator: 'and',
        },
      ],
      status: [
        {
          matchMode: 'in',
          operator: 'and',
          value: ['b'],
        },
      ],
      service: [
        {
          matchMode: 'in',
          operator: 'and',
          value: ['c'],
        },
      ],
    };
    const expectedFilters = {
      auditNumber: [
        {
          value: [],
          matchMode: 'in',
          operator: 'and',
        },
      ],
      status: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
      service: [
        {
          matchMode: 'in',
          operator: 'and',
          value: [],
        },
      ],
    };

    // Act
    component.clearFilters();

    // Assert
    expect(dataTableMock._filter).toHaveBeenCalled();
    expect(dataTableMock.filters).toEqual(expectedFilters);
    expect(saveFiltersClickSpy).toHaveBeenCalled();
  });

  describe('onLazyLoadChanged', () => {
    test('should emit gridConfigChangedEvent and update saveFilter button visibility', () => {
      // Arrange
      const spy = jest.spyOn(component.gridConfigChangedEvent, 'emit');
      const event = {
        first: 0,
        rows: 10,
        paginationEnabled: true,
      } as GridLazyLoadEvent;
      const gridConfig = createGridConfig(event);

      // Act
      component.onLazyLoadChanged(event);

      // Assert
      expect(spy).toHaveBeenCalledWith(gridConfig);
      expect(updateDisplaySaveBtnVisibilitySpy).toHaveBeenCalled();
    });

    test('should initialize filter preferences when are empty', () => {
      const filters = {
        auditNumber: [
          {
            value: [],
            matchMode: 'in',
            operator: 'and',
          },
        ],
        status: [
          {
            matchMode: 'in',
            operator: 'and',
            value: [],
          },
        ],
        service: [
          {
            matchMode: 'in',
            operator: 'and',
            value: [],
          },
        ],
      };
      const event = {
        first: 0,
        rows: 10,
        paginationEnabled: true,
        filters,
      } as GridLazyLoadEvent;

      // Act
      component.onLazyLoadChanged(event);

      // Assert
      expect(component.preferenceToSave.filters).toEqual(filters);
    });
  });

  test('should call resizeTableCell with window innerWidth when window is resized with innerWidth smaller than 1700', () => {
    // Arrange
    const resizeTableCellSpy = jest.spyOn(component as any, 'resizeTableCell');
    const mockInnerWidth = 800;
    const event = new Event('resize');
    Object.defineProperty(event, 'target', {
      writable: true,
      value: { innerWidth: mockInnerWidth },
    });

    // Act
    window.dispatchEvent(event);
    component.onResize(event);

    // Assert
    expect(resizeTableCellSpy).toHaveBeenCalledWith(mockInnerWidth);
    expect(component.gridSizeConfig.minTdDefaultWidth).toBe('9rem');
  });

  test('should call resizeTableCell with window innerWidth when window is resized with innerWidth bigger than 1700', () => {
    // Arrange
    const resizeTableCellSpy = jest.spyOn(component as any, 'resizeTableCell');
    const mockInnerWidth = 1800;
    const event = new Event('resize');
    Object.defineProperty(event, 'target', {
      writable: true,
      value: { innerWidth: mockInnerWidth },
    });

    // Act
    window.dispatchEvent(event);
    component.onResize(event);

    // Assert
    expect(resizeTableCellSpy).toHaveBeenCalledWith(mockInnerWidth);
    expect(component.gridSizeConfig.minTdDefaultWidth).toBe('10rem');
  });

  test('should call resizeTableCell with window innerWidth when window is resized with innerWidth bigger than 2000', () => {
    // Arrange
    const resizeTableCellSpy = jest.spyOn(component as any, 'resizeTableCell');
    const mockInnerWidth = 2100;
    const event = new Event('resize');
    Object.defineProperty(event, 'target', {
      writable: true,
      value: { innerWidth: mockInnerWidth },
    });

    // Act
    window.dispatchEvent(event);
    component.onResize(event);

    // Assert
    expect(resizeTableCellSpy).toHaveBeenCalledWith(mockInnerWidth);
    expect(component.gridSizeConfig.minTdDefaultWidth).toBe('14rem');
  });

  test('should remove the specified filter tag when onRemoveFilterTags is called', () => {
    // Arrange
    const filterToRemove = { fieldName: 'category', filterValue: 'Service' };
    component.dataTable.filters = {
      category: [{ value: [{ value: 'Service' }] }],
    };
    const filterSpy = jest.spyOn(component.dataTable, '_filter');

    // Act
    component.onRemoveFilterTags(filterToRemove);

    // Assert
    expect((component.dataTable.filters['category'] as any)[0].value).toEqual(
      [],
    );
    expect(filterSpy).toHaveBeenCalled();
  });

  test('should change rows number and filter when onChangeRows is called', () => {
    // Arrange
    component.dataTable.filters = {};
    const filterSpy = jest.spyOn(component.dataTable, '_filter');

    // Act
    component.onChangeRows(20);

    // Assert
    expect(component.dataTable._rows).toBe(20);
    expect(filterSpy).toHaveBeenCalled();
  });

  test('should return correct match mode based on field name', () => {
    // Assert
    expect(component.getMatchMode('startDate')).toBe('dateAfter');
    expect(component.getMatchMode('endDate')).toBe('dateBefore');
  });

  test('should call resizeTableCell with window innerWidth when window is resized with innerWidth smaller than 1700', () => {
    // Arrange
    const resizeTableCellSpy = jest.spyOn(component as any, 'resizeTableCell');
    const mockInnerWidth = 800;
    const event = new Event('resize');
    Object.defineProperty(event, 'target', {
      writable: true,
      value: { innerWidth: mockInnerWidth },
    });

    // Act
    window.dispatchEvent(event);
    component.onResize(event);

    // Assert
    expect(resizeTableCellSpy).toHaveBeenCalledWith(mockInnerWidth);
    expect(component.gridSizeConfig.minTdDefaultWidth).toBe('9rem');
  });

  test('should call resizeTableCell with window innerWidth when window is resized with innerWidth larger than 2000', () => {
    // Arrange
    const resizeTableCellSpy = jest.spyOn(component as any, 'resizeTableCell');
    const mockInnerWidth = 2100;
    const event = new Event('resize');
    Object.defineProperty(event, 'target', {
      writable: true,
      value: { innerWidth: mockInnerWidth },
    });

    // Act
    window.dispatchEvent(event);
    component.onResize(event);

    // Assert
    expect(resizeTableCellSpy).toHaveBeenCalledWith(mockInnerWidth);
    expect(component.gridSizeConfig.minTdDefaultWidth).toBe('14rem');
  });

  test('should set widths correctly for window width > 2000', () => {
    // Arrange
    const width = 2100;

    // Act
    (component as any).resizeTableCell(width);

    // Assert
    expect(component.gridSizeConfig.minTdDefaultWidth).toBe('14rem');
    expect(component.gridSizeConfig.minStatusTdDefaultWidth).toBe('18rem');
    expect(component.gridSizeConfig.minTdDateWidth).toBe('18rem');
    expect(component.gridSizeConfig.minTdActionsWidth).toBe('15rem');
  });

  test('should set widths correctly for window width between 1700 and 2000', () => {
    // Arrange
    const width = 1800;

    // Act
    (component as any).resizeTableCell(width);

    // Assert
    expect(component.gridSizeConfig.minTdDefaultWidth).toBe('10rem');
    expect(component.gridSizeConfig.minStatusTdDefaultWidth).toBe('14rem');
    expect(component.gridSizeConfig.minTdDateWidth).toBe('14rem');
    expect(component.gridSizeConfig.minTdActionsWidth).toBe('15rem');
  });

  test('should set widths correctly for window width <= 1700>', () => {
    // Arrange
    const width = 1700;

    // Act
    (component as any).resizeTableCell(width);

    // Assert
    expect(component.gridSizeConfig.minTdDefaultWidth).toBe('9rem');
    expect(component.gridSizeConfig.minStatusTdDefaultWidth).toBe('14rem');
    expect(component.gridSizeConfig.minTdDateWidth).toBe('14rem');
    expect(component.gridSizeConfig.minTdActionsWidth).toBe('15rem');
  });

  describe('customSort', () => {
    test('should set isSorted to true when no previous sorting and sort field changes', () => {
      // Arrange
      const event: SortEvent = { field: 'name' };
      component['isSorted'] = null;
      component['currentSortField'] = 'age';

      // Act
      component.customSort(event);

      // Assert
      expect(component['isSorted']).toBe(true);
      expect(component['currentSortField']).toBe('name');
    });

    test('should set isSorted to false when already sorted and the same field is sorted again', () => {
      // Arrange
      const event: SortEvent = { field: 'name' };
      component['isSorted'] = true;
      component['currentSortField'] = 'name';

      // Act
      component.customSort(event);

      // Assert
      expect(component['isSorted']).toBe(false);
      expect(component['currentSortField']).toBe('name');
    });

    test('should set isSorted to null and reset dataTable when isSorted is false and the same field is sorted again', () => {
      // Arrange
      const event: SortEvent = { field: 'name' };
      component['isSorted'] = false;
      component['currentSortField'] = 'name';

      // Act
      component.customSort(event);

      // Assert
      expect(component['isSorted']).toBeNull();
      expect(component.dataTable.reset).toHaveBeenCalled();
      expect(component['currentSortField']).toBe('name');
    });

    test('should use multiSortMeta if event.field is undefined', () => {
      // Arrange
      const event: SortEvent = {
        field: undefined,
        multiSortMeta: [{ field: 'name', order: 1 }],
      };
      component['isSorted'] = null;
      component['currentSortField'] = 'age';

      // Act
      component.customSort(event);

      // Assert
      expect(component['isSorted']).toBe(true);
      expect(component['currentSortField']).toBe('name');
    });

    test('should set currentSortField to empty string if no field and no multiSortMeta provided', () => {
      // Arrange
      const event: SortEvent = { field: undefined, multiSortMeta: undefined };
      component['isSorted'] = null;
      component['currentSortField'] = 'age';

      // Act
      component.customSort(event);

      // Assert
      expect(component['isSorted']).toBe(true);
      expect(component['currentSortField']).toBe('');
    });
  });
});
