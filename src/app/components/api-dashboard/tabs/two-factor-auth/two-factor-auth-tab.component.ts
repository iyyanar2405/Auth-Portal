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
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';

// Services
import { ApiService } from '../../../../services/api.service';
import { DashboardService } from '../../../../services/dashboard.service';

// Interfaces
interface TwoFactorSetupRequest {
  userId: string;
  method: 'sms' | 'email' | 'authenticator';
  phoneNumber?: string;
  email?: string;
}

interface TwoFactorVerifyRequest {
  userId: string;
  code: string;
  method: 'sms' | 'email' | 'authenticator';
}

interface TwoFactorDisableRequest {
  userId: string;
  verificationCode: string;
}

interface TwoFactorStatusRequest {
  userId: string;
}

interface RecoveryCodesRequest {
  userId: string;
}

interface TwoFactorInfo {
  isEnabled: boolean;
  methods: Array<{
    type: 'sms' | 'email' | 'authenticator';
    isActive: boolean;
    maskedContact?: string;
  }>;
  hasRecoveryCodes: boolean;
  recoveryCodesCount: number;
  lastUsed?: Date;
}

interface ApiEndpoint {
  endpoint: string;
  method: string;
  summary: string;
  requiresAuth: boolean;
  parameters?: string[];
}

@Component({
  selector: 'app-two-factor-auth-tab',
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
    DropdownModule,
    ImageModule
  ],
  templateUrl: './two-factor-auth-tab.component.html',
  styleUrl: './two-factor-auth-tab.component.scss'
})
export class TwoFactorAuthTabComponent implements OnInit {
  private apiService = inject(ApiService);
  private dashboardService = inject(DashboardService);
  private fb = inject(FormBuilder);

  // Forms
  setupTwoFactorForm: FormGroup;
  verifyTwoFactorForm: FormGroup;
  disableTwoFactorForm: FormGroup;
  statusForm: FormGroup;
  recoveryCodesForm: FormGroup;

  // Dialog States
  showSetupDialog = false;
  showVerifyDialog = false;
  showDisableDialog = false;
  showStatusDialog = false;
  showRecoveryCodesDialog = false;
  showQrCodeDialog = false;

  // Loading States
  setupLoading = false;
  verifyLoading = false;
  disableLoading = false;
  statusLoading = false;
  recoveryLoading = false;

  // Messages
  setupMessage = '';
  verifyMessage = '';
  disableMessage = '';
  statusMessage = '';
  recoveryMessage = '';

  // Data
  twoFactorInfo: TwoFactorInfo | null = null;
  qrCodeUrl = '';
  manualEntryKey = '';
  recoveryCodes: string[] = [];

  // Two-Factor Methods
  twoFactorMethods = [
    { label: 'SMS (Text Message)', value: 'sms', icon: 'pi pi-mobile' },
    { label: 'Email', value: 'email', icon: 'pi pi-envelope' },
    { label: 'Authenticator App', value: 'authenticator', icon: 'pi pi-shield' }
  ];

  // API Endpoints for Two-Factor Authentication
  twoFactorEndpoints: ApiEndpoint[] = [
    {
      endpoint: '/api/TwoFactor/setup',
      method: 'POST',
      summary: 'Setup two-factor authentication for a user',
      requiresAuth: true,
      parameters: ['userId', 'method', 'phoneNumber', 'email']
    },
    {
      endpoint: '/api/TwoFactor/verify',
      method: 'POST',
      summary: 'Verify two-factor authentication code',
      requiresAuth: true,
      parameters: ['userId', 'code', 'method']
    },
    {
      endpoint: '/api/TwoFactor/disable',
      method: 'POST',
      summary: 'Disable two-factor authentication',
      requiresAuth: true,
      parameters: ['userId', 'verificationCode']
    },
    {
      endpoint: '/api/TwoFactor/status/{userId}',
      method: 'GET',
      summary: 'Get two-factor authentication status',
      requiresAuth: true,
      parameters: ['userId']
    },
    {
      endpoint: '/api/TwoFactor/recovery-codes',
      method: 'GET',
      summary: 'Generate new recovery codes',
      requiresAuth: true,
      parameters: ['userId']
    },
    {
      endpoint: '/api/TwoFactor/recovery-codes',
      method: 'POST',
      summary: 'Regenerate recovery codes',
      requiresAuth: true,
      parameters: ['userId']
    },
    {
      endpoint: '/api/TwoFactor/authenticator/qrcode',
      method: 'GET',
      summary: 'Get QR code for authenticator setup',
      requiresAuth: true,
      parameters: ['userId']
    },
    {
      endpoint: '/api/TwoFactor/authenticator/manual-key',
      method: 'GET',
      summary: 'Get manual entry key for authenticator',
      requiresAuth: true,
      parameters: ['userId']
    }
  ];

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    // Setup Two-Factor Form
    this.setupTwoFactorForm = this.fb.group({
      userId: ['', [Validators.required]],
      method: ['', [Validators.required]],
      phoneNumber: [''],
      email: ['', [Validators.email]]
    });

