import { TreeNode, TreeTableNode } from 'primeng/api';

import { FilterValue, TreeNodeClick } from '../../models';
import { TreeTableComponent } from './tree-table.component';

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

describe('TreeTableComponent', () => {
  let component: TreeTableComponent<any>;

  beforeEach(async () => {
    jest.clearAllMocks();
    component = new TreeTableComponent();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should update data with structuredClone', () => {
    // Arrange
    const testData: TreeNode<{ field: string }>[] = [
      { data: { field: 'Test' }, children: [] },
    ];

    // Act
    component.data = testData;

    // Assert
    expect(component.data).toEqual(testData);
    expect(component.data).not.toBe(testData);
  });

  test('should emit cellClicked, rowClicked, and cellClickedSendTreeNode on onCellClick', () => {
    // Arrange
    const rowData = { field: 'TestField' };
    const field = 'TestValue';
    const rowNode = { node: { data: rowData } } as TreeTableNode<{
      field: string;
    }>;
    jest.spyOn(component.cellClicked, 'emit');
    jest.spyOn(component.rowClicked, 'emit');
    jest.spyOn(component.cellClickedSendTreeNode, 'emit');

    // Act
    component.onCellClick(rowData, field, rowNode);

    // Assert
    expect(component.cellClicked.emit).toHaveBeenCalledWith({
      label: 'TestField',
      value: 'TestValue',
    } as FilterValue);
    expect(component.rowClicked.emit).toHaveBeenCalledWith(rowData);
    expect(component.cellClickedSendTreeNode.emit).toHaveBeenCalledWith({
      rowNode,
      field,
    } as TreeNodeClick);
  });

  test('should return correct gradient class', () => {
    // Arrange
    component.globalCategories.set(1, 'gradient-class');

    // Act & Assert
    expect(component.getGradientClass(1, 'field')).toBe('gradient-class');
  });

  test('should return correct row classes', () => {
    // Arrange
    const rowNode = { node: { children: [{}] } } as any;

    // Act
    const classes = component.getRowClasses(rowNode);

    // Assert
    expect(classes).toEqual({ 'parent-row': true, 'terminal-row': false });
  });
});
