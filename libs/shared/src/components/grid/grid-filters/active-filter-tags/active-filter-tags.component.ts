import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  ActiveFilterTag,
  CellType,
  ColumnDefinition,
  Filter,
  FilteringConfig,
  FilterToRemove,
  FilterTypeModel,
} from '../../../../models';
import { ActiveFilterTagComponent } from './active-filter-tag/active-filter-tag.component';

enum FilterPreferenceAction {
  Save = 'save',
  Delete = 'delete',
}

@Component({
  selector: 'shared-active-filter-tags',
  imports: [CommonModule, ActiveFilterTagComponent, TranslocoDirective],
  templateUrl: './active-filter-tags.component.html',
  styleUrl: './active-filter-tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveFilterTagsComponent {
  private _filteringConfig!: FilteringConfig;
  private _savedFilters: FilterTypeModel | undefined;

  @Output() saveFilter = new EventEmitter<ActiveFilterTag>();
  @Output() deleteSavedFilter = new EventEmitter<ActiveFilterTag>();
  @Output() removeFilter = new EventEmitter<FilterToRemove>();
  @Input() columns!: ColumnDefinition[];
  @Input() shouldPersist!: boolean;

  @Input() set savedFilters(value: FilterTypeModel | undefined) {
    this._savedFilters = value;

    this.updatesAfterFilteringConfigChanges();
  }

  get savedFilters(): FilterTypeModel | undefined {
    return this._savedFilters;
  }

  @Input() set filteringConfig(value: FilteringConfig) {
    this._filteringConfig = value;
    this.updatesAfterFilteringConfigChanges();
  }

  get filteringConfig(): FilteringConfig {
    return this._filteringConfig;
  }

  public FilterPreferenceAction = FilterPreferenceAction;

  public activeFilters: WritableSignal<ActiveFilterTag[]> = signal([]);

  public onRemoveFilter(filter: ActiveFilterTag): void {
    if (this.isDateFilter(filter.field)) {
      filter.values!.forEach((value) => {
        this.removeFilter.emit({
          fieldName: filter.field,
          filterValue: value,
        });
      });
    } else {
      this.removeFilter.emit({
        fieldName: filter.field,
        filterValue: filter.value!,
      });
    }
  }

  public handleFilterPreferenceAction(
    filter: ActiveFilterTag,
    action: FilterPreferenceAction,
  ): void {
    const emitEvent =
      action === FilterPreferenceAction.Save
        ? this.saveFilter
        : this.deleteSavedFilter;

    if (this.isDateFilter(filter.field)) {
      filter.values!.forEach((value) => {
        emitEvent.emit({
          field: filter.field,
          displayName: filter.displayName,
          label: filter.label,
          value,
          isSaved: filter.isSaved,
        });
      });
    } else {
      emitEvent.emit(filter);
    }
  }

  private updatesAfterFilteringConfigChanges(): void {
    this.activeFilters.set(
      this.mapFiltersToActiveFilterTag(this._filteringConfig),
    );
  }

  private mapFiltersToActiveFilterTag(
    filtersObj: FilteringConfig,
  ): ActiveFilterTag[] {
    return Object.entries(filtersObj).reduce(
      (result, [field, filters]) => {
        let activeFilterTag: ActiveFilterTag[];

        if (this.isDateFilter(field)) {
          activeFilterTag = this.getActiveFilterDateTag(field, filters);
        } else {
          activeFilterTag = this.getActiveFilterTagOthers(field, filters);
        }

        return result.concat(activeFilterTag);
      },

      [] as ActiveFilterTag[],
    );
  }

  private getActiveFilterDateTag(
    field: string,
    filters: Filter,
  ): ActiveFilterTag[] {
    return filters.value.length > 0
      ? [
          {
            field,
            displayName: this.getFilterNameByField(field),
            label: filters.value?.map((item) => item.label).join(' - '),
            values: filters.value.map((item) => item.value),
            isSaved: this.isFilterSaved(field, {
              label: filters.value[0].label,
              value: filters.value[0].value,
            }),
          },
        ]
      : [];
  }

  private getActiveFilterTagOthers(
    field: string,
    filters: Filter,
  ): ActiveFilterTag[] {
    return (
      filters.value?.map((f) => ({
        ...f,
        displayName: this.getFilterNameByField(field),
        field,
        isSaved: this.isFilterSaved(field, f),
      })) || []
    );
  }

  private getFilterNameByField(key: string): string {
    return this.columns.find((c) => c.field === key)?.displayName || key;
  }

  private isDateFilter(field: string): boolean {
    return (
      this.columns.find((c) => c.field === field)?.cellType === CellType.Date
    );
  }

  private isFilterSaved(
    key: string,
    value: { label: string; value: string },
  ): boolean {
    if (!this.savedFilters || !this.savedFilters[key]) {
      return false;
    }

    const savedFilter = this.savedFilters[key];

    return Array.isArray(savedFilter)
      ? this.isValueInSavedFilterArray(savedFilter, value)
      : this.isValueInSavedFilter(savedFilter, value);
  }

  private isValueInSavedFilterArray(
    savedFilterArray: any[],
    value: { label: string; value: string },
  ): boolean {
    return savedFilterArray.some((item) =>
      Array.isArray(item.value)
        ? this.isValueInNestedArray(item.value, value)
        : this.isValueEqual(item.value, value.value),
    );
  }

  private isValueInSavedFilter(
    savedFilter: any,
    value: { label: string; value: string },
  ): boolean {
    return this.isValueEqual(savedFilter.value, value.value);
  }

  private isValueInNestedArray(
    nestedArray: any[],
    value: { label: string; value: string },
  ): boolean {
    return nestedArray.some((filter) =>
      this.isValueEqual(filter.value, value.value),
    );
  }

  private isValueEqual(filterValue: string, targetValue: string): boolean {
    return filterValue === targetValue;
  }
}