    // Verify Two-Factor Form
    this.verifyTwoFactorForm = this.fb.group({
      userId: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      method: ['', [Validators.required]]
    });

    // Disable Two-Factor Form
    this.disableTwoFactorForm = this.fb.group({
      userId: ['', [Validators.required]],
      verificationCode: ['', [Validators.required]]
    });

    // Status Form
    this.statusForm = this.fb.group({
      userId: ['', [Validators.required]]
    });

    // Recovery Codes Form
    this.recoveryCodesForm = this.fb.group({
      userId: ['', [Validators.required]]
    });

    // Watch method changes for conditional validation
    this.setupTwoFactorForm.get('method')?.valueChanges.subscribe(method => {
      this.updateValidationRules(method);
    });
  }

  private updateValidationRules(method: string): void {
    const phoneControl = this.setupTwoFactorForm.get('phoneNumber');
    const emailControl = this.setupTwoFactorForm.get('email');

    // Clear existing validators
    phoneControl?.clearValidators();
    emailControl?.clearValidators();

    // Add validators based on method
    if (method === 'sms') {
      phoneControl?.setValidators([Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]);
    } else if (method === 'email') {
      emailControl?.setValidators([Validators.required, Validators.email]);
    }

    phoneControl?.updateValueAndValidity();
    emailControl?.updateValueAndValidity();
  }

  // UI Management Methods
  openTwoFactorUI(action: string): void {
    switch (action) {
      case 'setup':
        this.showSetupDialog = true;
        break;
      case 'verify':
        this.showVerifyDialog = true;
        break;
      case 'disable':
        this.showDisableDialog = true;
        break;
      case 'status':
        this.showStatusDialog = true;
        break;
      case 'recovery-codes':
        this.showRecoveryCodesDialog = true;
        break;
      case 'qr-code':
        this.showQrCodeDialog = true;
        break;
    }
  }

  openEndpointTester(endpoint: string, method: string): void {
    this.dashboardService.openEndpointTester(endpoint, method);
  }

  // Form Handlers
  async handleSetupTwoFactor(): Promise<void> {
    if (this.setupTwoFactorForm.invalid) {
      this.setupTwoFactorForm.markAllAsTouched();
      return;
    }

    this.setupLoading = true;
    this.setupMessage = '';

    try {
      const setupData: TwoFactorSetupRequest = this.setupTwoFactorForm.value;
      const response = await this.apiService.setupTwoFactor(setupData);
      
      this.setupMessage = 'Two-factor authentication setup initiated successfully!';
      
      // If authenticator method, show QR code
      if (setupData.method === 'authenticator' && response.qrCodeUrl) {
        this.qrCodeUrl = response.qrCodeUrl;
        this.manualEntryKey = response.manualEntryKey || '';
        this.showQrCodeDialog = true;
      }
      
      setTimeout(() => {
        this.showSetupDialog = false;
        this.setupMessage = '';
      }, 2000);
    } catch (error: any) {
      this.setupMessage = `Error setting up two-factor authentication: ${error.message}`;
    } finally {
      this.setupLoading = false;
    }
  }

  async handleVerifyTwoFactor(): Promise<void> {
    if (this.verifyTwoFactorForm.invalid) {
      this.verifyTwoFactorForm.markAllAsTouched();
      return;
    }

    this.verifyLoading = true;
    this.verifyMessage = '';

    try {
      const verifyData: TwoFactorVerifyRequest = this.verifyTwoFactorForm.value;
      await this.apiService.verifyTwoFactor(verifyData);
      
      this.verifyMessage = 'Two-factor authentication verified successfully!';
      
      setTimeout(() => {
        this.showVerifyDialog = false;
        this.verifyMessage = '';
        this.verifyTwoFactorForm.reset();
      }, 2000);
    } catch (error: any) {
      this.verifyMessage = `Error verifying two-factor authentication: ${error.message}`;
    } finally {
      this.verifyLoading = false;
    }
  }

  async handleDisableTwoFactor(): Promise<void> {
    if (this.disableTwoFactorForm.invalid) {
      this.disableTwoFactorForm.markAllAsTouched();
      return;
    }

    this.disableLoading = true;
    this.disableMessage = '';

    try {
      const disableData: TwoFactorDisableRequest = this.disableTwoFactorForm.value;
      await this.apiService.disableTwoFactor(disableData);
      
      this.disableMessage = 'Two-factor authentication disabled successfully!';
      
      setTimeout(() => {
        this.showDisableDialog = false;
        this.disableMessage = '';
        this.disableTwoFactorForm.reset();
      }, 2000);
    } catch (error: any) {
      this.disableMessage = `Error disabling two-factor authentication: ${error.message}`;
    } finally {
      this.disableLoading = false;
    }
  }

  async handleGetStatus(): Promise<void> {
    if (this.statusForm.invalid) {
      this.statusForm.markAllAsTouched();
      return;
    }

    this.statusLoading = true;
    this.statusMessage = '';

    try {
      const userId = this.statusForm.value.userId;
      const response = await this.apiService.getTwoFactorStatus(userId);
      
      this.twoFactorInfo = response.twoFactorInfo || response;
      this.statusMessage = 'Two-factor authentication status retrieved successfully!';
    } catch (error: any) {
      this.statusMessage = `Error getting two-factor status: ${error.message}`;
      this.twoFactorInfo = null;
    } finally {
      this.statusLoading = false;
    }
  }

  async handleGetRecoveryCodes(): Promise<void> {
    if (this.recoveryCodesForm.invalid) {
      this.recoveryCodesForm.markAllAsTouched();
      return;
    }

    this.recoveryLoading = true;
    this.recoveryMessage = '';

    try {
      const userId = this.recoveryCodesForm.value.userId;
      const response = await this.apiService.getRecoveryCodes(userId);
      
      this.recoveryCodes = response.recoveryCodes || [];
      this.recoveryMessage = 'Recovery codes generated successfully!';
    } catch (error: any) {
      this.recoveryMessage = `Error generating recovery codes: ${error.message}`;
      this.recoveryCodes = [];
    } finally {
      this.recoveryLoading = false;
    }
  }

  async loadQrCode(userId: string): Promise<void> {
    try {
      const response = await this.apiService.getAuthenticatorQrCode(userId);
      this.qrCodeUrl = response.qrCodeUrl;
      this.manualEntryKey = response.manualEntryKey || '';
      this.showQrCodeDialog = true;
    } catch (error: any) {
      console.error('Error loading QR code:', error);
    }
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

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
    // You could show a toast message here
  }

  getMethodIcon(method: string): string {
    const methodConfig = this.twoFactorMethods.find(m => m.value === method);
    return methodConfig?.icon || 'pi pi-circle';
  }

  getMethodLabel(method: string): string {
    const methodConfig = this.twoFactorMethods.find(m => m.value === method);
    return methodConfig?.label || method;
  }

  // Form Reset Methods
  resetSetupForm(): void {
    this.setupTwoFactorForm.reset();
    this.setupMessage = '';
  }

  resetVerifyForm(): void {
    this.verifyTwoFactorForm.reset();
    this.verifyMessage = '';
  }

  resetDisableForm(): void {
    this.disableTwoFactorForm.reset();
    this.disableMessage = '';
  }

  resetStatusForm(): void {
    this.statusForm.reset();
    this.statusMessage = '';
    this.twoFactorInfo = null;
  }

  resetRecoveryForm(): void {
    this.recoveryCodesForm.reset();
    this.recoveryMessage = '';
    this.recoveryCodes = [];
  }

  // Dialog Management
  onSetupDialogHide(): void {
    this.resetSetupForm();
  }

  onVerifyDialogHide(): void {
    this.resetVerifyForm();
  }

  onDisableDialogHide(): void {
    this.resetDisableForm();
  }

  onStatusDialogHide(): void {
    this.statusMessage = '';
  }

  onRecoveryDialogHide(): void {
    this.recoveryMessage = '';
  }

  onQrCodeDialogHide(): void {
    this.qrCodeUrl = '';
    this.manualEntryKey = '';
  }
}