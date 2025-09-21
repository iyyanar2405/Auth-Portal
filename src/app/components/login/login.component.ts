import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { AuthService } from '../../../../libs/shared/src/services/http-auth.service';
import { LoginViewModel } from '../../../../libs/shared/src/models/api-models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    MessageModule,
    MessagesModule
  ],
  template: `
    <div class="login-container">
      <p-card class="login-card">
        <ng-template pTemplate="header">
          <div class="card-header">
            <h2>Authentication Portal</h2>
            <p>Sign in to your account</p>
          </div>
        </ng-template>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="username">Username/Email</label>
            <input
              pInputText
              id="username"
              formControlName="userName"
              placeholder="Enter your username or email"
              class="w-full"
              [class.ng-invalid]="loginForm.get('userName')?.invalid && loginForm.get('userName')?.touched"
            />
            <small
              class="p-error"
              *ngIf="loginForm.get('userName')?.invalid && loginForm.get('userName')?.touched"
            >
              Username is required
            </small>
          </div>

          <div class="field">
            <label for="password">Password</label>
            <p-password
              formControlName="password"
              placeholder="Enter your password"
              [toggleMask]="true"
              [feedback]="false"
              styleClass="w-full"
              inputStyleClass="w-full"
              [class.ng-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            ></p-password>
            <small
              class="p-error"
              *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
              Password is required
            </small>
          </div>

          <div class="field" *ngIf="showDeviceCode">
            <label for="deviceCode">Device Code (Optional)</label>
            <input
              pInputText
              id="deviceCode"
              formControlName="deviceCode"
              placeholder="Enter device code if required"
              class="w-full"
            />
          </div>

          <p-messages *ngIf="errorMessage" severity="error" [value]="[{severity:'error', summary:'Login Failed', detail: errorMessage}]"></p-messages>
          <p-messages *ngIf="successMessage" severity="success" [value]="[{severity:'success', summary:'Success', detail: successMessage}]"></p-messages>

          <div class="login-actions">
            <p-button
              type="submit"
              label="Sign In"
              icon="pi pi-sign-in"
              [loading]="isLoading"
              [disabled]="loginForm.invalid"
              styleClass="w-full"
            ></p-button>
          </div>

          <div class="additional-actions">
            <p-button
              type="button"
              label="Forgot Password?"
              link="true"
              size="small"
              (onClick)="onForgotPassword()"
            ></p-button>
            
            <p-button
              type="button"
              label="Create Account"
              link="true"
              size="small"
              (onClick)="onRegister()"
            ></p-button>
          </div>
        </form>

        <ng-template pTemplate="footer">
          <div class="login-footer">
            <small>
              Demo Credentials: <br>
              <strong>Username:</strong> admin <br>
              <strong>Password:</strong> password123
            </small>
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      overflow: hidden;
    }

    .card-header {
      text-align: center;
      padding: 2rem 2rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: -1rem -1rem 1rem -1rem;
    }

    .card-header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .card-header p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.95rem;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .login-actions {
      margin: 2rem 0 1rem 0;
    }

    .additional-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }

    .login-footer {
      text-align: center;
      padding: 1rem;
      background-color: #f8fafc;
      margin: 1rem -1rem -1rem -1rem;
      border-top: 1px solid #e2e8f0;
    }

    .login-footer small {
      color: #64748b;
      line-height: 1.4;
    }

    .p-error {
      display: block;
      margin-top: 0.25rem;
    }

    :host ::ng-deep {
      .p-password input {
        width: 100%;
      }
      
      .p-button-link {
        color: #667eea;
      }
      
      .p-button-link:hover {
        color: #5a67d8;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showDeviceCode = false;

  constructor() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      deviceCode: ['']
    });

    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const credentials: LoginViewModel = {
        userName: this.loginForm.value.userName,
        password: this.loginForm.value.password,
        deviceCode: this.loginForm.value.deviceCode || null
      };

      this.authService.login(credentials).subscribe({
        next: (user) => {
          this.isLoading = false;
          this.successMessage = `Welcome back, ${user.email}!`;
          
          // Navigate to dashboard after a brief delay to show success message
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
          console.error('Login error:', error);
          
          // Check if error suggests 2FA is required
          if (error.message?.toLowerCase().includes('2fa') || error.message?.toLowerCase().includes('two-factor')) {
            this.showDeviceCode = true;
          }
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  onForgotPassword(): void {
    // For now, just show an alert. This could be expanded to a modal or separate page
    const email = this.loginForm.get('userName')?.value;
    if (email) {
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.successMessage = 'Password reset email sent successfully!';
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to send reset email';
        }
      });
    } else {
      alert('Please enter your email address first');
    }
  }

  onRegister(): void {
    // Navigate to registration page when implemented
    alert('Registration page will be implemented in the next phase');
  }
}