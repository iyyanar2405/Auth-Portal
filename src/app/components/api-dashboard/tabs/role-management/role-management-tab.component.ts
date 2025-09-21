import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { AccordionModule } from 'primeng/accordion';
import { ApiService } from '../../../../services/api.service';
import { DashboardService } from '../../../../services/dashboard.service';

@Component({
  selector: 'app-role-management-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
    TooltipModule,
    DividerModule,
    CheckboxModule,
    ChipModule,
    BadgeModule,
    AccordionModule
  ],
  templateUrl: './role-management-tab.component.html',
  styleUrls: ['./role-management-tab.component.scss']
})
export class RoleManagementTabComponent implements OnInit {
  private apiService = inject(ApiService);
  private dashboardService = inject(DashboardService);
  private fb = inject(FormBuilder);

  // Dialog visibility flags
  showCreateRoleDialog = false;
  showEditRoleDialog = false;
  showDeleteRoleDialog = false;
  showSearchRolesDialog = false;
  showRoleUsersDialog = false;

  // Forms
  createRoleForm!: FormGroup;
  editRoleForm!: FormGroup;
  searchRolesForm!: FormGroup;
  roleUsersForm!: FormGroup;

  // Loading states
  isLoading = false;
  createRoleLoading = false;
  editRoleLoading = false;
  deleteRoleLoading = false;
  searchRolesLoading = false;
  roleUsersLoading = false;

  // Messages
  createRoleMessage = '';
  editRoleMessage = '';
  deleteRoleMessage = '';
  searchRolesMessage = '';
  roleUsersMessage = '';

  // Data
  selectedRole: any = null;
  searchResults: any[] = [];
  roleUsers: any[] = [];

  constructor() {
    this.initializeForms();
  }

  ngOnInit(): void {}

  get roleManagementEndpoints() {
    return this.dashboardService.getEndpointsByCategory('Role Management');
  }

