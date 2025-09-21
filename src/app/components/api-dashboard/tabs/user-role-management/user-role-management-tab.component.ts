import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Components
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';

// Services
import { ApiService } from '../../../../services/api.service';
import { DashboardService } from '../../../../services/dashboard.service';

// Interfaces
interface UserRoleAssignRequest {
  userId: string;
  roleId: string;
}

interface UserRoleRemoveRequest {
  userId: string;
  roleId: string;
}

interface UserRolesRequest {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
}

interface RoleUsersRequest {
  roleId: string;
  pageNumber?: number;
  pageSize?: number;
}

interface BulkRoleAssignRequest {
  userIds: string[];
  roleIds: string[];
}

interface UserRole {
  userId: string;
  roleId: string;
  userName?: string;
  userEmail?: string;
  roleName?: string;
  roleDescription?: string;
  assignedDate?: Date;
  isActive?: boolean;
}

interface User {
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
}

interface Role {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface ApiEndpoint {
  endpoint: string;
  method: string;
  summary: string;
  requiresAuth: boolean;
  parameters?: string[];
}

@Component({
  selector: 'app-user-role-management-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TabViewModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    DialogModule,
    MessageModule,
    ChipModule,
    BadgeModule,
    AccordionModule,
    DividerModule,
    MultiSelectModule,
    TableModule
  ],
  templateUrl: './user-role-management-tab.component.html',
  styleUrl: './user-role-management-tab.component.scss'
})
export class UserRoleManagementTabComponent implements OnInit {
  private apiService = inject(ApiService);
  private dashboardService = inject(DashboardService);
  private fb = inject(FormBuilder);

  // Forms
  assignRoleForm: FormGroup;
  removeRoleForm: FormGroup;
  userRolesForm: FormGroup;
  roleUsersForm: FormGroup;
  bulkAssignForm: FormGroup;

  // Dialog States
  showAssignRoleDialog = false;
  showRemoveRoleDialog = false;
  showUserRolesDialog = false;
  showRoleUsersDialog = false;
  showBulkAssignDialog = false;

  // Loading States
  assignRoleLoading = false;
  removeRoleLoading = false;
  userRolesLoading = false;
  roleUsersLoading = false;
  bulkAssignLoading = false;

  // Messages
  assignRoleMessage = '';
  removeRoleMessage = '';
  userRolesMessage = '';
  roleUsersMessage = '';
  bulkAssignMessage = '';

  // Data
  userRoles: UserRole[] = [];
  roleUsers: User[] = [];
  availableUsers: User[] = [];
  availableRoles: Role[] = [];
  selectedUserRoles: UserRole[] = [];

  // API Endpoints for User Role Management
  userRoleManagementEndpoints: ApiEndpoint[] = [
    {
      endpoint: '/api/UserRoles',
      method: 'GET',
      summary: 'Get all user-role assignments',
      requiresAuth: true,
      parameters: ['pageNumber', 'pageSize']
    },
    {
      endpoint: '/api/UserRoles/assign',
      method: 'POST',
      summary: 'Assign a role to a user',
      requiresAuth: true,
      parameters: ['userId', 'roleId']
    },
    {
      endpoint: '/api/UserRoles/remove',
      method: 'DELETE',
      summary: 'Remove a role from a user',
      requiresAuth: true,
      parameters: ['userId', 'roleId']
    },
    {
      endpoint: '/api/UserRoles/user/{userId}',
      method: 'GET',
      summary: 'Get all roles for a specific user',
      requiresAuth: true,
      parameters: ['userId', 'pageNumber', 'pageSize']
    },
    {
      endpoint: '/api/UserRoles/role/{roleId}',
      method: 'GET',
      summary: 'Get all users with a specific role',
      requiresAuth: true,
      parameters: ['roleId', 'pageNumber', 'pageSize']
    },
    {
      endpoint: '/api/UserRoles/user/{userId}/roles',
      method: 'DELETE',
      summary: 'Remove all roles from a user',
      requiresAuth: true,
      parameters: ['userId']
    },
    {
      endpoint: '/api/UserRoles/role/{roleId}/users',
      method: 'DELETE',
      summary: 'Remove all users from a role',
      requiresAuth: true,
      parameters: ['roleId']
    },
    {
      endpoint: '/api/UserRoles/bulk-assign',
      method: 'POST',
      summary: 'Bulk assign roles to multiple users',
      requiresAuth: true,
      parameters: ['userIds', 'roleIds']
    }
  ];

