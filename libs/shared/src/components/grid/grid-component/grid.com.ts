import { OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
  input, // Import input signal
  output, // Import output signal
  signal, // Import signal
  effect, // Import effect
  computed, // Import computed
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { FilterMetadata, SortEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
// For dynamic progressbar demo
import { ToastModule } from 'primeng/toast';
import {
  TriStateCheckboxChangeEvent,
  TriStateCheckboxModule,
} from 'primeng/tristatecheckbox';
import { Observable, take, tap } from 'rxjs';

import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_FILTERS_MAP,
  DEFAULT_GRID_CONFIG_SIZES,
  TooltipThemes,
} from '../../../constants';
import {
  DebounceClickDirective,
  TippyTooltipDirective,
} from '../../../directives';
import { compareFilterEquality, createGridConfig } from '../../../helpers';
import {
  ActiveFilterTag,
  CellType,
  ColumnDefinition,
  ColumnType,
  FilteringConfig,
  FilterMode,
  FilterToRemove,
  FilterTypeModel,
  GridConfig,
  GridEventAction,
  GridFileActionEvent,
  GridLazyLoadEvent,
  GridRowAction,
  GridSizeConfig,
  PreferenceDataModel,
} from '../../../models';
import { CustomDatePipe } from '../../../pipes/custom-date.pipe';
import { EmptyGridComponent } from '../empty-grid';
import {
  ActionComponent,
  EventActionComponent,
  StatusComponent,
  TagComponent,
  TextWithIconComponent,
} from '../grid-cell-renderers';
import { GridColumnsComponent } from '../grid-columns';
import {
  ActiveFilterTagsComponent,
  CheckboxFilterComponent,
  DateFilterComponent,
  InputFilterComponent,
} from '../grid-filters';

@Component({
  selector: 'shared-grid',
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    TableModule,
    MultiSelectModule,
    TagModule,
    SliderModule,
    ProgressBarModule,
    ToastModule,
    ButtonModule,
    CheckboxModule,
    TriStateCheckboxModule,
    TranslocoDirective,
    TagComponent,
    TippyTooltipDirective,
    CheckboxFilterComponent,
    InputFilterComponent,
    DateFilterComponent,
    OverlayPanelModule,
    OverlayModule,
    GridColumnsComponent,
    ActiveFilterTagsComponent,
    PaginatorModule,
    StatusComponent,
    AsyncPipe,
    RouterModule,
    ActionComponent,
    EventActionComponent,
    TextWithIconComponent,
    DebounceClickDirective,
    EmptyGridComponent,
    CustomDatePipe,
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, AfterViewInit {
  private _dataInternal = signal<any[]>([]); // Renamed to avoid clash with input
  private defaultRowsPerPage = 10;

  private actualRows = this.defaultRowsPerPage;
  private _preferenceDataInternal = signal<PreferenceDataModel>(undefined as any); // Renamed to avoid clash with input

  private isSorted: boolean | null = null;
  private currentSortField = '';

  private actualFilters: FilterTypeModel = {};

  preferenceToSave: Partial<PreferenceDataModel> = {};

  ColumnType = ColumnType;
  CellType = CellType;
  TooltipTheme = TooltipThemes;

  visibleCols!: any[];
  userSortedCols!: any[];
  selectAll: boolean | null = null;
  showSelectedCount = false;
  localDisplayExportButton = true;
  localDisplayColsReorderButton = true;
  displaySaveFilterButton = false;

  gridSizeConfig!: GridSizeConfig;

  colsNo!: string;

  isColsOverlayOpen = false;

  showDefaultColumnsButton = false;

  @ViewChild('dt') dataTable!: Table;
  @ContentChild('buttonsCustomTemplate')
  buttonsCustomTemplate!: TemplateRef<any>;
  @ContentChild('tdCustomTemplate') tdCustomTemplate!: TemplateRef<any>;

  columns = input.required<ColumnDefinition[]>();

  data = input<any[]>([]); // Renamed the input to 'data' and made it a signal
  // No getter/setter needed for 'data' input directly. Logic handled in effect.

  preferenceData = input.required<PreferenceDataModel>();
  // No getter/setter needed for 'preferenceData' input directly. Logic handled in effect.


  totalRecords = input.required<number>();
  dateFormat = input(DEFAULT_DATE_FORMAT);
  dataKey = input('id');
  filterOptions = input<any>(undefined as any);
  filterDelay = input(0);
  displayClearButton = input(false);
  displayExportButton = input(true);
  displayColsReorderButton = input(false);
  displayFilterSummary = input(true);
  loading = input(false);
  paginator = input(true);
  rowHover = input(false);
  rows = input(this.defaultRowsPerPage);
  rowSize = input('');
  tooltipMarginTopSize = input(-1.2);
  rowsPerPageOptions = input([10, 20, 30]);
  scrollable = input(true);
  selectable = input(false);
  selectableSticky = input(true);
  showCurrentPageReport = input(true);
  sortable = input(false);
  sortMode = input<'single' | 'multiple'>('single');
  filteringConfig$ = input.required<Observable<FilteringConfig>>();
  tagStatesMap = input.required<Record<string, string>>();
  statusStatesMap = input.required<Record<string, string>>();
  route = input.required<string>();
  queryParamProperty = input.required<string>();
  childIdentifier = input.required<string>();
  selectedCount = input(0);
  shouldPersist = input(true);
  enableFileDownloadWithRowData = input(false);
  isDocumentsGrid = input(false);
  hasActiveFilters = input.required<boolean>();

  gridConfigChangedEvent = output<GridConfig>();
  removeFilter = output<{ fieldName: string; filterValue: string; }>();
  exportExcel = output<void>();
  triggerFileAction = output<{ event: GridFileActionEvent; fileName: string; documentId: number; rowData?: any; }>();
  triggerEventAction = output<{ event: GridEventAction; }>();
  triggerRedirectAction = output<{ rowData: GridRowAction; }>();
  savePreference = output<Partial<PreferenceDataModel>>();
  selectionChange = output<number>();
  selectionChangeData = output<any>();
  addDocuments = output<void>();


  // Computed properties derived from signals
  isPaginationVisible = computed(() => this.paginator() && this.totalRecords() > this.defaultRowsPerPage);
  isPaginationPartiallyVisible = computed(() => this.rows() >= this.totalRecords());
  isGridEmpty = computed(() => this.totalRecords() === 0);


  constructor() {
    effect(() => {
      const incomingData = this.data();
      if (this.selectable()) {
        this.selectAll = null;
        this.onClearSelection(incomingData);
      } else {
        this._dataInternal.set(this.setIsSelected(incomingData));
      }
    });

    effect(() => {
      const incomingPreferenceData = this.preferenceData();
      this._preferenceDataInternal.set(incomingPreferenceData);
      this.preferenceToSave = structuredClone(incomingPreferenceData);
    });
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const window = event.target as Window;
    this.resizeTableCell(window.innerWidth);
  }

  ngOnInit(): void {
    this.resizeTableCell(window.innerWidth);
    this.userSortedCols = structuredClone(this.columns()); // Access signal value
    this.colsNo = String(this.columns().length); // Access signal value
    this.refreshVisibleColumns();
  }

  ngAfterViewInit(): void {
    this.applyNavigationOrPreferenceFilters();
  }

  onChangeRows(nOfRows: number, skipFilter?: boolean): void {
    if (nOfRows === this.actualRows) {
      return;
    }

    this.dataTable._rows = nOfRows;
    // ... rest of the method
  }

  // The rest of the methods remain largely the same, but will need to access inputs as signals (e.g., this.paginator() )

  // Helper method for data processing
  private setIsSelected(data: any[]): any[] {
    // Original logic from your component
    if (!data) return [];
    return data.map((item) => ({ ...item, isSelected: false }));
  }

  private onClearSelection(data: any[] | undefined): void {
    if (data) {
      this._dataInternal.set(this.setIsSelected(data));
      this.showSelectedCount = false;
      this.selectionChange.emit(0);
      this.selectionChangeData.emit([]);
    }
  }


  // The rest of the methods from the original component
  onLazyLoadChanged(event: GridLazyLoadEvent): void {
    const paginationEnabled = this.paginator(); // Access signal value
    const gridConfig = createGridConfig({ ...event, paginationEnabled });
    this.gridConfigChangedEvent.emit(gridConfig);
    this.actualFilters = event.filters as FilterTypeModel;
    this.actualRows = event.rows as number;
    this.initializePreferencesFiltersIfEmpty();
    this.updateDisplaySaveBtnVisibility();
  }

  onSaveFiltersClick(): void {
    this.userSortedCols.forEach((column: ColumnDefinition) => {
      const columnField = column.field;
      if (!this.actualFilters[columnField]) {
        if (DEFAULT_FILTERS_MAP[column.type]) {
          this.actualFilters[columnField] = [
            {
              ...DEFAULT_FILTERS_MAP[column.type],
            },
          ];
        }
      }
    });
    this.preferenceToSave.filters = this.actualFilters;
    this.emitUpdatedPreferences();
    this._preferenceDataInternal.set(this.preferenceToSave as PreferenceDataModel); // Update internal signal
    this.updateDisplaySaveBtnVisibility();
  }

  onSaveIndividualFilter(activeFilter: ActiveFilterTag): void {
    const matchingActualValues = this.getMatchingValuesFromActualFilters(activeFilter);
    const nonNullPreferenceValues = this.getNonNullValuesFromPreferences(activeFilter);
    const mergedValues = this.mergeAndDeduplicateValues(
      nonNullPreferenceValues,
      matchingActualValues,
    );
    const updatedFilter = this.createUpdatedFilter(activeFilter, mergedValues);
    this.updatePreferences(activeFilter, updatedFilter);
    this.emitUpdatedPreferences();
    this.updateDisplaySaveBtnVisibility();
  }

  onDeleteIndividualFilter(activeFilter: ActiveFilterTag): void {
    const column = this.getColumnDefinition(activeFilter.field);
    const updatedFilters = this.getUpdatedFiltersAfterDeletion(activeFilter);
    this.updatePreferencesAfterDeletion(activeFilter, updatedFilters, column);
    this.emitUpdatedPreferences();
    this.updateDisplaySaveBtnVisibility();
  }

  onGridColumnsApplyClicked(event: ColumnDefinition[]): void {
    this.userSortedCols = event;
    this.refreshVisibleColumns();
    this.removeFilterSortDisabledCols(this.userSortedCols);
    this.showDefaultColumnsButton = true;
    this.saveColumnsPreference(this.userSortedCols);
  }

  onGridColumnDefaultClicked(): void {
    this.userSortedCols = structuredClone(this.columns()); // Access signal value
    this.refreshVisibleColumns();
    this.showDefaultColumnsButton = false;
    this.saveColumnsPreference([]);
  }

  getMatchMode(field: string): string {
    return field.toLocaleLowerCase().includes('start') ? FilterMode.DateAfter : FilterMode.DateBefore;
  }

  onRemoveFilterTags(filterToRemove: FilterToRemove): void {
    if (this.dataTable.filters && this.dataTable.filters[filterToRemove.fieldName]) {
      const columnFilter = this.dataTable.filters[filterToRemove.fieldName] as FilterMetadata[];
      if (Array.isArray(columnFilter) && columnFilter[0] && Array.isArray(columnFilter[0].value)) {
        columnFilter[0].value = columnFilter[0].value.filter((val: any) => val.value !== filterToRemove.filterValue);
      }
    }
    this.dataTable._filter();
    this.updateDisplaySaveBtnVisibility();
  }

  onSelectPaginationRows(): void {
    this.savePreference.emit({ rowsPerPage: this.rows() }); // Access signal value
  }

  applyFilters(filters: FilterTypeModel): void {
    this.dataTable.filters = { ...this.dataTable.filters, ...filters };
  }

  applyPreferences(): void {
    const preferenceData = this._preferenceDataInternal(); // Access internal signal
    if (preferenceData) {
      if (preferenceData.filters) {
        this.applyFilters(preferenceData.filters);
        this.dataTable._filter();
      }
      if (preferenceData.rowsPerPage) {
        this.onChangeRows(preferenceData.rowsPerPage, true);
      }
      if (preferenceData.columns) {
        this.applyColumns(
          preferenceData.columns,
          preferenceData.showDefaultColumnsButton,
        );
      }
    }
  }

  clearFilters(): void {
    this.resetDataTableFilters();
    this.dataTable._filter();
    this.onSaveFiltersClick();
  }

  customSort(event: SortEvent): void {
    const isMultiSort = !!event.multiSortMeta;
    const fieldToSort = isMultiSort ? event.multiSortMeta![0].field : event.field;
    if (!fieldToSort) {
      this.currentSortField = '';
      this.isSorted = null;
      return;
    }
    const currentSortOrder = isMultiSort
      ? event.multiSortMeta![0].order
      : event.order;

    if (this.currentSortField === fieldToSort) {
      if (currentSortOrder === 1) {
        this.isSorted = true;
      } else if (currentSortOrder === -1) {
        this.isSorted = false;
      } else if (this.isSorted === false) {
        this.isSorted = null;
        this.dataTable.reset();
      }
    } else {
      this.currentSortField = fieldToSort;
      this.isSorted = true;
    }
    if (this.isSorted === null) {
      this.dataTable.reset();
    } else {
      this.dataTable.sort(event);
    }
    this.savePreference.emit({
      sortField: this.currentSortField,
      sortOrder: this.isSorted === true ? 1 : this.isSorted === false ? -1 : 0,
    });
  }

  onSelectRow(rowData: any): void {
    rowData.isSelected = !rowData.isSelected;
    this.showSelectedCount = this.getSelectedDataCount(this._dataInternal()) > 0; // Access internal signal
    this.selectAll = this.getSelectAllStatus();
    this.selectionChange.emit(this.getSelectedDataCount(this._dataInternal())); // Access internal signal
    this.selectionChangeData.emit(this.getSelectedData(this._dataInternal())); // Access internal signal
  }

  onChangeSelectAll(event: TriStateCheckboxChangeEvent): void {
    if (this.selectAll === false) {
      this._dataInternal.set(this.setIsSelected(this._dataInternal())); // Access and update internal signal
    } else {
      this._dataInternal.set(
        this._dataInternal().map((item) => ({ ...item, isSelected: event.value === true })), // Access and update internal signal
      );
    }
    this.showSelectedCount = this.getSelectedDataCount(this._dataInternal()) > 0; // Access internal signal
    this.selectionChange.emit(this.getSelectedDataCount(this._dataInternal())); // Access internal signal
    this.selectionChangeData.emit(this.getSelectedData(this._dataInternal())); // Access internal signal
  }

  onAddDocuments(): void {
    this.addDocuments.emit();
  }

  private initializePreferencesFiltersIfEmpty(): void {
    if (Object.keys(this.preferenceToSave?.filters ?? {}).length === 0) {
      this.preferenceToSave.filters = this.actualFilters;
    }
  }

  private applyNavigationOrPreferenceFilters(): void {
    if (!this.filteringConfig$()) { // Access signal value
      this.applyPreferences();
      return;
    }
    this.filteringConfig$()
      .pipe(
        tap((filters) => {
          if (Object.keys(filters).length) {
            const finalFilters = structuredClone(this.actualFilters);
            Object.keys(filters).forEach((filterKey) => {
              finalFilters[filterKey] = [filters[filterKey]];
            });
            this.applyFilters(structuredClone(finalFilters));
            this.dataTable._filter();
          } else {
            this.applyPreferences();
          }
        }),
        take(1),
      )
      .subscribe();
  }

  private resetDataTableFilters(): void {
    const filters = (this.dataTable as any)?.filters;
    if (!filters) return;
    Object.entries(filters).forEach(([key, filter]: [string, any]) => {
      filters[key] = Array.isArray(filter) && filter[0]?.value !== undefined ? [{ ...filter[0], value: [] }] : { ...filter, value: [] };
    });
  }

  private updateDisplaySaveBtnVisibility(): void {
    this.displaySaveFilterButton = this.shouldPersist() && !compareFilterEquality(this.actualFilters, this.preferenceToSave.filters); // Access signal value
  }

  private getSelectAllStatus() {
    const selectedCount = this.getSelectedDataCount(this._dataInternal()); // Access internal signal
    const rowCount = this.getSelectedRowCount(this._dataInternal()); // Access internal signal
    if (selectedCount === 0) {
      return null;
    }
    return selectedCount === rowCount;
  }

  private getSelectedRowCount(data: any[]): number {
    return (data || []).reduce((acc, row: any) => {
      if (Array.isArray(row.children) && row.children.length) {
        return acc + 1 + row.children.length;
      }
      return acc + 1;
    }, 0);
  }

  private getSelectedDataCount(data: any[]): number {
    return (data || []).reduce((acc, row: any) => {
      if (row.children && Array.isArray(row.children)) {
        return (
          acc +
          (row.isSelected ? 1 : 0) +
          row.children.filter((child: any) => child.isSelected).length
        );
      }
      return acc + (row.isSelected ? 1 : 0);
    }, 0);
  }

  private getSelectedData(data: any[]): any[] {
    const selectedData: any[] = [];
    (data || []).forEach((row: any) => {
      if (row.isSelected) {
        selectedData.push(row);
      }
      if (row.children && Array.isArray(row.children)) {
        row.children.forEach((child: any) => {
          if (child.isSelected) {
            selectedData.push(child);
          }
        });
      }
    });
    return selectedData;
  }

  private getMatchingValuesFromActualFilters(activeFilter: ActiveFilterTag): any[] {
    const actualFilter = this.actualFilters[activeFilter.field];
    if (Array.isArray(actualFilter) && actualFilter[0] && Array.isArray(actualFilter[0].value)) {
      return actualFilter[0].value.filter((filterItem: any) =>
        this.compareFilterItems(filterItem, activeFilter),
      );
    }
    return [];
  }

  private getNonNullValuesFromPreferences(activeFilter: ActiveFilterTag): any[] {
    const preferenceFilter = this.preferenceToSave.filters?.[activeFilter.field];
    if (Array.isArray(preferenceFilter) && preferenceFilter[0] && Array.isArray(preferenceFilter[0].value)) {
      return preferenceFilter[0].value.filter((val: any) => val !== null);
    }
    return [];
  }

  private mergeAndDeduplicateValues(
    preferenceValues: any[],
    actualValues: any[],
  ): any[] {
    const merged = [...preferenceValues, ...actualValues];
    const uniqueValues = new Map();
    merged.forEach((item) => {
      uniqueValues.set(item.value, item);
    });
    return Array.from(uniqueValues.values());
  }

  private createUpdatedFilter(activeFilter: ActiveFilterTag, mergedValues: any[]): FilterMetadata[] {
    return [
      {
        matchMode: FilterMode.In,
        operator: 'and',
        value: mergedValues,
      },
    ];
  }

  private updatePreferences(activeFilter: ActiveFilterTag, updatedFilter: FilterMetadata[]): void {
    this.preferenceToSave.filters = {
      ...this.preferenceToSave.filters,
      [activeFilter.field]: updatedFilter,
    };
  }

  private emitUpdatedPreferences(): void {
    this.savePreference.emit(this.preferenceToSave);
  }

  private compareFilterItems(filterItem: any, activeFilter: ActiveFilterTag): boolean {
    return filterItem.value === activeFilter.value;
  }

  private removeFilterSortDisabledCols(columns: ColumnDefinition[]): void {
    const updatedFilters: FilterTypeModel = {};
    const updatedSortMeta: SortEvent['multiSortMeta'] = [];

    const currentFilters = this.actualFilters;
    if (currentFilters) {
      Object.keys(currentFilters).forEach((key) => {
        const column = columns.find((col) => col.field === key);
        if (column && !column.disabled) {
          updatedFilters[key] = currentFilters[key];
        }
      });
      this.actualFilters = updatedFilters;
    }

    if (this.dataTable._multiSortMeta) {
      this.dataTable._multiSortMeta.forEach((meta) => {
        const column = columns.find((col) => col.field === meta.field);
        if (column && !column.disabled) {
          updatedSortMeta.push(meta);
        }
      });
      this.dataTable._multiSortMeta = updatedSortMeta;
    }

    if (this.dataTable._sortOrder && this.currentSortField) {
      const column = columns.find((col) => col.field === this.currentSortField);
      if (column && column.disabled) {
        this.dataTable._sortOrder = {};
        this.isSorted = null;
        this.currentSortField = '';
      }
    }
  }

  private getColumnDefinition(key: string): ColumnDefinition {
    return this.userSortedCols.find((col) => col.field === key) as ColumnDefinition;
  }

  private getUpdatedFiltersAfterDeletion(activeFilter: ActiveFilterTag): any[] {
    const preferenceFilters = this.preferenceToSave.filters?.[activeFilter.field];
    if (Array.isArray(preferenceFilters)) {
      return preferenceFilters
        .map((filter) => ({
          ...filter,
          value: filter.value.filter(
            (filterItem: any) => filterItem.value !== activeFilter.value,
          ),
        }))
        .filter((filter) => filter.value.length > 0);
    }
    return [];
  }

  private updatePreferencesAfterDeletion(
    activeFilter: ActiveFilterTag,
    updatedFilters: any[],
    column: ColumnDefinition,
  ): void {
    this.preferenceToSave.filters = {
      ...this.preferenceToSave.filters,
      [activeFilter.field]: updatedFilters.length > 0 ? updatedFilters : [DEFAULT_FILTERS_MAP[column.type]],
    };
    this.emitUpdatedPreferences();
    this.updateDisplaySaveBtnVisibility();
  }

  private applyColumns(
    columns: any[],
    showDefaultColumnsButton: boolean,
  ): void {
    if (!columns || columns.length === 0) {
      this.refreshVisibleColumns();
      return;
    }
    this.userSortedCols = columns;
    this.showDefaultColumnsButton = showDefaultColumnsButton;
    this.refreshVisibleColumns();
  }

  private resizeTableCell(width: number): void {
    const config = DEFAULT_GRID_CONFIG_SIZES.find(
      (cfg) => width > cfg.minWidth,
    );
    if (config) {
      this.gridSizeConfig = { ...config };
    }
  }

  private refreshVisibleColumns(): void {
    this.visibleCols = this.userSortedCols.filter(
      (column: ColumnDefinition) => !column.hidden,
    );
  }

  private saveColumnsPreference(preferenceToSave: ColumnDefinition[]): void {
    this.preferenceToSave.columns = preferenceToSave;
    this.preferenceToSave.showDefaultColumnsButton =
      this.showDefaultColumnsButton;
    this.emitUpdatedPreferences();
  }

  private updateButtonsVisibilityBasedOnSelection(): void {
    if (this.selectAll === null) {
      this.localDisplayExportButton = true;
    }
  }
}