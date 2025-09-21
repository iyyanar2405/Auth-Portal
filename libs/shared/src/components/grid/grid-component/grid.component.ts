import { OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
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
  private _data: any[] = [];
  private defaultRowsPerPage = 10;

  private actualRows = this.defaultRowsPerPage;
  private _preferenceData!: PreferenceDataModel;

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

  @Input() columns!: ColumnDefinition[];

  @Input() set data(data: any) {
    if (this.selectable) {
      this.selectAll = null;
      this.onClearSelection(data);
    } else {
      this._data = this.setIsSelected(data);
    }
  }

  get data() {
    return this._data;
  }

  @Input() set preferenceData(preferenceData: PreferenceDataModel) {
    this._preferenceData = preferenceData;
    this.preferenceToSave = structuredClone(preferenceData);
  }

  get preferenceData(): PreferenceDataModel {
    return this._preferenceData;
  }

  @Input() totalRecords!: number;
  @Input() dateFormat = DEFAULT_DATE_FORMAT;
  @Input() dataKey = 'id';
  @Input() filterOptions!: any;
  @Input() filterDelay = 0;
  @Input() displayClearButton = false;
  @Input() displayExportButton = true;
  @Input() displayColsReorderButton = false;
  @Input() displayFilterSummary = true;
  @Input() loading = false;
  @Input() paginator = true;
  @Input() rowHover = false;
  @Input() rows = this.defaultRowsPerPage;
  @Input() rowSize = '';
  @Input() tooltipMarginTopSize = -1.2;
  @Input() rowsPerPageOptions = [10, 20, 30];
  @Input() scrollable = true;
  @Input() selectable = false;
  @Input() selectableSticky = true;
  @Input() showCurrentPageReport = true;
  @Input() sortable = false;
  @Input() sortMode: 'single' | 'multiple' = 'single';
  @Input() filteringConfig$!: Observable<FilteringConfig>;
  @Input() tagStatesMap!: Record<string, string>;
  @Input() statusStatesMap!: Record<string, string>;
  @Input() route!: string;
  @Input() queryParamProperty!: string;
  @Input() childIdentifier!: string;
  @Input() selectedCount = 0;
  @Input() shouldPersist = true;
  @Input() enableFileDownloadWithRowData = false;
  @Input() isDocumentsGrid = false;
  @Input({ required: true }) hasActiveFilters = false;

  @Output() gridConfigChangedEvent = new EventEmitter<GridConfig>();
  @Output() removeFilter = new EventEmitter<{
    fieldName: string;
    filterValue: string;
  }>();
  @Output() exportExcel = new EventEmitter<void>();
  @Output() triggerFileAction = new EventEmitter<{
    event: GridFileActionEvent;
    fileName: string;
    documentId: number;
    rowData?: any;
  }>();
  @Output() triggerEventAction = new EventEmitter<{
    event: GridEventAction;
  }>();
  @Output() triggerRedirectAction = new EventEmitter<{
    rowData: GridRowAction;
  }>();
  @Output() savePreference = new EventEmitter<Partial<PreferenceDataModel>>();
  @Output() selectionChange = new EventEmitter<number>();
  @Output() selectionChangeData = new EventEmitter<any>();
  @Output() addDocuments = new EventEmitter<void>();

  get isPaginationVisible(): boolean {
    return this.paginator && this.totalRecords > this.defaultRowsPerPage;
  }

  get isPaginationPartiallyVisible(): boolean {
    return this.rows >= this.totalRecords;
  }

  get isGridEmpty(): boolean {
    return this.totalRecords === 0;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const window = event.target as Window;
    this.resizeTableCell(window.innerWidth);
  }

  ngOnInit(): void {
    this.resizeTableCell(window.innerWidth);
    this.userSortedCols = structuredClone(this.columns);
    this.colsNo = String(this.columns.length);
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

    if (!skipFilter) {
      this.dataTable._filter();
    }
  }

  onSelectPaginationRows(): void {
    this.preferenceToSave.rowsPerPage = this.actualRows;
    this.emitUpdatedPreferences();
  }

  clearFilters(): void {
    this.resetDataTableFilters();
    this.dataTable._filter();

    this.onSaveFiltersClick();
  }

  onLazyLoadChanged(event: TableLazyLoadEvent): void {
    this.onClearSelection();

    const ev: GridLazyLoadEvent = {
      ...event,
      paginationEnabled: this.paginator,
    };
    const gridConfig = createGridConfig(ev);
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
    this.preferenceData = this.preferenceToSave as PreferenceDataModel;

    this.updateDisplaySaveBtnVisibility();
  }

  onSaveIndividualFilter(activeFilter: ActiveFilterTag): void {
    const matchingActualValues =
      this.getMatchingValuesFromActualFilters(activeFilter);
    const nonNullPreferenceValues =
      this.getNonNullValuesFromPreferences(activeFilter);

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
    this.userSortedCols = structuredClone(this.columns);
    this.refreshVisibleColumns();
    this.showDefaultColumnsButton = false;
    this.saveColumnsPreference([]);
  }

  getMatchMode(field: string): string {
    return field.toLocaleLowerCase().includes('start')
      ? FilterMode.DateAfter
      : FilterMode.DateBefore;
  }

  onRemoveFilterTags(filterToRemove: FilterToRemove): void {
    const tableFilters = structuredClone(
      this.dataTable.filters[filterToRemove.fieldName],
    );
    const filters = Array.isArray(tableFilters) ? tableFilters : [tableFilters];

    filters.forEach((filter: FilterMetadata) => {
      const index = filter.value?.findIndex(
        (value: any) => value.value === filterToRemove.filterValue,
      );

      if (index !== -1) {
        filter.value.splice(index, 1);
      }
    });

    this.dataTable.filters = {
      ...this.dataTable.filters,
      [filterToRemove.fieldName]: filters,
    };

    this.dataTable._filter();
  }

  createQueryParams(property: string, rowData: any): any {
    return { [property]: rowData[property] };
  }

  onChangeSelectAll(event: TriStateCheckboxChangeEvent): void {
    this._data = this.setIsSelected(this._data, !!event.value);
    this.updateSelectedRows();
  }

  onClearSelection(data?: any[]): void {
    this._data = this.setIsSelected(data || this._data, false);
    this.updateSelectedRows();
  }

  updateSelectedRows(): void {
    this.selectedCount = this.getSelectedDataCount(this._data);
    this.selectAll = this.getSelectAllStatus();
    const selectedItems = this._data.filter((item: any) => item.isSelected);

    this.selectionChange.emit(this.selectedCount);
    this.selectionChangeData.emit(selectedItems);
    this.updateButtonsVisibilityBasedOnSelection();
  }

  onFileActionTrigger(event: GridFileActionEvent, rowData: any): void {
    if (!this.enableFileDownloadWithRowData) {
      this.triggerFileAction.emit({
        event,
        fileName: rowData.fileName,
        documentId: rowData.documentId,
        rowData: null,
      });
    } else {
      this.triggerFileAction.emit({
        event,
        documentId: 0,
        fileName: '',
        rowData,
      });
    }
  }

  onRowClickAction(rowData: GridRowAction): void {
    this.triggerRedirectAction.emit({
      rowData,
    });
  }

  onEventActionTrigger(event: GridEventAction): void {
    this.triggerEventAction.emit({ event });
  }

  customSort(event: SortEvent): void {
    const sortField = event.field || event.multiSortMeta?.[0]?.field || '';

    if (
      this.isSorted == null ||
      this.isSorted === undefined ||
      this.currentSortField !== sortField
    ) {
      this.isSorted = true;
    } else if (this.isSorted === true) {
      this.isSorted = false;
    } else if (this.isSorted === false) {
      this.isSorted = null;

      const currentFilters = structuredClone(this.dataTable.filters);
      this.dataTable.reset();
      this.dataTable.filters = currentFilters;
      this.dataTable._filter();
    }
    this.currentSortField = sortField;

    this.onClearSelection();
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
    if (!this.filteringConfig$) {
      this.applyPreferences();

      return;
    }

    this.filteringConfig$
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
      filters[key] =
        Array.isArray(filter) && filter[0]?.value !== undefined
          ? [{ ...filter[0], value: [] }]
          : { ...filter, value: [] };
    });
  }

  private updateDisplaySaveBtnVisibility(): void {
    this.displaySaveFilterButton =
      this.shouldPersist &&
      !compareFilterEquality(this.actualFilters, this.preferenceToSave.filters);
  }

  private getSelectAllStatus() {
    const selectedCount = this.getSelectedDataCount(this._data);
    const rowCount = this.getSelectedRowCount(this._data);

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

  private setIsSelected(data: any[], isSelected = false): any[] {
    return (data || []).map((item: any) => ({
      ...item,
      isSelected,
      ...(item?.children?.length
        ? {
            children: this.setIsSelected(item.children, isSelected),
          }
        : {}),
    }));
  }

  private getSelectedDataCount(data: any[]): number {
    return (data || []).reduce((acc: number, item: any) => {
      let childSelectedCount = 0;

      if (Array.isArray(item.children) && item.children.length) {
        childSelectedCount += this.getSelectedDataCount(item.children);
      }

      return childSelectedCount + (item.isSelected ? acc + 1 : acc);
    }, 0);
  }

  private getMatchingValuesFromActualFilters(
    activeFilter: ActiveFilterTag,
  ): any[] {
    const actualFilters = this.actualFilters[activeFilter.field];

    return Array.isArray(actualFilters)
      ? actualFilters
          .flatMap((filter) => filter.value || [])
          .filter((filterItem) => filterItem.value === activeFilter.value)
      : [];
  }

  private getNonNullValuesFromPreferences(
    activeFilter: ActiveFilterTag,
  ): any[] {
    const preferenceFilters =
      this.preferenceToSave.filters?.[activeFilter.field];

    return Array.isArray(preferenceFilters)
      ? preferenceFilters
          .flatMap((filter) => filter.value || [])
          .filter((filterItem) => filterItem.value !== null)
      : [];
  }

  private mergeAndDeduplicateValues(
    valuesFromPreferences: any[],
    valuesFromActualFilters: any[],
  ): any[] {
    return [...valuesFromPreferences, ...valuesFromActualFilters].filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.value === item.value),
    );
  }

  private createUpdatedFilter(
    activeFilter: ActiveFilterTag,
    mergedValues: any[],
  ): any[] {
    const actualFilters = this.actualFilters[activeFilter.field];

    return Array.isArray(actualFilters)
      ? actualFilters.map((filter) => ({
          ...filter,
          value: mergedValues,
        }))
      : [];
  }

  private updatePreferences(
    activeFilter: ActiveFilterTag,
    updatedFilter: any[],
  ): void {
    this.preferenceToSave.filters = {
      ...this.preferenceToSave.filters,
      [activeFilter.field]: updatedFilter,
    };
  }

  private getColumnDefinition(key: string): ColumnDefinition {
    return this.userSortedCols.find((col) => col.field === key);
  }

  private getUpdatedFiltersAfterDeletion(activeFilter: ActiveFilterTag): any[] {
    const preferenceFilters =
      this.preferenceToSave.filters?.[activeFilter.field];

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
      [activeFilter.field]:
        updatedFilters.length > 0
          ? updatedFilters
          : [{ ...DEFAULT_FILTERS_MAP[column.type] }],
    };
  }

  private emitUpdatedPreferences(): void {
    this.savePreference.emit(this.preferenceToSave);
  }

  private removeFilterSortDisabledCols(columns: ColumnDefinition[]): void {
    const disabledColumns = columns.filter(
      (column: ColumnDefinition) => column.hidden,
    );

    if (disabledColumns.length === 0) {
      return;
    }

    disabledColumns.forEach((column: ColumnDefinition) => {
      this.dataTable.filter(null, column.field, FilterMode.In);
    });

    this.dataTable._sortField = null;
    this.dataTable._sortOrder = this.dataTable.defaultSortOrder;
    this.dataTable._multiSortMeta = null;
    this.dataTable.tableService.onSort(null);
  }

  private applyPreferences(): void {
    if (!this.shouldPersist) {
      return;
    }

    const preferenceData = structuredClone(
      this.preferenceToSave,
    ) as PreferenceDataModel;

    this.applyFilters(preferenceData.filters);

    this.applyPaginatorSize(preferenceData.rowsPerPage);

    this.applyColumns(
      preferenceData.columns,
      preferenceData.showDefaultColumnsButton,
    );

    this.dataTable._filter();
  }

  private applyFilters(filters: FilterTypeModel | null): void {
    if (filters && Object.keys(filters).length) {
      this.dataTable.filters = filters;
    }
  }

  private applyPaginatorSize(rowsPerPage: number): void {
    this.rows = rowsPerPage || this.defaultRowsPerPage;
    this.onChangeRows(this.rows, true);
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
      this.localDisplayColsReorderButton = true;
      this.showSelectedCount = false;
    } else {
      this.localDisplayExportButton = false;
      this.localDisplayColsReorderButton = false;
      this.showSelectedCount = true;
    }
  }
}
