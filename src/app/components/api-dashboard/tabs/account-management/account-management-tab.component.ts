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
import { PasswordModule } from 'primeng/password';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

// Services
import { ApiService } from '../../../../services/api.service';
import { DashboardService } from '../../../../services/dashboard.service';

// Interfaces
interface UpdateAccountRequest {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  userName?: string;
}

interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface LockAccountRequest {
  userId: string;
  lockoutEnd?: Date;
  reason?: string;
}

interface AccountProfileRequest {
  userId: string;
  profileData: {
    bio?: string;
    website?: string;
    location?: string;
    birthDate?: Date;
    avatar?: string;
  };
}

interface DeactivateAccountRequest {
  userId: string;
  reason?: string;
  transferDataTo?: string;
}

interface Account {
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive: boolean;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  lockoutEnd?: Date;
  accessFailedCount: number;
  lastLoginDate?: Date;
  createdDate: Date;
  modifiedDate?: Date;
  profile?: {
    bio?: string;
    website?: string;
    location?: string;
    birthDate?: Date;
    avatar?: string;
  };
}

interface ApiEndpoint {
  endpoint: string;
  method: string;
  summary: string;
  requiresAuth: boolean;
  parameters?: string[];
}

@Component({
  selector: 'app-account-management-tab',
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
    PasswordModule,
    CalendarModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './account-management-tab.component.html',
  styleUrl: './account-management-tab.component.scss'
})
export class AccountManagementTabComponent implements OnInit {
  private apiService = inject(ApiService);
  private dashboardService = inject(DashboardService);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);

  // Forms
  updateAccountForm: FormGroup;
  changePasswordForm: FormGroup;
  lockAccountForm: FormGroup;
  profileForm: FormGroup;
  getAccountForm: FormGroup;
  deactivateForm: FormGroup;

  // Dialog States
  showUpdateAccountDialog = false;
  showChangePasswordDialog = false;
  showLockAccountDialog = false;
  showProfileDialog = false;
  showGetAccountDialog = false;
  showDeactivateDialog = false;

  // Loading States
  updateAccountLoading = false;
  changePasswordLoading = false;
  lockAccountLoading = false;
  profileLoading = false;
  getAccountLoading = false;
  deactivateLoading = false;

  // Messages
  updateAccountMessage = '';
  changePasswordMessage = '';
  lockAccountMessage = '';
  profileMessage = '';
  getAccountMessage = '';
  deactivateMessage = '';

  // Data
  currentAccount: Account | null = null;

  // Date utility
  today = new Date();

  // API Endpoints for Account Management
  accountManagementEndpoints: ApiEndpoint[] = [
    {
      endpoint: '/api/Account/profile',
      method: 'GET',
      summary: 'Get current user account profile',
      requiresAuth: true,
      parameters: []
    },
    {
      endpoint: '/api/Account/profile',
      method: 'PUT',
      summary: 'Update current user account profile',
      requiresAuth: true,
      parameters: ['email', 'firstName', 'lastName', 'phoneNumber', 'userName']
    },
    {
      endpoint: '/api/Account/profile/{userId}',
      method: 'GET',
      summary: 'Get specific user account profile',
      requiresAuth: true,
      parameters: ['userId']
    },
    {
      endpoint: '/api/Account/change-password',
      method: 'POST',
      summary: 'Change user password',
      requiresAuth: true,
      parameters: ['currentPassword', 'newPassword', 'confirmPassword']
    },
    {
      endpoint: '/api/Account/lock/{userId}',
      method: 'POST',
      summary: 'Lock user account',
      requiresAuth: true,
      parameters: ['userId', 'lockoutEnd', 'reason']
    },
    {
      endpoint: '/api/Account/unlock/{userId}',
      method: 'POST',
      summary: 'Unlock user account',
      requiresAuth: true,
      parameters: ['userId']
    },
    {
      endpoint: '/api/Account/deactivate',
      method: 'POST',
      summary: 'Deactivate user account',
      requiresAuth: true,
      parameters: ['reason', 'transferDataTo']
    },
    {
      endpoint: '/api/Account/activate/{userId}',
      method: 'POST',
      summary: 'Activate user account',
      requiresAuth: true,
      parameters: ['userId']
    },
    {
      endpoint: '/api/Account/profile-picture',
      method: 'POST',
      summary: 'Upload profile picture',
      requiresAuth: true,
      parameters: ['file']
    },
    {
      endpoint: '/api/Account/delete/{userId}',
      method: 'DELETE',
      summary: 'Permanently delete user account',
      requiresAuth: true,
      parameters: ['userId']
    }
  ];

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    // Update Account Form
    this.updateAccountForm = this.fb.group({
      userId: ['', [Validators.required]],
      email: ['', [Validators.email]],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      userName: ['']
    });

    // Change Password Form
    this.changePasswordForm = this.fb.group({
      userId: ['', [Validators.required]],
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Lock Account Form
    this.lockAccountForm = this.fb.group({
      userId: ['', [Validators.required]],
      lockoutEnd: [''],
      reason: ['']
    });

    // Profile Form
    this.profileForm = this.fb.group({
      userId: ['', [Validators.required]],
      bio: [''],
      website: [''],
      location: [''],
      birthDate: [''],
      avatar: ['']
    });

    // Get Account Form
    this.getAccountForm = this.fb.group({
      userId: ['', [Validators.required]]
    });

    // Deactivate Form
    this.deactivateForm = this.fb.group({
      userId: ['', [Validators.required]],
      reason: [''],
      transferDataTo: ['']
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  // UI Management Methods
  openAccountManagementUI(action: string): void {
    switch (action) {
      case 'update':
        this.showUpdateAccountDialog = true;
        break;
      case 'change-password':
        this.showChangePasswordDialog = true;
        break;
      case 'lock':
        this.showLockAccountDialog = true;
        break;
      case 'profile':
        this.showProfileDialog = true;
        break;
      case 'get-account':
        this.showGetAccountDialog = true;
        break;
      case 'deactivate':
        this.showDeactivateDialog = true;
        break;
      case 'current-profile':
        this.openEndpointTester('/api/Account/profile', 'GET');
        break;
    }
  }

  openEndpointTester(endpoint: string, method: string): void {
    this.dashboardService.openEndpointTester(endpoint, method);
  }

  // Form Handlers
  async handleUpdateAccount(): Promise<void> {
    if (this.updateAccountForm.invalid) {
      this.updateAccountForm.markAllAsTouched();
      return;
    }

    this.updateAccountLoading = true;
    this.updateAccountMessage = '';

    try {
      const updateData: UpdateAccountRequest = this.updateAccountForm.value;
      await this.apiService.updateAccount(updateData);
      
      this.updateAccountMessage = 'Account updated successfully!';
      
      setTimeout(() => {
        this.showUpdateAccountDialog = false;
        this.updateAccountMessage = '';
        this.updateAccountForm.reset();
      }, 2000);
    } catch (error: any) {
      this.updateAccountMessage = `Error updating account: ${error.message}`;
    } finally {
      this.updateAccountLoading = false;
    }
  }

  async handleChangePassword(): Promise<void> {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.changePasswordLoading = true;
    this.changePasswordMessage = '';

    try {
      const passwordData: ChangePasswordRequest = this.changePasswordForm.value;
      await this.apiService.changePassword(passwordData);
      
      this.changePasswordMessage = 'Password changed successfully!';
      
      setTimeout(() => {
        this.showChangePasswordDialog = false;
        this.changePasswordMessage = '';
        this.changePasswordForm.reset();
      }, 2000);
    } catch (error: any) {
      this.changePasswordMessage = `Error changing password: ${error.message}`;
    } finally {
      this.changePasswordLoading = false;
    }
  }

  async handleLockAccount(): Promise<void> {
    if (this.lockAccountForm.invalid) {
      this.lockAccountForm.markAllAsTouched();
      return;
    }

    this.lockAccountLoading = true;
    this.lockAccountMessage = '';

    try {
      const lockData: LockAccountRequest = this.lockAccountForm.value;
      await this.apiService.lockAccount(lockData.userId, lockData.lockoutEnd, lockData.reason);
      
      this.lockAccountMessage = 'Account locked successfully!';
      
      setTimeout(() => {
        this.showLockAccountDialog = false;
        this.lockAccountMessage = '';
        this.lockAccountForm.reset();
      }, 2000);
    } catch (error: any) {
      this.lockAccountMessage = `Error locking account: ${error.message}`;
    } finally {
      this.lockAccountLoading = false;
    }
  }

  async handleUpdateProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.profileLoading = true;
    this.profileMessage = '';

    try {
      const profileData: AccountProfileRequest = {
        userId: this.profileForm.value.userId,
        profileData: {
          bio: this.profileForm.value.bio,
          website: this.profileForm.value.website,
          location: this.profileForm.value.location,
          birthDate: this.profileForm.value.birthDate,
          avatar: this.profileForm.value.avatar
        }
      };
      
      await this.apiService.updateAccountProfile(profileData);
      
      this.profileMessage = 'Profile updated successfully!';
      
      setTimeout(() => {
        this.showProfileDialog = false;
        this.profileMessage = '';
        this.profileForm.reset();
      }, 2000);
    } catch (error: any) {
      this.profileMessage = `Error updating profile: ${error.message}`;
    } finally {
      this.profileLoading = false;
    }
  }

  async handleGetAccount(): Promise<void> {
    if (this.getAccountForm.invalid) {
      this.getAccountForm.markAllAsTouched();
      return;
    }

    this.getAccountLoading = true;
    this.getAccountMessage = '';

    try {
      const userId = this.getAccountForm.value.userId;
      const response = await this.apiService.getAccount(userId);
      
      this.currentAccount = response.account || response;
      this.getAccountMessage = 'Account retrieved successfully!';
    } catch (error: any) {
      this.getAccountMessage = `Error getting account: ${error.message}`;
      this.currentAccount = null;
    } finally {
      this.getAccountLoading = false;
    }
  }

  async handleDeactivateAccount(): Promise<void> {
    if (this.deactivateForm.invalid) {
      this.deactivateForm.markAllAsTouched();
      return;
    }

    // Show confirmation dialog
    this.confirmationService.confirm({
      message: 'Are you sure you want to deactivate this account? This action can be reversed.',
      header: 'Confirm Deactivation',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.deactivateLoading = true;
        this.deactivateMessage = '';

        try {
          const deactivateData: DeactivateAccountRequest = this.deactivateForm.value;
          await this.apiService.deactivateAccount(deactivateData);
          
          this.deactivateMessage = 'Account deactivated successfully!';
          
          setTimeout(() => {
            this.showDeactivateDialog = false;
            this.deactivateMessage = '';
            this.deactivateForm.reset();
          }, 2000);
        } catch (error: any) {
          this.deactivateMessage = `Error deactivating account: ${error.message}`;
        } finally {
          this.deactivateLoading = false;
        }
      }
    });
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

  getAccountStatusClass(account: Account): string {
    if (!account.isActive) return 'status-inactive';
    if (account.lockoutEnd && new Date(account.lockoutEnd) > new Date()) return 'status-locked';
    return 'status-active';
  }

  getAccountStatusText(account: Account): string {
    if (!account.isActive) return 'Inactive';
    if (account.lockoutEnd && new Date(account.lockoutEnd) > new Date()) return 'Locked';
    return 'Active';
  }

  // Form Reset Methods
  resetUpdateForm(): void {
    this.updateAccountForm.reset();
    this.updateAccountMessage = '';
  }

  resetPasswordForm(): void {
    this.changePasswordForm.reset();
    this.changePasswordMessage = '';
  }

  resetLockForm(): void {
    this.lockAccountForm.reset();
    this.lockAccountMessage = '';
  }

  resetProfileForm(): void {
    this.profileForm.reset();
    this.profileMessage = '';
  }

  resetGetAccountForm(): void {
    this.getAccountForm.reset();
    this.getAccountMessage = '';
    this.currentAccount = null;
  }

  resetDeactivateForm(): void {
    this.deactivateForm.reset();
    this.deactivateMessage = '';
  }

  // Dialog Management
  onUpdateDialogHide(): void {
    this.resetUpdateForm();
  }

  onPasswordDialogHide(): void {
    this.resetPasswordForm();
  }

  onLockDialogHide(): void {
    this.resetLockForm();
  }

  onProfileDialogHide(): void {
    this.resetProfileForm();
  }

  onGetAccountDialogHide(): void {
    this.getAccountMessage = '';
  }

  onDeactivateDialogHide(): void {
    this.resetDeactivateForm();
  }
}