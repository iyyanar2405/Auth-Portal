import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TreeNode, TreeTableNode } from 'primeng/api';
import { TreeTableModule } from 'primeng/treetable';

import { FilterValue, TreeColumnDefinition, TreeNodeClick } from '../../models';

@Component({
  selector: 'shared-tree-table',
  imports: [CommonModule, TranslocoDirective, TreeTableModule],
  templateUrl: './tree-table.component.html',
  styleUrl: './tree-table.component.scss',
})
export class TreeTableComponent<T extends { field: string }> {
  private _data: TreeNode<T>[] = [];

  @Input()
  get data(): TreeNode[] {
    return this._data;
  }

  set data(value: TreeNode[]) {
    this._data = value.map((item) => structuredClone(item));
  }

  @Input() cols: TreeColumnDefinition[] = [];
  @Input() frozenCols: TreeColumnDefinition[] = [];
  @Input() globalCategories: Map<number, string> = new Map();
  @Input() categoriesByColumn: { [key: string]: Map<number, string> } = {};
  @Input() isGlobalGradient = true;
  @Input() hideZeroValues = false;
  @Input() isCellClickable = false;

  @Output() cellClicked = new EventEmitter<FilterValue>();
  @Output() rowClicked = new EventEmitter<T>();
  @Output() cellClickedSendTreeNode = new EventEmitter<TreeNodeClick>();

  getGradientClass(value: number, property: string): string {
    if (this.isGlobalGradient) {
      return this.globalCategories.get(value) || '';
    }

    return this.categoriesByColumn[property]?.get(value) || '';
  }

  onCellClick(rowData: T, field: string, rowNode?: TreeTableNode<T>): void {
    const filterValue: FilterValue = {
      label: rowData.field,
      value: field,
    };

    this.cellClicked.emit(filterValue);
    this.rowClicked.emit(rowData);

    if (rowNode) {
      this.cellClickedSendTreeNode.emit({ rowNode, field });
    }
  }

  getRowClasses(rowNode: TreeTableNode<T>): Record<string, boolean> {
    return {
      'parent-row': this.hasChildren(rowNode),
      'terminal-row': !this.hasChildren(rowNode),
    };
  }

  getCellClasses(
    col: TreeColumnDefinition,
    rowNode: TreeTableNode<T>,
  ): Record<string, boolean> {
    return {
      'parent-cell': this.hasChildren(rowNode),
      underlined: !!col.hasNavigationEnabled,
      'first-cell': rowNode.parent === null,
    };
  }

  public isBoolean(input: unknown): input is boolean {
    return typeof input === 'boolean';
  }

  private hasChildren(rowNode: TreeTableNode<T>): boolean {
    return !!rowNode.node?.children && rowNode.node.children.length > 0;
  }
}
