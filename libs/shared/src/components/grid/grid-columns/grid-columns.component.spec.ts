import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TriStateCheckboxChangeEvent } from 'primeng/tristatecheckbox';

import { CellType, ColumnDefinition, ColumnType } from '../../../models';
import { GridColumnsComponent } from './grid-columns.component';

const COLS: ColumnDefinition[] = [
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
    field: 'site',
    displayName: 'Site',
    type: ColumnType.SearchCheckboxFilter,
    cellType: CellType.Text,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'city',
    displayName: 'City',
    type: ColumnType.SearchCheckboxFilter,
    cellType: CellType.Text,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'type',
    displayName: 'Type',
    type: ColumnType.CheckboxFilter,
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
  {
    field: 'endDate',
    displayName: 'End Date',
    type: ColumnType.DateFilter,
    cellType: CellType.Date,
    hidden: false,
    fixed: false,
    sticky: false,
  },
  {
    field: 'leadAuthor',
    displayName: 'Lead Auditor',
    type: ColumnType.CheckboxFilter,
    cellType: CellType.Text,
    hidden: false,
    fixed: false,
    sticky: false,
  },
];

describe('GridColumnsComponent', () => {
  let component: GridColumnsComponent;

  beforeEach(async () => {
    component = new GridColumnsComponent();
    component.columns = [...COLS];
    component.selectedColumns = ['auditNumber'];
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should update selectedColumns when onChangeSelectAll is called with true', () => {
    // Arrange
    component.onChangeSelectAll({ value: true } as TriStateCheckboxChangeEvent);

    // Assert
    expect(component.selectedColumns).toEqual([
      'auditNumber',
      'status',
      'service',
      'site',
      'city',
      'type',
      'startDate',
      'endDate',
      'leadAuthor',
    ]);
  });

  test('should update selectedColumns when onChangeSelectAll is called with false', () => {
    // Act
    component.onChangeSelectAll({
      value: false,
    } as TriStateCheckboxChangeEvent);

    // Assert
    expect(component.selectedColumns).toEqual(['auditNumber']);
  });

  test('should emit applied with updated columns on onApplyClick', () => {
    // Arrange
    const spy = jest.spyOn(component.applied, 'emit');

    // Act
    component.onApplyClick();

    // Assert
    expect(spy).toHaveBeenCalledWith(
      expect.arrayContaining(
        COLS.map((col) => ({
          ...col,
          hidden: !component.selectedColumns.includes(col.field),
        })),
      ),
    );
    expect(component.showApplyButton).toBe(false);
  });

  test('should emit defaulted on onDefaultClick', () => {
    // Arrange
    const spy = jest.spyOn(component.defaulted, 'emit');

    // Act
    component.onDefaultClick();

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  test('should update selectedColumns and showApplyButton when columnsChanged is called', () => {
    // Arrange
    component.selectedColumns = [];

    // Act
    component.columnsChanged();

    // Assert
    expect(component.showApplyButton).toBe(true);
    expect(component.showDefaultButton).toBe(false);
  });

  test('should handle drop event when column is not fixed', () => {
    // Arrange
    const event = {
      previousIndex: 2,
      currentIndex: 1,
    } as CdkDragDrop<string[]>;

    // Act
    component.drop(event);

    // Assert
    expect(component.columns[1].field).toBe('service');
    expect(component.columns[2].field).toBe('status');
    expect(component.showApplyButton).toBe(true);
    expect(component.showDefaultButton).toBe(false);
  });

  test('should not handle drop event when column is fixed', () => {
    // Arrange
    const event: CdkDragDrop<string[]> = {
      previousIndex: 1,
      currentIndex: 0,
    } as CdkDragDrop<string[]>;

    // Act
    component.drop(event);

    // Assert
    expect(component.columns[0].field).toBe('auditNumber');
    expect(component.columns[1].field).toBe('status');
    expect(component.dropListDisabled).toBe(false);
  });

  describe('updateSelectAllCheckbox', () => {
    test('should be false by default', () => {
      // Act
      (component as any).updateSelectAllCheckbox();

      // Assert
      expect(component.selectAll).toBe(false);
    });

    test('should be true when all selected columns', () => {
      // Arrange
      component.selectedColumns = COLS.map((col) => col.field);

      // Act
      (component as any).updateSelectAllCheckbox();

      // Assert
      expect(component.selectAll).toBe(true);
    });

    test('should be null when selected columns are empty', () => {
      // Arrange
      component.selectedColumns = [];

      // Act
      (component as any).updateSelectAllCheckbox();

      // Assert
      expect(component.selectAll).toBeNull();
    });
  });
});
