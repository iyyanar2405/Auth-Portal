import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { MessageService, ConfirmationService } from 'primeng/api';

import { 
  BaseCrudService, 
  CrudEntity, 
  PaginationParams, 
  PaginatedResponse 
} from '../../services/crud.service';

export interface CrudColumn {
  field: string;
  header: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'tag' | 'actions';
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  tagSeverity?: (value: any) => 'success' | 'info' | 'warning' | 'danger';
}

export interface CrudConfig {
  title: string;
  columns: CrudColumn[];
  formFields: FormFieldConfig[];
  apiDocumentation?: {
    baseEndpoint: string;
    description: string;
    methods: {
      get?: { description: string; responseExample: any };
      post?: { description: string; requestExample: any; responseExample: any };
      put?: { description: string; requestExample: any; responseExample: any };
      delete?: { description: string; responseExample: any };
    };
  };
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  required?: boolean;
  options?: { label: string; value: any }[];
  validators?: any[];
}

@Component({
  selector: 'shared-crud-grid',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    DropdownModule,
    TagModule,
    ToolbarModule,
    CardModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-card [header]="config.title" class="crud-card">
      <!-- API Documentation Section -->
      <div class="api-docs-section" *ngIf="config.apiDocumentation">
        <h3>API Documentation</h3>
        <div class="api-info">
          <p><strong>Base Endpoint:</strong> <code>{{config.apiDocumentation.baseEndpoint}}</code></p>
          <p>{{config.apiDocumentation.description}}</p>
          
          <div class="api-methods" *ngIf="showApiDocs">
            <div class="method-item" *ngFor="let method of getApiMethods()">
              <h4>{{method.name.toUpperCase()}}</h4>
              <p>{{method.description}}</p>
              <div *ngIf="method.requestExample" class="code-example">
                <strong>Request:</strong>
                <pre>{{method.requestExample | json}}</pre>
              </div>
              <div *ngIf="method.responseExample" class="code-example">
                <strong>Response:</strong>
                <pre>{{method.responseExample | json}}</pre>
              </div>
            </div>
          </div>
          
          <p-button 
            [label]="showApiDocs ? 'Hide API Details' : 'Show API Details'" 
            icon="pi pi-book"
            (onClick)="toggleApiDocs()"
            class="p-button-outlined p-button-sm">
          </p-button>
        </div>
      </div>

      <!-- Toolbar -->
      <p-toolbar class="mb-4">
        <div class="p-toolbar-group-start">
          <p-button 
            label="New" 
            icon="pi pi-plus" 
            severity="success" 
            (onClick)="openDialog()"
            class="mr-2">
          </p-button>
        </div>
        
        <div class="p-toolbar-group-end">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input 
              pInputText 
              type="text" 
              placeholder="Search..." 
              [(ngModel)]="globalFilter"
              (input)="applyGlobalFilter($event)">
          </span>
        </div>
      </p-toolbar>

      <!-- Data Table -->
      <p-table 
        [value]="data" 
        [rows]="pageSize"
        [totalRecords]="totalRecords"
        [lazy]="true"
        [paginator]="true"
        [loading]="loading"
        (onLazyLoad)="loadData($event)"
        responsiveLayout="scroll"
        class="p-datatable-striped">
        
        <ng-template pTemplate="header">
          <tr>
            <th *ngFor="let col of config.columns" 
                [pSortableColumn]="col.sortable ? col.field : null"
                [style.width]="col.width">
              {{col.header}}
              <p-sortIcon *ngIf="col.sortable" [field]="col.field"></p-sortIcon>
            </th>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="body" let-item let-rowIndex="rowIndex">
          <tr>
            <td *ngFor="let col of config.columns">
              <ng-container [ngSwitch]="col.type">
                <!-- Tag display -->
                <p-tag 
                  *ngSwitchCase="'tag'" 
                  [value]="item[col.field]"
                  [severity]="col.tagSeverity ? col.tagSeverity(item[col.field]) : 'info'">
                </p-tag>
                
                <!-- Actions -->
                <div *ngSwitchCase="'actions'" class="action-buttons">
                  <p-button 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text p-button-sm mr-1"
                    (onClick)="editItem(item)"
                    pTooltip="Edit">
                  </p-button>
                  <p-button 
                    icon="pi pi-trash" 
                    severity="danger"
                    class="p-button-rounded p-button-text p-button-sm"
                    (onClick)="deleteItem(item)"
                    pTooltip="Delete">
                  </p-button>
                </div>
                
                <!-- Default text display -->
                <span *ngSwitchDefault>{{item[col.field]}}</span>
              </ng-container>
            </td>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="emptymessage">
          <tr>
            <td [attr.colspan]="config.columns.length">
              No records found.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>

    <!-- Create/Edit Dialog -->
    <p-dialog 
      [header]="dialogMode === 'create' ? 'Create New ' + config.title : 'Edit ' + config.title"
      [(visible)]="dialogVisible" 
      [modal]="true" 
      [style]="{width: '450px'}"
      [maximizable]="false">
      
      <form [formGroup]="itemForm" (ngSubmit)="saveItem()">
        <div class="form-field" *ngFor="let field of config.formFields">
          <label [for]="field.name">{{field.label}}</label>
          
          <ng-container [ngSwitch]="field.type">
            <input 
              *ngSwitchCase="'text'"
              [id]="field.name"
              type="text" 
              pInputText 
              [formControlName]="field.name"
              class="w-full">
              
            <input 
              *ngSwitchCase="'email'"
              [id]="field.name"
              type="email" 
              pInputText 
              [formControlName]="field.name"
              class="w-full">
              
            <input 
              *ngSwitchCase="'password'"
              [id]="field.name"
              type="password" 
              pInputText 
              [formControlName]="field.name"
              class="w-full">
              
            <input 
              *ngSwitchCase="'number'"
              [id]="field.name"
              type="number" 
              pInputText 
              [formControlName]="field.name"
              class="w-full">
              
            <p-dropdown 
              *ngSwitchCase="'select'"
              [id]="field.name"
              [options]="field.options"
              [formControlName]="field.name"
              optionLabel="label"
              optionValue="value"
              class="w-full">
            </p-dropdown>
            
            <textarea 
              *ngSwitchCase="'textarea'"
              [id]="field.name"
              pInputTextarea 
              [formControlName]="field.name"
              rows="3"
              class="w-full">
            </textarea>
          </ng-container>
          
          <small 
            class="p-error" 
            *ngIf="itemForm.get(field.name)?.invalid && itemForm.get(field.name)?.touched">
            {{field.label}} is required
          </small>
        </div>
        
        <div class="flex justify-content-end gap-2 mt-4">
          <p-button 
            label="Cancel" 
            icon="pi pi-times" 
            (onClick)="hideDialog()"
            class="p-button-text">
          </p-button>
          <p-button 
            label="Save" 
            icon="pi pi-check" 
            type="submit"
            [disabled]="itemForm.invalid"
            [loading]="saving">
          </p-button>
        </div>
      </form>
    </p-dialog>

    <!-- Confirmation Dialog -->
    <p-confirmDialog></p-confirmDialog>
    
    <!-- Toast Messages -->
    <p-toast></p-toast>
  `,
  styleUrls: ['./crud-grid.component.scss']
})
export class CrudGridComponent<T extends CrudEntity> implements OnInit {
  @Input() config!: CrudConfig;
  @Input() crudService!: BaseCrudService<T>;
  @Output() itemSelected = new EventEmitter<T>();
  @Output() itemCreated = new EventEmitter<T>();
  @Output() itemUpdated = new EventEmitter<T>();
  @Output() itemDeleted = new EventEmitter<string | number>();

  data: T[] = [];
  totalRecords = 0;
  loading = false;
  saving = false;
  pageSize = 10;
  globalFilter = '';
  
  dialogVisible = false;
  dialogMode: 'create' | 'edit' = 'create';
  selectedItem: T | null = null;
  itemForm!: FormGroup;
  
  showApiDocs = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadData({ first: 0, rows: this.pageSize });
  }

  private initializeForm(): void {
    const formControls: any = {};
    
    this.config.formFields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      if (field.validators) {
        validators.push(...field.validators);
      }
      formControls[field.name] = [null, validators];
    });

    this.itemForm = this.fb.group(formControls);
  }

  loadData(event: any): void {
    this.loading = true;
    
    const params: PaginationParams = {
      page: (event.first / event.rows) + 1,
      limit: event.rows,
      sortField: event.sortField,
      sortOrder: event.sortOrder === 1 ? 'asc' : 'desc',
      filters: this.globalFilter ? { search: this.globalFilter } : undefined
    };

    this.crudService.getAll(params).subscribe({
      next: (response: PaginatedResponse<T>) => {
        this.data = response.data;
        this.totalRecords = response.total;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load data'
        });
      }
    });
  }

  applyGlobalFilter(event: any): void {
    this.globalFilter = event.target.value;
    this.loadData({ first: 0, rows: this.pageSize });
  }

  openDialog(): void {
    this.dialogMode = 'create';
    this.selectedItem = null;
    this.itemForm.reset();
    this.dialogVisible = true;
  }

  editItem(item: T): void {
    this.dialogMode = 'edit';
    this.selectedItem = item;
    this.itemForm.patchValue(item);
    this.dialogVisible = true;
  }

  hideDialog(): void {
    this.dialogVisible = false;
    this.itemForm.reset();
    this.selectedItem = null;
  }

  saveItem(): void {
    if (this.itemForm.valid) {
      this.saving = true;
      const formValue = this.itemForm.value;

      const operation = this.dialogMode === 'create' 
        ? this.crudService.create(formValue)
        : this.crudService.update(this.selectedItem!.id, formValue);

      operation.subscribe({
        next: (result) => {
          this.saving = false;
          this.hideDialog();
          this.loadData({ first: 0, rows: this.pageSize });
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Item ${this.dialogMode === 'create' ? 'created' : 'updated'} successfully`
          });

          if (this.dialogMode === 'create') {
            this.itemCreated.emit(result);
          } else {
            this.itemUpdated.emit(result);
          }
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${this.dialogMode} item`
          });
        }
      });
    }
  }

  deleteItem(item: T): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this ${this.config.title.toLowerCase()}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.crudService.delete(item.id).subscribe({
          next: () => {
            this.loadData({ first: 0, rows: this.pageSize });
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Item deleted successfully'
            });
            this.itemDeleted.emit(item.id);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete item'
            });
          }
        });
      }
    });
  }

  toggleApiDocs(): void {
    this.showApiDocs = !this.showApiDocs;
  }

  getApiMethods(): any[] {
    if (!this.config.apiDocumentation?.methods) return [];
    
    return Object.entries(this.config.apiDocumentation.methods).map(([method, config]) => ({
      name: method,
      description: config.description,
      requestExample: (config as any).requestExample,
      responseExample: config.responseExample
    }));
  }
}