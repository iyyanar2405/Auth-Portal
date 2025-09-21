import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
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
  selector: 'app-authentication-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
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
  templateUrl: './authentication-tab.component.html',
  styleUrls: ['./authentication-tab.component.scss']
})
export class AuthenticationTabComponent implements OnInit {
  private apiService = inject(ApiService);
  private dashboardService = inject(DashboardService);
  private fb = inject(FormBuilder);

  // Dialog visibility flags
  showLoginDialog = false;
  showRegisterDialog = false;
  showForgotPasswordDialog = false;
  showResetPasswordDialog = false;
  showConfirmEmailDialog = false;

  // Forms
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  confirmEmailForm!: FormGroup;

  // Loading states
  isLoading = false;
  loginLoading = false;
  registerLoading = false;
  forgotPasswordLoading = false;
  resetPasswordLoading = false;
  confirmEmailLoading = false;

  // Messages
  loginMessage = '';
  registerMessage = '';
  forgotPasswordMessage = '';
  resetPasswordMessage = '';
  confirmEmailMessage = '';

  // Remember credentials
  rememberCredentials = false;

  constructor() {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadRememberedCredentials();
  }

  get isLoggedIn(): boolean {
    return this.apiService.isLoggedIn();
  }

  get authenticationEndpoints() {
    return this.dashboardService.getEndpointsByCategory('Authentication');
  }

  private initializeForms(): void {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      deviceCode: ['']
    });

    this.registerForm = this.fb.group({
      userName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      code: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.confirmEmailForm = this.fb.group({
      userId: ['', [Validators.required]],
      code: ['', [Validators.required]]
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  private loadRememberedCredentials(): void {
    const rememberedUsername = this.apiService.getCookie('remembered_username');
    if (rememberedUsername) {
      this.loginForm.patchValue({ userName: rememberedUsername });
      this.rememberCredentials = true;
    }
  }

  openAuthenticationUI(type: string): void {
    switch (type) {
      case 'login':
        this.showLoginDialog = true;
        break;
      case 'register':
        this.showRegisterDialog = true;
        break;
      case 'reset':
        this.showForgotPasswordDialog = true;
        break;
      case 'tokens':
        // Implement token management UI
        break;
    }
  }

  async handleLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.loginLoading = true;
    this.loginMessage = '';

    try {
      const credentials = this.loginForm.value;
      const result = await this.apiService.login(credentials);

      if (result.success) {
        this.loginMessage = 'Login successful!';
        
        if (this.rememberCredentials) {
          this.apiService.setCookie('remembered_username', credentials.userName, 30);
        } else {
          this.apiService.deleteCookie('remembered_username');
        }
        
        setTimeout(() => {
          this.showLoginDialog = false;
          this.loginForm.reset();
        }, 2000);
      } else {
        this.loginMessage = result.error || 'Login failed';
      }
    } catch (error: any) {
      this.loginMessage = error.message || 'An error occurred during login';
    } finally {
      this.loginLoading = false;
    }
  }

  async handleRegister(): Promise<void> {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.registerLoading = true;
    this.registerMessage = '';

    try {
      const userData = this.registerForm.value;
      const result = await this.apiService.register(userData);

      if (result.success) {
        this.registerMessage = 'Registration successful! Please check your email for verification.';
        setTimeout(() => {
          this.showRegisterDialog = false;
          this.registerForm.reset();
        }, 3000);
      } else {
        this.registerMessage = result.error || 'Registration failed';
      }
    } catch (error: any) {
      this.registerMessage = error.message || 'An error occurred during registration';
    } finally {
      this.registerLoading = false;
    }
  }

  async handleForgotPassword(): Promise<void> {
    if (this.forgotPasswordForm.invalid) {
      this.markFormGroupTouched(this.forgotPasswordForm);
      return;
    }

    this.forgotPasswordLoading = true;
    this.forgotPasswordMessage = '';

    try {
      const email = this.forgotPasswordForm.value.email;
      const result = await this.apiService.forgotPassword(email);

      if (result.success) {
        this.forgotPasswordMessage = 'Password reset email sent! Check your inbox.';
        setTimeout(() => {
          this.showForgotPasswordDialog = false;
          this.showResetPasswordDialog = true;
          this.forgotPasswordForm.reset();
        }, 3000);
      } else {
        this.forgotPasswordMessage = result.error || 'Failed to send reset email';
      }
    } catch (error: any) {
      this.forgotPasswordMessage = error.message || 'An error occurred';
    } finally {
      this.forgotPasswordLoading = false;
    }
  }

  async handleResetPassword(): Promise<void> {
    if (this.resetPasswordForm.invalid) {
      this.markFormGroupTouched(this.resetPasswordForm);
      return;
    }

    this.resetPasswordLoading = true;
    this.resetPasswordMessage = '';

    try {
      const resetData = this.resetPasswordForm.value;
      const result = await this.apiService.resetPassword(resetData);

      if (result.success) {
        this.resetPasswordMessage = 'Password reset successful! You can now login with your new password.';
        setTimeout(() => {
          this.showResetPasswordDialog = false;
          this.resetPasswordForm.reset();
        }, 3000);
      } else {
        this.resetPasswordMessage = result.error || 'Password reset failed';
      }
    } catch (error: any) {
      this.resetPasswordMessage = error.message || 'An error occurred';
    } finally {
      this.resetPasswordLoading = false;
    }
  }

  async handleConfirmEmail(): Promise<void> {
    if (this.confirmEmailForm.invalid) {
      this.markFormGroupTouched(this.confirmEmailForm);
      return;
    }

    this.confirmEmailLoading = true;
    this.confirmEmailMessage = '';

    try {
      const confirmData = this.confirmEmailForm.value;
      const result = await this.apiService.confirmEmail(confirmData);

      if (result.success) {
        this.confirmEmailMessage = 'Email confirmed successfully!';
        setTimeout(() => {
          this.showConfirmEmailDialog = false;
          this.confirmEmailForm.reset();
        }, 3000);
      } else {
        this.confirmEmailMessage = result.error || 'Email confirmation failed';
      }
    } catch (error: any) {
      this.confirmEmailMessage = error.message || 'An error occurred';
    } finally {
      this.confirmEmailLoading = false;
    }
  }

  async logout(): Promise<void> {
    this.isLoading = true;
    try {
      await this.apiService.logout();
    } finally {
      this.isLoading = false;
    }
  }

  openEndpointTester(endpoint: string, method: string): void {
    this.dashboardService.openEndpointTester(endpoint, method);
  }

  copyCurlCommand(endpoint: any): void {
    this.apiService.copyCurlCommand(endpoint);
  }

  viewEndpointSchema(endpoint: any): void {
    // Implement schema viewer
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