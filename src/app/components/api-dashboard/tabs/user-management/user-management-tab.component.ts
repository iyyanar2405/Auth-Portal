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
import { CalendarModule } from 'primeng/calendar';
import { ApiService } from '../../../../services/api.service';
import { DashboardService } from '../../../../services/dashboard.service';

@Component({
  selector: 'app-user-management-tab',
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
    AccordionModule,
    CalendarModule
  ],
  templateUrl: './user-management-tab.component.html',
  styleUrls: ['./user-management-tab.component.scss']
})
export class UserManagementTabComponent implements OnInit {
  private apiService = inject(ApiService);
  private dashboardService = inject(DashboardService);
  private fb = inject(FormBuilder);

  // Dialog visibility flags
  showCreateUserDialog = false;
  showEditUserDialog = false;
  showDeleteUserDialog = false;
  showLockoutUserDialog = false;
  showSearchUsersDialog = false;

  // Forms
  createUserForm!: FormGroup;
  editUserForm!: FormGroup;
  searchUsersForm!: FormGroup;
  lockoutForm!: FormGroup;

  // Loading states
  isLoading = false;
  createUserLoading = false;
  editUserLoading = false;
  deleteUserLoading = false;
  lockoutUserLoading = false;
  searchUsersLoading = false;

  // Messages
  createUserMessage = '';
  editUserMessage = '';
  deleteUserMessage = '';
  lockoutUserMessage = '';
  searchUsersMessage = '';

  // Data
  selectedUser: any = null;
  searchResults: any[] = [];

  constructor() {
    this.initializeForms();
  }

  ngOnInit(): void {}

  get userManagementEndpoints() {
    return this.dashboardService.getEndpointsByCategory('User Management');
  }

