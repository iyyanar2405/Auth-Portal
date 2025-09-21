import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import {
  TriStateCheckboxChangeEvent,
  TriStateCheckboxModule,
} from 'primeng/tristatecheckbox';
import { map, Observable, take, tap } from 'rxjs';

import { FilteringConfig, ListboxItem } from '../../../../models';

@Component({
  selector: 'shared-checkbox-filter',
  imports: [
    CommonModule,
    ListboxModule,
    FormsModule,
    CheckboxModule,
    TranslocoDirective,
    TriStateCheckboxModule,
  ],
  templateUrl: './checkbox-filter.component.html',
  styleUrl: './checkbox-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxFilterComponent implements OnInit {
  @Input() options: ListboxItem<string>[] = [];
  @Input() optionLabel = 'label';
  @Input() filterFlag = false;
  @Input() multiple = true;
  @Input() maxHeight = 220;
  @Input() width = 208;
  @Input() filter: any;
  @Input() field = '';
  @Input() filteringConfig$!: Observable<FilteringConfig>;

  selectedItems: ListboxItem<string>[] = [];
  selectAll: boolean | null = null;

  ngOnInit(): void {
    this.initializeSelectedItems();
  }

  public onChangeSelectAll(event: TriStateCheckboxChangeEvent): void {
    this.filter(event.value ? this.options : []);

    if (event.value) {
      this.selectedItems = [...this.options];
    } else {
      this.selectedItems = [];
      this.selectAll = null;
    }
  }

  public onChangeOption(event: ListboxChangeEvent): void {
    this.filter(event.value);

    if (event.value?.length === this.options.length) {
      this.selectAll = true;
    } else if (
      event.value?.length &&
      event.value.length < this.options.length
    ) {
      this.selectAll = false;
    } else {
      this.selectAll = null;
    }
  }

  private initializeSelectedItems(): void {
    this.filteringConfig$
      .pipe(
        take(1),
        map((config) => config[this.field]?.value || []),
        tap((filters) => {
          this.selectedItems = filters.map((f) => ({
            label: f.label,
            value: f.value,
          }));

          if (this.selectedItems.length === this.options.length) {
            this.selectAll = true;
          } else if (this.selectedItems.length === 0) {
            this.selectAll = null;
          } else {
            this.selectAll = false;
          }
        }),
      )
      .subscribe();
  }
}