  ngOnInit(): void {
    this.initializeForms();
    this.loadInitialData();
  }

  private initializeForms(): void {
    // Assign Role Form
    this.assignRoleForm = this.fb.group({
      userId: ['', [Validators.required]],
      roleId: ['', [Validators.required]]
    });

    // Remove Role Form
    this.removeRoleForm = this.fb.group({
      userId: ['', [Validators.required]],
      roleId: ['', [Validators.required]]
    });

    // User Roles Form
    this.userRolesForm = this.fb.group({
      userId: ['', [Validators.required]],
      pageNumber: [1, [Validators.min(1)]],
      pageSize: [10, [Validators.min(1), Validators.max(100)]]
    });

    // Role Users Form
    this.roleUsersForm = this.fb.group({
      roleId: ['', [Validators.required]],
      pageNumber: [1, [Validators.min(1)]],
      pageSize: [10, [Validators.min(1), Validators.max(100)]]
    });

    // Bulk Assign Form
    this.bulkAssignForm = this.fb.group({
      userIds: [[], [Validators.required]],
      roleIds: [[], [Validators.required]]
    });
  }

  private async loadInitialData(): Promise<void> {
    // Load sample data - in real app, these would come from API
    this.availableUsers = [
      { id: '1', userName: 'admin', email: 'admin@example.com', isActive: true },
      { id: '2', userName: 'user1', email: 'user1@example.com', isActive: true },
      { id: '3', userName: 'user2', email: 'user2@example.com', isActive: true }
    ];

    this.availableRoles = [
      { id: '1', name: 'Administrator', description: 'Full system access', isActive: true },
      { id: '2', name: 'User', description: 'Standard user access', isActive: true },
      { id: '3', name: 'Manager', description: 'Management access', isActive: true }
    ];
  }

  // UI Management Methods
  openUserRoleManagementUI(action: string): void {
    switch (action) {
      case 'assign':
        this.showAssignRoleDialog = true;
        break;
      case 'remove':
        this.showRemoveRoleDialog = true;
        break;
      case 'user-roles':
        this.showUserRolesDialog = true;
        break;
      case 'role-users':
        this.showRoleUsersDialog = true;
        break;
      case 'bulk-assign':
        this.showBulkAssignDialog = true;
        break;
      case 'list':
        this.openEndpointTester('/api/UserRoles', 'GET');
        break;
    }
  }

  openEndpointTester(endpoint: string, method: string): void {
    this.dashboardService.openEndpointTester(endpoint, method);
  }

  // Form Handlers
  async handleAssignRole(): Promise<void> {
    if (this.assignRoleForm.invalid) {
      this.assignRoleForm.markAllAsTouched();
      return;
    }

    this.assignRoleLoading = true;
    this.assignRoleMessage = '';

    try {
      const assignData: UserRoleAssignRequest = this.assignRoleForm.value;
      await this.apiService.assignUserRole(assignData.userId, assignData.roleId);
      
      this.assignRoleMessage = 'Role assigned successfully!';
      this.assignRoleForm.reset();
      
      setTimeout(() => {
        this.showAssignRoleDialog = false;
        this.assignRoleMessage = '';
      }, 2000);
    } catch (error: any) {
      this.assignRoleMessage = `Error assigning role: ${error.message}`;
    } finally {
      this.assignRoleLoading = false;
    }
  }

  async handleRemoveRole(): Promise<void> {
    if (this.removeRoleForm.invalid) {
      this.removeRoleForm.markAllAsTouched();
      return;
    }

    this.removeRoleLoading = true;
    this.removeRoleMessage = '';

    try {
      const removeData: UserRoleRemoveRequest = this.removeRoleForm.value;
      await this.apiService.removeUserRole(removeData.userId, removeData.roleId);
      
      this.removeRoleMessage = 'Role removed successfully!';
      
      setTimeout(() => {
        this.showRemoveRoleDialog = false;
        this.removeRoleMessage = '';
        this.removeRoleForm.reset();
      }, 2000);
    } catch (error: any) {
      this.removeRoleMessage = `Error removing role: ${error.message}`;
    } finally {
      this.removeRoleLoading = false;
    }
  }