  private initializeForms(): void {
    this.createUserForm = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      isActive: [true]
    });

    this.editUserForm = this.fb.group({
      id: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      isActive: [true]
    });

    this.searchUsersForm = this.fb.group({
      pageNumber: [1, [Validators.required, Validators.min(1)]],
      pageSize: [10, [Validators.required, Validators.min(1), Validators.max(100)]],
      searchTerm: ['']
    });

    this.lockoutForm = this.fb.group({
      userId: ['', [Validators.required]],
      lockoutEnd: [null]
    });
  }

  openUserManagementUI(type: string): void {
    switch (type) {
      case 'list':
        this.showSearchUsersDialog = true;
        this.handleSearchUsers();
        break;
      case 'create':
        this.showCreateUserDialog = true;
        break;
      case 'edit':
        this.showEditUserDialog = true;
        break;
      case 'delete':
        this.showDeleteUserDialog = true;
        break;
      case 'lockout':
        this.showLockoutUserDialog = true;
        break;
    }
  }

  async handleCreateUser(): Promise<void> {
    if (this.createUserForm.invalid) {
      this.markFormGroupTouched(this.createUserForm);
      return;
    }

    this.createUserLoading = true;
    this.createUserMessage = '';

    try {
      const userData = this.createUserForm.value;
      const result = await this.apiService.testEndpoint({
        endpoint: '/api/User',
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (result.success) {
        this.createUserMessage = 'User created successfully!';
        setTimeout(() => {
          this.showCreateUserDialog = false;
          this.createUserForm.reset();
          this.createUserForm.patchValue({ isActive: true });
        }, 2000);
      } else {
        this.createUserMessage = result.error || 'Failed to create user';
      }
    } catch (error: any) {
      this.createUserMessage = error.message || 'An error occurred';
    } finally {
      this.createUserLoading = false;
    }
  }

  async handleEditUser(): Promise<void> {
    if (this.editUserForm.invalid) {
      this.markFormGroupTouched(this.editUserForm);
      return;
    }

    this.editUserLoading = true;
    this.editUserMessage = '';

    try {
      const userData = this.editUserForm.value;
      const userId = userData.id;
      const result = await this.apiService.testEndpoint({
        endpoint: `/api/User/${userId}`,
        method: 'PUT',
        body: JSON.stringify(userData)
      });

      if (result.success) {
        this.editUserMessage = 'User updated successfully!';
        setTimeout(() => {
          this.showEditUserDialog = false;
          this.editUserForm.reset();
        }, 2000);
      } else {
        this.editUserMessage = result.error || 'Failed to update user';
      }
    } catch (error: any) {
      this.editUserMessage = error.message || 'An error occurred';
    } finally {
      this.editUserLoading = false;
    }
  }

  async handleDeleteUser(): Promise<void> {
    if (!this.selectedUser?.id) {
      this.deleteUserMessage = 'Please select a user to delete';
      return;
    }

    this.deleteUserLoading = true;
    this.deleteUserMessage = '';

    try {
      const result = await this.apiService.testEndpoint({
        endpoint: `/api/User/${this.selectedUser.id}`,
        method: 'DELETE'
      });

      if (result.success) {
        this.deleteUserMessage = 'User deleted successfully!';
        setTimeout(() => {
          this.showDeleteUserDialog = false;
          this.selectedUser = null;
        }, 2000);
      } else {
        this.deleteUserMessage = result.error || 'Failed to delete user';
      }
    } catch (error: any) {
      this.deleteUserMessage = error.message || 'An error occurred';
    } finally {
      this.deleteUserLoading = false;
    }
  }

  async handleLockoutUser(): Promise<void> {
    if (this.lockoutForm.invalid) {
      this.markFormGroupTouched(this.lockoutForm);
      return;
    }

    this.lockoutUserLoading = true;
    this.lockoutUserMessage = '';

    try {
      const { userId, lockoutEnd } = this.lockoutForm.value;
      const endpoint = lockoutEnd ? 
        `/api/User/${userId}/lockout` : 
        `/api/User/${userId}/unlock`;
      
      const body = lockoutEnd ? { lockoutEnd: lockoutEnd.toISOString() } : {};

      const result = await this.apiService.testEndpoint({
        endpoint,
        method: 'POST',
        body: lockoutEnd ? JSON.stringify(body) : undefined
      });

      if (result.success) {
        this.lockoutUserMessage = lockoutEnd ? 
          'User locked out successfully!' : 
          'User unlocked successfully!';
        setTimeout(() => {
          this.showLockoutUserDialog = false;
          this.lockoutForm.reset();
        }, 2000);
      } else {
        this.lockoutUserMessage = result.error || 'Operation failed';
      }
    } catch (error: any) {
      this.lockoutUserMessage = error.message || 'An error occurred';
    } finally {
      this.lockoutUserLoading = false;
    }
  }

  async handleSearchUsers(): Promise<void> {
    if (this.searchUsersForm.invalid) {
      this.markFormGroupTouched(this.searchUsersForm);
      return;
    }

    this.searchUsersLoading = true;
    this.searchUsersMessage = '';

    try {
      const { pageNumber, pageSize, searchTerm } = this.searchUsersForm.value;
      const params = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
      });

      if (searchTerm) {
        params.append('searchTerm', searchTerm);
      }

      const result = await this.apiService.testEndpoint({
        endpoint: `/api/User?${params.toString()}`,
        method: 'GET'
      });

      if (result.success) {
        this.searchResults = result.data?.users || [];
        this.searchUsersMessage = result.data?.users?.length > 0 ? 
          `Found ${result.data.users.length} users` : 
          'No users found';
      } else {
        this.searchUsersMessage = result.error || 'Search failed';
        this.searchResults = [];
      }
    } catch (error: any) {
      this.searchUsersMessage = error.message || 'An error occurred';
      this.searchResults = [];
    } finally {
      this.searchUsersLoading = false;
    }
  }

  async handleGetUserById(userId: string): Promise<void> {
    if (!userId) {
      return;
    }

    this.isLoading = true;

    try {
      const result = await this.apiService.testEndpoint({
        endpoint: `/api/User/${userId}`,
        method: 'GET'
      });

      if (result.success) {
        this.selectedUser = result.data;
        this.editUserForm.patchValue(result.data);
      }
    } catch (error: any) {
      console.error('Error fetching user:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async handleResetUserPassword(userId: string): Promise<void> {
    if (!userId) {
      return;
    }

    this.isLoading = true;

    try {
      const result = await this.apiService.testEndpoint({
        endpoint: `/api/User/${userId}/reset-password`,
        method: 'POST'
      });

      if (result.success) {
        // Handle success
        console.log('Password reset successfully');
      }
    } catch (error: any) {
      console.error('Error resetting password:', error);
    } finally {
      this.isLoading = false;
    }
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.editUserForm.patchValue(user);
    this.lockoutForm.patchValue({ userId: user.id });
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