import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {
  TriStateCheckboxChangeEvent,
  TriStateCheckboxModule,
} from 'primeng/tristatecheckbox';

import { ColumnDefinition } from '../../../models';

@Component({
  selector: 'shared-grid-columns',
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    DragDropModule,
    FormsModule,
    TranslocoDirective,
    TriStateCheckboxModule,
  ],
  templateUrl: './grid-columns.component.html',
  styleUrl: './grid-columns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridColumnsComponent {
  private _columns!: ColumnDefinition[];

  @Input()
  showDefaultButton!: boolean;

  @Input() set columns(value: ColumnDefinition[]) {
    this._columns = value;
    this.setSelectedColumns();
  }

  get columns(): ColumnDefinition[] {
    return this._columns;
  }

  @Output() applied = new EventEmitter<ColumnDefinition[]>();
  @Output() defaulted = new EventEmitter<void>();

  selectedColumns: string[] = [];
  selectAll: boolean | null = null;
  dropListDisabled = false;
  showApplyButton = false;

  setSelectedColumns(): void {
    this.selectedColumns = this.columns
      .filter((column: ColumnDefinition) => !column.hidden)
      .map((column: ColumnDefinition) => column.field);

    this.updateSelectAllCheckbox();
  }

  onApplyClick(): void {
    this.columns.forEach((column: ColumnDefinition, index: number) => {
      this.columns[index].hidden = !this.selectedColumns.includes(column.field);
    });
    this.showApplyButton = false;
    this.showDefaultButton = true;
    this.applied.emit(this.columns);
  }

  onDefaultClick(): void {
    this.defaulted.emit();
  }

  columnsChanged(): void {
    this.updateSelectAllCheckbox();
    this.showApplyButton = true;
    this.showDefaultButton = false;
  }

  onChangeSelectAll(event: TriStateCheckboxChangeEvent): void {
    if (event.value) {
      this.selectedColumns = this.columns.map(
        (column: ColumnDefinition) => column.field,
      );
    } else {
      this.selectedColumns = this.columns
        .filter((column: ColumnDefinition) => column.fixed)
        .map((column: ColumnDefinition) => column.field);
      this.selectAll = null;
    }
    this.showApplyButton = true;
    this.showDefaultButton = false;
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (this.columns[event.currentIndex].fixed) {
      this.dropListDisabled = true;
      this.dropListDisabled = false;

      return;
    }

    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.showApplyButton = true;
    this.showDefaultButton = false;
  }

  private updateSelectAllCheckbox(): void {
    if (this.selectedColumns.length === this.columns.length) {
      this.selectAll = true;
    } else if (this.selectedColumns.length === 0) {
      this.selectAll = null;
    } else {
      this.selectAll = false;
    }
  }
}