  async handleGetUserRoles(): Promise<void> {
    if (this.userRolesForm.invalid) {
      this.userRolesForm.markAllAsTouched();
      return;
    }

    this.userRolesLoading = true;
    this.userRolesMessage = '';

    try {
      const params: UserRolesRequest = this.userRolesForm.value;
      const response = await this.apiService.getUserRoles(params.userId, params.pageNumber, params.pageSize);
      
      this.userRoles = response.userRoles || [];
      this.userRolesMessage = `Found ${this.userRoles.length} role(s) for user`;
      
      if (this.userRoles.length === 0) {
        this.userRolesMessage = 'No roles found for this user';
      }
    } catch (error: any) {
      this.userRolesMessage = `Error getting user roles: ${error.message}`;
      this.userRoles = [];
    } finally {
      this.userRolesLoading = false;
    }
  }

  async handleGetRoleUsers(): Promise<void> {
    if (this.roleUsersForm.invalid) {
      this.roleUsersForm.markAllAsTouched();
      return;
    }

    this.roleUsersLoading = true;
    this.roleUsersMessage = '';

    try {
      const params: RoleUsersRequest = this.roleUsersForm.value;
      const response = await this.apiService.getRoleUsers(params.roleId, params.pageNumber, params.pageSize);
      
      this.roleUsers = response.users || [];
      this.roleUsersMessage = `Found ${this.roleUsers.length} user(s) with this role`;
      
      if (this.roleUsers.length === 0) {
        this.roleUsersMessage = 'No users found with this role';
      }
    } catch (error: any) {
      this.roleUsersMessage = `Error getting role users: ${error.message}`;
      this.roleUsers = [];
    } finally {
      this.roleUsersLoading = false;
    }
  }

  async handleBulkAssign(): Promise<void> {
    if (this.bulkAssignForm.invalid) {
      this.bulkAssignForm.markAllAsTouched();
      return;
    }

    this.bulkAssignLoading = true;
    this.bulkAssignMessage = '';

    try {
      const bulkData: BulkRoleAssignRequest = this.bulkAssignForm.value;
      await this.apiService.bulkAssignRoles(bulkData.userIds, bulkData.roleIds);
      
      this.bulkAssignMessage = `Successfully assigned ${bulkData.roleIds.length} role(s) to ${bulkData.userIds.length} user(s)`;
      
      setTimeout(() => {
        this.showBulkAssignDialog = false;
        this.bulkAssignMessage = '';
        this.bulkAssignForm.reset();
      }, 2000);
    } catch (error: any) {
      this.bulkAssignMessage = `Error in bulk assignment: ${error.message}`;
    } finally {
      this.bulkAssignLoading = false;
    }
  }

  // Selection Methods
  onUserRoleSelect(userRole: UserRole): void {
    // Handle selection logic if needed
  }

  // Utility Methods
  getAccordionHeader(endpoint: ApiEndpoint): string {
    return `${endpoint.method} ${endpoint.endpoint}`;
  }

  copyCurlCommand(endpoint: ApiEndpoint): void {
    const curlCommand = this.apiService.generateCurlCommand(endpoint.endpoint, endpoint.method, {});
    navigator.clipboard.writeText(curlCommand);
  }

  viewEndpointSchema(endpoint: ApiEndpoint): void {
    this.dashboardService.openEndpointTester(endpoint.endpoint, endpoint.method);
  }

  getUserDisplayName(user: User): string {
    return user.userName || user.email || user.id;
  }

  getRoleDisplayName(role: Role): string {
    return role.name || role.id;
  }

  // Form Reset Methods
  resetAssignForm(): void {
    this.assignRoleForm.reset();
    this.assignRoleMessage = '';
  }

  resetRemoveForm(): void {
    this.removeRoleForm.reset();
    this.removeRoleMessage = '';
  }

  resetUserRolesForm(): void {
    this.userRolesForm.reset();
    this.userRoles = [];
    this.userRolesMessage = '';
  }

  resetRoleUsersForm(): void {
    this.roleUsersForm.reset();
    this.roleUsers = [];
    this.roleUsersMessage = '';
  }

  resetBulkAssignForm(): void {
    this.bulkAssignForm.reset();
    this.bulkAssignMessage = '';
  }

  // Dialog Management
  onAssignDialogHide(): void {
    this.resetAssignForm();
  }

  onRemoveDialogHide(): void {
    this.resetRemoveForm();
  }

  onUserRolesDialogHide(): void {
    this.userRolesMessage = '';
  }

  onRoleUsersDialogHide(): void {
    this.roleUsersMessage = '';
  }

  onBulkAssignDialogHide(): void {
    this.resetBulkAssignForm();
  }
}