  private initializeForms(): void {
    this.createRoleForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      isActive: [true]
    });

    this.editRoleForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      isActive: [true]
    });

    this.searchRolesForm = this.fb.group({
      pageNumber: [1, [Validators.required, Validators.min(1)]],
      pageSize: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
      searchTerm: ['']
    });

    this.roleUsersForm = this.fb.group({
      roleId: ['', [Validators.required]],
      pageNumber: [1, [Validators.required, Validators.min(1)]],
      pageSize: [10, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  openRoleManagementUI(type: string): void {
    switch (type) {
      case 'list':
        this.showSearchRolesDialog = true;
        this.handleSearchRoles();
        break;
      case 'create':
        this.showCreateRoleDialog = true;
        break;
      case 'edit':
        this.showEditRoleDialog = true;
        break;
      case 'delete':
        this.showDeleteRoleDialog = true;
        break;
      case 'users':
        this.showRoleUsersDialog = true;
        break;
    }
  }

  async handleCreateRole(): Promise<void> {
    if (this.createRoleForm.invalid) {
      this.markFormGroupTouched(this.createRoleForm);
      return;
    }

    this.createRoleLoading = true;
    this.createRoleMessage = '';

    try {
      const roleData = this.createRoleForm.value;
      const result = await this.apiService.testEndpoint({
        endpoint: '/api/Role',
        method: 'POST',
        body: JSON.stringify(roleData)
      });

      if (result.success) {
        this.createRoleMessage = 'Role created successfully!';
        setTimeout(() => {
          this.showCreateRoleDialog = false;
          this.createRoleForm.reset();
          this.createRoleForm.patchValue({ isActive: true });
        }, 2000);
      } else {
        this.createRoleMessage = result.error || 'Failed to create role';
      }
    } catch (error: any) {
      this.createRoleMessage = error.message || 'An error occurred';
    } finally {
      this.createRoleLoading = false;
    }
  }

  async handleEditRole(): Promise<void> {
    if (this.editRoleForm.invalid) {
      this.markFormGroupTouched(this.editRoleForm);
      return;
    }

    this.editRoleLoading = true;
    this.editRoleMessage = '';

    try {
      const roleData = this.editRoleForm.value;
      const roleId = roleData.id;
      const result = await this.apiService.testEndpoint({
        endpoint: `/api/Role/${roleId}`,
        method: 'PUT',
        body: JSON.stringify(roleData)
      });

      if (result.success) {
        this.editRoleMessage = 'Role updated successfully!';
        setTimeout(() => {
          this.showEditRoleDialog = false;
          this.editRoleForm.reset();
        }, 2000);
      } else {
        this.editRoleMessage = result.error || 'Failed to update role';
      }
    } catch (error: any) {
      this.editRoleMessage = error.message || 'An error occurred';
    } finally {
      this.editRoleLoading = false;
    }
  }

  async handleDeleteRole(): Promise<void> {
    if (!this.selectedRole?.id) {
      this.deleteRoleMessage = 'Please select a role to delete';
      return;
    }

    this.deleteRoleLoading = true;
    this.deleteRoleMessage = '';

    try {
      const result = await this.apiService.testEndpoint({
        endpoint: `/api/Role/${this.selectedRole.id}`,
        method: 'DELETE'
      });

      if (result.success) {
        this.deleteRoleMessage = 'Role deleted successfully!';
        setTimeout(() => {
          this.showDeleteRoleDialog = false;
          this.selectedRole = null;
        }, 2000);
      } else {
        this.deleteRoleMessage = result.error || 'Failed to delete role';
      }
    } catch (error: any) {
      this.deleteRoleMessage = error.message || 'An error occurred';
    } finally {
      this.deleteRoleLoading = false;
    }
  }

  async handleSearchRoles(): Promise<void> {
    if (this.searchRolesForm.invalid) {
      this.markFormGroupTouched(this.searchRolesForm);
      return;
    }

    this.searchRolesLoading = true;
    this.searchRolesMessage = '';

    try {
      const { pageNumber, pageSize, searchTerm } = this.searchRolesForm.value;
      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
      });

      if (searchTerm) {
        params.append('searchTerm', searchTerm);
      }

      const result = await this.apiService.testEndpoint({
        endpoint: `/api/Role?${params.toString()}`,
        method: 'GET'
      });

      if (result.success) {
        this.searchResults = result.data?.roles || [];
        this.searchRolesMessage = result.data?.roles?.length > 0 ? 
          `Found ${result.data.roles.length} roles` : 
          'No roles found';
      } else {
        this.searchRolesMessage = result.error || 'Search failed';
        this.searchResults = [];
      }
    } catch (error: any) {
      this.searchRolesMessage = error.message || 'An error occurred';
      this.searchResults = [];
    } finally {
      this.searchRolesLoading = false;
    }
  }

  async handleGetRoleUsers(): Promise<void> {
    if (this.roleUsersForm.invalid) {
      this.markFormGroupTouched(this.roleUsersForm);
      return;
    }

    this.roleUsersLoading = true;
    this.roleUsersMessage = '';

    try {
      const { roleId, pageNumber, pageSize } = this.roleUsersForm.value;
      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
      });

      const result = await this.apiService.testEndpoint({
        endpoint: `/api/Role/${roleId}/users?${params.toString()}`,
        method: 'GET'
      });

      if (result.success) {
        this.roleUsers = result.data?.users || [];
        this.roleUsersMessage = result.data?.users?.length > 0 ? 
          `Found ${result.data.users.length} users in this role` : 
          'No users found in this role';
      } else {
        this.roleUsersMessage = result.error || 'Failed to get role users';
        this.roleUsers = [];
      }
    } catch (error: any) {
      this.roleUsersMessage = error.message || 'An error occurred';
      this.roleUsers = [];
    } finally {
      this.roleUsersLoading = false;
    }
  }

  async handleGetRoleById(roleId: string): Promise<void> {
    if (!roleId) {
      return;
    }

    this.isLoading = true;

    try {
      const result = await this.apiService.testEndpoint({
        endpoint: `/api/Role/${roleId}`,
        method: 'GET'
      });

      if (result.success) {
        this.selectedRole = result.data;
        this.editRoleForm.patchValue(result.data);
        this.roleUsersForm.patchValue({ roleId: roleId });
      }
    } catch (error: any) {
      console.error('Error fetching role:', error);
    } finally {
      this.isLoading = false;
    }
  }

  selectRole(role: any): void {
    this.selectedRole = role;
    this.editRoleForm.patchValue(role);
    this.roleUsersForm.patchValue({ roleId: role.id });
  }

  openEndpointTester(endpoint: string, method: string): void {
    this.dashboardService.openEndpointTester(endpoint, method);
  }

  copyCurlCommand(endpoint: any): void {
    this.apiService.copyCurlCommand(endpoint);
  }

  viewEndpointSchema(endpoint: any): void {
    console.log('Schema for:', endpoint);
  }

  getAccordionHeader(endpoint: any): string {
    return this.dashboardService.getAccordionHeader(endpoint);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}