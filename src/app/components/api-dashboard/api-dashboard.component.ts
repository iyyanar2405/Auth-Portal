import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { API_ENDPOINTS_INFO, API_CATEGORIES, ApiEndpointInfo } from '../../../../libs/shared/src/models/api-models';

interface EndpointTestResult {
  success: boolean;
  status: number;
  data?: any;
  error?: string;
  timestamp: Date;
}

interface TestPayload {
  endpoint: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
}

@Component({
  selector: 'app-api-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    TabViewModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    BadgeModule,
    ChipModule,
    AccordionModule,
    DialogModule,
    InputTextareaModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
    TooltipModule,
    PanelModule,
    DividerModule,
    CheckboxModule
  ],
  template: `
    <div class="api-dashboard-container">
      <div class="dashboard-header">
        <h1>
          <i class="pi pi-code"></i>
          API Endpoints Dashboard
        </h1>
        <p>Comprehensive overview and testing interface for all available API endpoints</p>
        
        <div class="dashboard-stats">
          <div class="stat-card">
            <h3>{{ getTotalEndpointsCount() }}</h3>
            <p>Total Endpoints</p>
          </div>
          <div class="stat-card">
            <h3>{{ getCategoriesCount() }}</h3>
            <p>Categories</p>
          </div>
          <div class="stat-card">
            <h3>{{ getAuthRequiredCount() }}</h3>
            <p>Require Auth</p>
          </div>
          <div class="stat-card">
            <h3>{{ getMethodCount('POST') }}</h3>
            <p>POST Endpoints</p>
          </div>
        </div>
      </div>

      <p-tabView>
        <!-- Overview Tab -->
        <p-tabPanel header="Overview" leftIcon="pi pi-chart-line">
          <div class="overview-content">
            <div class="endpoints-by-category">
              <h3>Endpoints by Category</h3>
              <div class="category-grid">
                <p-card 
                  *ngFor="let category of getCategories()" 
                  class="category-card"
                  [header]="category.name"
                >
                  <div class="category-info">
                    <p-badge 
                      [value]="category.count.toString()" 
                      severity="info"
                    ></p-badge>
                    <span class="category-description">{{ category.description }}</span>
                  </div>
                  <div class="category-methods">
                    <p-chip 
                      *ngFor="let method of category.methods" 
                      [label]="method"
                      [class]="'method-' + method.toLowerCase()"
                    ></p-chip>
                  </div>
                </p-card>
              </div>
            </div>

            <p-divider></p-divider>

            <div class="recent-activity">
              <h3>Quick Actions</h3>
              <div class="quick-actions">
                <p-button 
                  label="Test Authentication" 
                  icon="pi pi-shield" 
                  (onClick)="openEndpointTester('/api/Authorize/token', 'POST')"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Get Users" 
                  icon="pi pi-users" 
                  (onClick)="openEndpointTester('/api/User', 'GET')"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Get Roles" 
                  icon="pi pi-key" 
                  (onClick)="openEndpointTester('/api/Role', 'GET')"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Current User Info" 
                  icon="pi pi-user" 
                  (onClick)="openEndpointTester('/api/manage/userInfo', 'GET')"
                  class="p-button-outlined"
                ></p-button>
              </div>
            </div>
          </div>
        </p-tabPanel>

        <!-- Endpoints by Category Tabs -->
        <p-tabPanel 
          *ngFor="let category of getUniqueCategories()" 
          [header]="category"
          [leftIcon]="getCategoryIcon(category)"
        >
          <!-- Special handling for Authentication with dual options -->
          <div *ngIf="category === 'Authentication'; else checkUserManagement" class="authentication-container">
            <div class="category-header">
              <h3>{{ category }}</h3>
              <p>{{ getCategoryDescription(category) }}</p>
            </div>

            <p-tabView class="nested-tabs">
              <!-- UI Option -->
              <p-tabPanel header="UI Interface" leftIcon="pi pi-desktop">
                <div class="auth-ui-interface">
                  <p-card header="Authentication Interface">
                    <div class="ui-description">
                      <p><i class="pi pi-info-circle"></i> A user-friendly interface for authentication operations with forms and visual components.</p>
                    </div>
                    
                    <div class="ui-features">
                      <h4>Available Features:</h4>
                      <div class="feature-grid">
                        <div class="feature-card">
                          <i class="pi pi-sign-in"></i>
                          <h5>User Login</h5>
                          <p>Secure login with email and password</p>
                          <p-button 
                            *ngIf="!isLoggedIn()" 
                            label="Login Form" 
                            icon="pi pi-external-link" 
                            class="p-button-outlined" 
                            size="small" 
                            (onClick)="openAuthenticationUI('login')"
                          ></p-button>
                          <div *ngIf="isLoggedIn()" class="logged-in-status">
                            <span class="login-status">✅ Logged In</span>
                            <p-button 
                              label="Logout" 
                              icon="pi pi-sign-out" 
                              class="p-button-danger" 
                              size="small" 
                              (onClick)="logout()"
                            ></p-button>
                          </div>
                        </div>
                        <div class="feature-card">
                          <i class="pi pi-user-plus"></i>
                          <h5>User Registration</h5>
                          <p>Register new user accounts</p>
                          <p-button label="Register" icon="pi pi-plus" class="p-button-outlined" size="small" (onClick)="openAuthenticationUI('register')"></p-button>
                        </div>
                        <div class="feature-card">
                          <i class="pi pi-key"></i>
                          <h5>Password Reset</h5>
                          <p>Reset forgotten passwords</p>
                          <p-button label="Reset Password" icon="pi pi-refresh" class="p-button-outlined" size="small" (onClick)="openAuthenticationUI('reset')"></p-button>
                        </div>
                        <div class="feature-card">
                          <i class="pi pi-shield"></i>
                          <h5>Token Management</h5>
                          <p>Manage authentication tokens</p>
                          <p-button label="Token Manager" icon="pi pi-cog" class="p-button-outlined" size="small" (onClick)="openAuthenticationUI('tokens')"></p-button>
                        </div>
                      </div>
                    </div>

                    <p-divider></p-divider>

                    <div class="recent-activity">
              <h3>Quick Actions</h3>
              <div class="quick-actions">
                <p-button 
                  label="Confirm Email" 
                  icon="pi pi-envelope" 
                  (onClick)="handleConfirmEmail()"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Refresh Token" 
                  icon="pi pi-refresh" 
                  (onClick)="handleRefreshToken()"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Login" 
                  icon="pi pi-sign-in" 
                  (onClick)="handleLogin()"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Logout" 
                  icon="pi pi-sign-out" 
                  (onClick)="handleLogout()"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Is Authenticated" 
                  icon="pi pi-check-circle" 
                  (onClick)="handleIsAuthenticated()"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Forgot Password" 
                  icon="pi pi-question-circle" 
                  (onClick)="handleForgotPassword()"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Resend Verification" 
                  icon="pi pi-send" 
                  (onClick)="handleResendVerificationEmail()"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Set TFA" 
                  icon="pi pi-shield" 
                  (onClick)="handleSetTfa()"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Set Password" 
                  icon="pi pi-key" 
                  (onClick)="handleSetPassword()"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Send TFA SMS" 
                  icon="pi pi-mobile" 
                  (onClick)="handleSendTfaSMS()"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Verify TFA Code" 
                  icon="pi pi-verified" 
                  (onClick)="handleVerifyTFACode()"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="QR Code" 
                  icon="pi pi-qrcode" 
                  (onClick)="handleQRCode()"
                  class="p-button-outlined"
                ></p-button>
              </div>
            </div>
                  </p-card>
                </div>
              </p-tabPanel>

              <!-- API Option -->
              <p-tabPanel header="API Endpoints" leftIcon="pi pi-code">
                <div class="api-endpoints-interface">
                  <p-card header="Authentication API Endpoints">
                    <div class="api-description">
                      <p><i class="pi pi-info-circle"></i> Direct access to Authentication API endpoints for testing and integration.</p>
                    </div>

                    <p-accordion>
                      <p-accordionTab 
                        *ngFor="let endpoint of getEndpointsByCategory(category)"
                        [header]="getAccordionHeader(endpoint)"
                      >
                        <div class="endpoint-details">
                          <div class="endpoint-info">
                            <div class="endpoint-meta">
                              <p-chip 
                                [label]="endpoint.method" 
                                [class]="'method-' + endpoint.method.toLowerCase()"
                              ></p-chip>
                              <span class="endpoint-path">{{ endpoint.endpoint }}</span>
                              <p-badge 
                                *ngIf="endpoint.requiresAuth" 
                                value="AUTH" 
                                severity="warning"
                              ></p-badge>
                            </div>
                            <p class="endpoint-summary">{{ endpoint.summary }}</p>
                            
                            <div class="endpoint-parameters" *ngIf="endpoint.parameters && endpoint.parameters.length > 0">
                              <h5>Parameters:</h5>
                              <div class="parameters-list">
                                <p-chip 
                                  *ngFor="let param of endpoint.parameters" 
                                  [label]="param"
                                  class="parameter-chip"
                                ></p-chip>
                              </div>
                            </div>

                            <div class="endpoint-actions">
                              <p-button 
                                label="Test Endpoint" 
                                icon="pi pi-play" 
                                size="small"
                                (onClick)="openEndpointTester(endpoint.endpoint, endpoint.method)"
                              ></p-button>
                              <p-button 
                                label="Copy cURL" 
                                icon="pi pi-copy" 
                                size="small"
                                class="p-button-outlined"
                                (onClick)="copyCurlCommand(endpoint)"
                              ></p-button>
                              <p-button 
                                label="View Schema" 
                                icon="pi pi-eye" 
                                size="small"
                                class="p-button-info"
                                (onClick)="viewEndpointSchema(endpoint)"
                              ></p-button>
                            </div>
                          </div>
                        </div>
                      </p-accordionTab>
                    </p-accordion>
                  </p-card>
                </div>
              </p-tabPanel>
            </p-tabView>
          </div>

          <!-- Special handling for User Management with dual options -->
          <ng-template #checkUserManagement>
            <div *ngIf="category === 'User Management'; else checkRoleManagement" class="user-management-container">
              <div class="category-header">
                <h3>{{ category }}</h3>
                <p>{{ getCategoryDescription(category) }}</p>
              </div>

              <p-tabView class="nested-tabs">
                <!-- UI Option -->
                <p-tabPanel header="UI Interface" leftIcon="pi pi-desktop">
                  <div class="user-ui-interface">
                    <p-card header="User Management Interface">
                      <div class="ui-description">
                        <p><i class="pi pi-info-circle"></i> A user-friendly interface for managing users with forms, tables, and visual components.</p>
                      </div>
                      
                      <div class="ui-features">
                        <h4>Available Features:</h4>
                        <div class="feature-grid">
                          <div class="feature-card">
                            <i class="pi pi-users"></i>
                            <h5>User List</h5>
                            <p>View and search users with pagination</p>
                            <p-button label="Open User List" icon="pi pi-external-link" class="p-button-outlined" size="small"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-user-plus"></i>
                            <h5>Create User</h5>
                            <p>Add new users with form validation</p>
                            <p-button label="Create User" icon="pi pi-plus" class="p-button-outlined" size="small"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-user-edit"></i>
                            <h5>Edit User</h5>
                            <p>Update user information and roles</p>
                            <p-button label="Edit Users" icon="pi pi-pencil" class="p-button-outlined" size="small"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-lock"></i>
                            <h5>User Permissions</h5>
                            <p>Manage user roles and permissions</p>
                            <p-button label="Manage Permissions" icon="pi pi-key" class="p-button-outlined" size="small"></p-button>
                          </div>
                        </div>
                      </div>

                      <p-divider></p-divider>

                      <div class="quick-user-actions">
                        <h4>Quick Actions:</h4>
                        <div class="actions-row">
                          <p-button label="View All Users" icon="pi pi-list" (onClick)="openUserManagementUI('list')"></p-button>
                          <p-button label="Add New User" icon="pi pi-plus" class="p-button-success" (onClick)="openUserManagementUI('create')"></p-button>
                          <p-button label="User Reports" icon="pi pi-chart-bar" class="p-button-info" (onClick)="openUserManagementUI('reports')"></p-button>
                          <p-button label="Import Users" icon="pi pi-upload" class="p-button-warning" (onClick)="openUserManagementUI('import')"></p-button>
                        </div>
                      </div>
                    </p-card>
                  </div>
                </p-tabPanel>

                <!-- API Option -->
                <p-tabPanel header="API Endpoints" leftIcon="pi pi-code">
                  <div class="api-endpoints-interface">
                    <p-card header="User Management API Endpoints">
                      <div class="api-description">
                        <p><i class="pi pi-info-circle"></i> Direct access to User Management API endpoints for testing and integration.</p>
                      </div>

                      <p-accordion>
                        <p-accordionTab 
                          *ngFor="let endpoint of getEndpointsByCategory(category)"
                          [header]="getAccordionHeader(endpoint)"
                        >
                          <div class="endpoint-details">
                            <div class="endpoint-info">
                              <div class="endpoint-meta">
                                <p-chip 
                                  [label]="endpoint.method" 
                                  [class]="'method-' + endpoint.method.toLowerCase()"
                                ></p-chip>
                                <span class="endpoint-path">{{ endpoint.endpoint }}</span>
                                <p-badge 
                                  *ngIf="endpoint.requiresAuth" 
                                  value="AUTH" 
                                  severity="warning"
                                ></p-badge>
                              </div>
                              <p class="endpoint-summary">{{ endpoint.summary }}</p>
                              
                              <div class="endpoint-parameters" *ngIf="endpoint.parameters && endpoint.parameters.length > 0">
                                <h5>Parameters:</h5>
                                <div class="parameters-list">
                                  <p-chip 
                                    *ngFor="let param of endpoint.parameters" 
                                    [label]="param"
                                    class="parameter-chip"
                                  ></p-chip>
                                </div>
                              </div>

                              <div class="endpoint-actions">
                                <p-button 
                                  label="Test Endpoint" 
                                  icon="pi pi-play" 
                                  size="small"
                                  (onClick)="openEndpointTester(endpoint.endpoint, endpoint.method)"
                                ></p-button>
                                <p-button 
                                  label="Copy cURL" 
                                  icon="pi pi-copy" 
                                  size="small"
                                  class="p-button-outlined"
                                  (onClick)="copyCurlCommand(endpoint)"
                                ></p-button>
                                <p-button 
                                  label="View Schema" 
                                  icon="pi pi-eye" 
                                  size="small"
                                  class="p-button-info"
                                  (onClick)="viewEndpointSchema(endpoint)"
                                ></p-button>
                              </div>
                            </div>
                          </div>
                        </p-accordionTab>
                      </p-accordion>
                    </p-card>
                  </div>
                </p-tabPanel>
              </p-tabView>
            </div>
          </ng-template>

          <!-- Special handling for Role Management with dual options -->
          <ng-template #checkRoleManagement>
               <div *ngIf="category === 'Role Management'; else checkClaimsManagement" class="role-management-container">
              <div class="category-header">
                <h3>{{ category }}</h3>
                <p>{{ getCategoryDescription(category) }}</p>
              </div>

              <p-tabView class="nested-tabs">
                <!-- UI Option -->
                <p-tabPanel header="UI Interface" leftIcon="pi pi-desktop">
                  <div class="role-ui-interface">
                    <p-card header="Role Management Interface">
                      <div class="ui-description">
                        <p><i class="pi pi-info-circle"></i> A user-friendly interface for managing roles and permissions with forms, tables, and visual components.</p>
                      </div>
                      
                      <div class="ui-features">
                        <h4>Available Features:</h4>
                        <div class="feature-grid">
                          <div class="feature-card">
                            <i class="pi pi-key"></i>
                            <h5>Role List</h5>
                            <p>View and search roles with pagination</p>
                            <p-button label="Open Role List" icon="pi pi-external-link" class="p-button-outlined" size="small" (onClick)="openRoleManagementUI('list')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-plus-circle"></i>
                            <h5>Create Role</h5>
                            <p>Add new roles with permission settings</p>
                            <p-button label="Create Role" icon="pi pi-plus" class="p-button-outlined" size="small" (onClick)="openRoleManagementUI('create')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-cog"></i>
                            <h5>Edit Role</h5>
                            <p>Update role information and permissions</p>
                            <p-button label="Edit Roles" icon="pi pi-pencil" class="p-button-outlined" size="small" (onClick)="openRoleManagementUI('edit')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-users"></i>
                            <h5>Role Assignments</h5>
                            <p>Assign roles to users and manage relationships</p>
                            <p-button label="Manage Assignments" icon="pi pi-link" class="p-button-outlined" size="small" (onClick)="openRoleManagementUI('assignments')"></p-button>
                          </div>
                        </div>
                      </div>

                      <p-divider></p-divider>

                      <div class="quick-role-actions">
                        <h4>Quick Actions:</h4>
                        <div class="actions-row">
                          <p-button label="View All Roles" icon="pi pi-list" (onClick)="openRoleManagementUI('list')"></p-button>
                          <p-button label="Add New Role" icon="pi pi-plus" class="p-button-success" (onClick)="openRoleManagementUI('create')"></p-button>
                          <p-button label="Role Statistics" icon="pi pi-chart-bar" class="p-button-info" (onClick)="openRoleManagementUI('stats')"></p-button>
                          <p-button label="Export Roles" icon="pi pi-download" class="p-button-warning" (onClick)="openRoleManagementUI('export')"></p-button>
                        </div>
                      </div>
                    </p-card>
                  </div>
                </p-tabPanel>

                <!-- API Option -->
                <p-tabPanel header="API Endpoints" leftIcon="pi pi-code">
                  <div class="api-endpoints-interface">
                    <p-card header="Role Management API Endpoints">
                      <div class="api-description">
                        <p><i class="pi pi-info-circle"></i> Direct access to Role Management API endpoints for testing and integration.</p>
                      </div>

                      <p-accordion>
                        <p-accordionTab 
                          *ngFor="let endpoint of getEndpointsByCategory(category)"
                          [header]="getAccordionHeader(endpoint)"
                        >
                          <div class="endpoint-details">
                            <div class="endpoint-info">
                              <div class="endpoint-meta">
                                <p-chip 
                                  [label]="endpoint.method" 
                                  [class]="'method-' + endpoint.method.toLowerCase()"
                                ></p-chip>
                                <span class="endpoint-path">{{ endpoint.endpoint }}</span>
                                <p-badge 
                                  *ngIf="endpoint.requiresAuth" 
                                  value="AUTH" 
                                  severity="warning"
                                ></p-badge>
                              </div>
                              <p class="endpoint-summary">{{ endpoint.summary }}</p>
                              
                              <div class="endpoint-parameters" *ngIf="endpoint.parameters && endpoint.parameters.length > 0">
                                <h5>Parameters:</h5>
                                <div class="parameters-list">
                                  <p-chip 
                                    *ngFor="let param of endpoint.parameters" 
                                    [label]="param"
                                    class="parameter-chip"
                                  ></p-chip>
                                </div>
                              </div>

                              <div class="endpoint-actions">
                                <p-button 
                                  label="Test Endpoint" 
                                  icon="pi pi-play" 
                                  size="small"
                                  (onClick)="openEndpointTester(endpoint.endpoint, endpoint.method)"
                                ></p-button>
                                <p-button 
                                  label="Copy cURL" 
                                  icon="pi pi-copy" 
                                  size="small"
                                  class="p-button-outlined"
                                  (onClick)="copyCurlCommand(endpoint)"
                                ></p-button>
                                <p-button 
                                  label="View Schema" 
                                  icon="pi pi-eye" 
                                  size="small"
                                  class="p-button-info"
                                  (onClick)="viewEndpointSchema(endpoint)"
                                ></p-button>
                              </div>
                            </div>
                          </div>
                        </p-accordionTab>
                      </p-accordion>
                    </p-card>
                  </div>
                </p-tabPanel>
              </p-tabView>
            </div>
          </ng-template>

          <!-- Special handling for Claims Management with dual options -->
          <ng-template #checkClaimsManagement>
            <div *ngIf="category === 'Claims Management'; else checkUserRoleManagement" class="claims-management-container">
              <div class="category-header">
                <h3>{{ category }}</h3>
                <p>{{ getCategoryDescription(category) }}</p>
              </div>

              <p-tabView class="nested-tabs">
                <!-- UI Option -->
                <p-tabPanel header="UI Interface" leftIcon="pi pi-desktop">
                  <div class="claims-ui-interface">
                    <p-card header="Claims Management Interface">
                      <div class="ui-description">
                        <p><i class="pi pi-info-circle"></i> A comprehensive interface for managing user claims, permissions, and access tokens.</p>
                      </div>
                      
                      <div class="ui-features">
                        <h4>Available Features:</h4>
                        <div class="feature-grid">
                          <div class="feature-card">
                            <i class="pi pi-list"></i>
                            <h5>Claims List</h5>
                            <p>View and search all user claims with filtering</p>
                            <p-button label="Open Claims List" icon="pi pi-external-link" class="p-button-outlined" size="small"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-plus-circle"></i>
                            <h5>Create Claim</h5>
                            <p>Add new claims with validation rules</p>
                            <p-button label="Create Claim" icon="pi pi-plus" class="p-button-outlined" size="small"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-pencil"></i>
                            <h5>Edit Claim</h5>
                            <p>Modify existing claim values and properties</p>
                            <p-button label="Edit Claims" icon="pi pi-pencil" class="p-button-outlined" size="small"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-verified"></i>
                            <h5>Claim Validation</h5>
                            <p>Validate and verify claim authenticity</p>
                            <p-button label="Validate Claims" icon="pi pi-check-circle" class="p-button-outlined" size="small"></p-button>
                          </div>
                        </div>
                      </div>

                      <p-divider></p-divider>

                      <div class="quick-claims-actions">
                        <h4>Quick Actions:</h4>
                        <div class="actions-row">
                          <p-button label="View All Claims" icon="pi pi-list" (onClick)="openClaimsManagementUI('list')"></p-button>
                          <p-button label="Add New Claim" icon="pi pi-plus" class="p-button-success" (onClick)="openClaimsManagementUI('create')"></p-button>
                          <p-button label="Claims Reports" icon="pi pi-chart-bar" class="p-button-info" (onClick)="openClaimsManagementUI('reports')"></p-button>
                          <p-button label="Validate Claims" icon="pi pi-shield" class="p-button-warning" (onClick)="openClaimsManagementUI('validate')"></p-button>
                        </div>
                      </div>
                    </p-card>
                  </div>
                </p-tabPanel>

                <!-- API Endpoints Option -->
                <p-tabPanel header="API Endpoints" leftIcon="pi pi-code">
                  <div class="api-endpoints-interface">
                    <p-card header="Claims Management API Endpoints">
                      <div class="api-description">
                        <p><i class="pi pi-info-circle"></i> Complete list of API endpoints for claims management operations.</p>
                      </div>

                      <p-accordion>
                        <p-accordionTab 
                          *ngFor="let endpoint of getEndpointsByCategory(category)"
                          [header]="getAccordionHeader(endpoint)"
                        >
                          <div class="endpoint-details">
                            <div class="endpoint-info">
                              <div class="endpoint-meta">
                                <p-chip 
                                  [label]="endpoint.method" 
                                  [class]="'method-' + endpoint.method.toLowerCase()"
                                ></p-chip>
                                <span class="endpoint-path">{{ endpoint.endpoint }}</span>
                                <p-badge 
                                  *ngIf="endpoint.requiresAuth" 
                                  value="AUTH" 
                                  severity="warning"
                                ></p-badge>
                              </div>
                              <p class="endpoint-summary">{{ endpoint.summary }}</p>
                              
                              <div class="endpoint-parameters" *ngIf="endpoint.parameters && endpoint.parameters.length > 0">
                                <h5>Parameters:</h5>
                                <div class="parameters-list">
                                  <p-chip 
                                    *ngFor="let param of endpoint.parameters" 
                                    [label]="param"
                                    class="parameter-chip"
                                  ></p-chip>
                                </div>
                              </div>

                              <div class="endpoint-actions">
                                <p-button 
                                  label="Test Endpoint" 
                                  icon="pi pi-play" 
                                  size="small"
                                  (onClick)="openEndpointTester(endpoint.endpoint, endpoint.method)"
                                ></p-button>
                                <p-button 
                                  label="Copy cURL" 
                                  icon="pi pi-copy" 
                                  size="small"
                                  class="p-button-outlined"
                                  (onClick)="copyCurlCommand(endpoint)"
                                ></p-button>
                                <p-button 
                                  label="View Schema" 
                                  icon="pi pi-eye" 
                                  size="small"
                                  class="p-button-info"
                                  (onClick)="viewEndpointSchema(endpoint)"
                                ></p-button>
                              </div>
                            </div>
                          </div>
                        </p-accordionTab>
                      </p-accordion>
                    </p-card>
                  </div>
                </p-tabPanel>
              </p-tabView>
            </div>
          </ng-template>

          <!-- Special handling for User Role Management with dual options -->
          <ng-template #checkUserRoleManagement>
            <div *ngIf="category === 'User Role Management'; else checkAccountManagement" class="user-role-management-container">
              <div class="category-header">
                <h3>{{ category }}</h3>
                <p>{{ getCategoryDescription(category) }}</p>
              </div>

              <p-tabView class="nested-tabs">
                <!-- UI Option -->
                <p-tabPanel header="UI Interface" leftIcon="pi pi-desktop">
                  <div class="user-role-ui-interface">
                    <p-card header="User Role Management Interface">
                      <div class="ui-description">
                        <p><i class="pi pi-info-circle"></i> A comprehensive interface for managing user-role assignments and relationships.</p>
                      </div>
                      
                      <div class="ui-features">
                        <h4>Available Features:</h4>
                        <div class="feature-grid">
                          <div class="feature-card">
                            <i class="pi pi-users"></i>
                            <h5>User Roles</h5>
                            <p>View and manage roles assigned to users</p>
                            <p-button label="Manage User Roles" icon="pi pi-external-link" class="p-button-outlined" size="small" (onClick)="openUserRoleManagementUI('user-roles')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-link"></i>
                            <h5>Assign Roles</h5>
                            <p>Assign or remove roles from users</p>
                            <p-button label="Assign Roles" icon="pi pi-plus" class="p-button-outlined" size="small" (onClick)="openUserRoleManagementUI('assign')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-eye"></i>
                            <h5>Role Overview</h5>
                            <p>View role assignments and user permissions</p>
                            <p-button label="View Assignments" icon="pi pi-search" class="p-button-outlined" size="small" (onClick)="openUserRoleManagementUI('overview')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-chart-bar"></i>
                            <h5>Analytics</h5>
                            <p>Analyze role distribution and usage statistics</p>
                            <p-button label="View Analytics" icon="pi pi-chart-line" class="p-button-outlined" size="small" (onClick)="openUserRoleManagementUI('analytics')"></p-button>
                          </div>
                        </div>
                      </div>

                      <p-divider></p-divider>

                      <div class="quick-user-role-actions">
                        <h4>Quick Actions:</h4>
                        <div class="actions-row">
                          <p-button label="View User Roles" icon="pi pi-list" (onClick)="openUserRoleManagementUI('list')"></p-button>
                          <p-button label="Assign Role" icon="pi pi-plus" class="p-button-success" (onClick)="openUserRoleManagementUI('assign')"></p-button>
                          <p-button label="Role Reports" icon="pi pi-chart-bar" class="p-button-info" (onClick)="openUserRoleManagementUI('reports')"></p-button>
                          <p-button label="Bulk Operations" icon="pi pi-cog" class="p-button-warning" (onClick)="openUserRoleManagementUI('bulk')"></p-button>
                        </div>
                      </div>
                    </p-card>
                  </div>
                </p-tabPanel>

                <!-- API Option -->
                <p-tabPanel header="API Endpoints" leftIcon="pi pi-code">
                  <div class="api-endpoints-interface">
                    <p-card header="User Role Management API Endpoints">
                      <div class="api-description">
                        <p><i class="pi pi-info-circle"></i> Direct access to User Role Management API endpoints for testing and integration.</p>
                      </div>

                      <p-accordion>
                        <p-accordionTab 
                          *ngFor="let endpoint of getEndpointsByCategory(category)"
                          [header]="getAccordionHeader(endpoint)"
                        >
                          <div class="endpoint-details">
                            <div class="endpoint-info">
                              <div class="endpoint-meta">
                                <p-chip 
                                  [label]="endpoint.method" 
                                  [class]="'method-' + endpoint.method.toLowerCase()"
                                ></p-chip>
                                <span class="endpoint-path">{{ endpoint.endpoint }}</span>
                                <p-badge 
                                  *ngIf="endpoint.requiresAuth" 
                                  value="AUTH" 
                                  severity="warning"
                                ></p-badge>
                              </div>
                              <p class="endpoint-summary">{{ endpoint.summary }}</p>
                              
                              <div class="endpoint-parameters" *ngIf="endpoint.parameters && endpoint.parameters.length > 0">
                                <h5>Parameters:</h5>
                                <div class="parameters-list">
                                  <p-chip 
                                    *ngFor="let param of endpoint.parameters" 
                                    [label]="param"
                                    class="parameter-chip"
                                  ></p-chip>
                                </div>
                              </div>

                              <div class="endpoint-actions">
                                <p-button 
                                  label="Test Endpoint" 
                                  icon="pi pi-play" 
                                  size="small"
                                  (onClick)="openEndpointTester(endpoint.endpoint, endpoint.method)"
                                ></p-button>
                                <p-button 
                                  label="Copy cURL" 
                                  icon="pi pi-copy" 
                                  size="small"
                                  class="p-button-outlined"
                                  (onClick)="copyCurlCommand(endpoint)"
                                ></p-button>
                                <p-button 
                                  label="View Schema" 
                                  icon="pi pi-eye" 
                                  size="small"
                                  class="p-button-info"
                                  (onClick)="viewEndpointSchema(endpoint)"
                                ></p-button>
                              </div>
                            </div>
                          </div>
                        </p-accordionTab>
                      </p-accordion>
                    </p-card>
                  </div>
                </p-tabPanel>
              </p-tabView>
            </div>
          </ng-template>

          <!-- Special handling for Account Management with dual options -->
          <ng-template #checkAccountManagement>
            <div *ngIf="category === 'Account Management'; else checkTwoFactorAuthentication" class="account-management-container">
              <div class="category-header">
                <h3>{{ category }}</h3>
                <p>{{ getCategoryDescription(category) }}</p>
              </div>

              <p-tabView class="nested-tabs">
                <!-- UI Option -->
                <p-tabPanel header="UI Interface" leftIcon="pi pi-desktop">
                  <div class="account-ui-interface">
                    <p-card header="Account Management Interface">
                      <div class="ui-description">
                        <p><i class="pi pi-info-circle"></i> A comprehensive interface for managing user accounts, profiles, and personal settings.</p>
                      </div>
                      
                      <div class="ui-features">
                        <h4>Available Features:</h4>
                        <div class="feature-grid">
                          <div class="feature-card">
                            <i class="pi pi-user"></i>
                            <h5>Profile Management</h5>
                            <p>View and edit user profile information</p>
                            <p-button label="Manage Profile" icon="pi pi-external-link" class="p-button-outlined" size="small" (onClick)="openAccountManagementUI('profile')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-lock"></i>
                            <h5>Password Management</h5>
                            <p>Change password and security settings</p>
                            <p-button label="Change Password" icon="pi pi-key" class="p-button-outlined" size="small" (onClick)="openAccountManagementUI('password')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-envelope"></i>
                            <h5>Email Verification</h5>
                            <p>Manage email verification and notifications</p>
                            <p-button label="Email Settings" icon="pi pi-send" class="p-button-outlined" size="small" (onClick)="openAccountManagementUI('email')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-cog"></i>
                            <h5>Account Settings</h5>
                            <p>Configure account preferences and security</p>
                            <p-button label="Account Settings" icon="pi pi-sliders-h" class="p-button-outlined" size="small" (onClick)="openAccountManagementUI('settings')"></p-button>
                          </div>
                        </div>
                      </div>

                      <p-divider></p-divider>

                      <div class="quick-account-actions">
                        <h4>Quick Actions:</h4>
                        <div class="actions-row">
                          <p-button label="View Profile" icon="pi pi-user" (onClick)="openAccountManagementUI('view-profile')"></p-button>
                          <p-button label="Change Password" icon="pi pi-lock" class="p-button-success" (onClick)="openAccountManagementUI('change-password')"></p-button>
                          <p-button label="Verify Email" icon="pi pi-envelope" class="p-button-info" (onClick)="openAccountManagementUI('verify-email')"></p-button>
                          <p-button label="Security Settings" icon="pi pi-shield" class="p-button-warning" (onClick)="openAccountManagementUI('security')"></p-button>
                        </div>
                      </div>
                    </p-card>
                  </div>
                </p-tabPanel>

                <!-- API Option -->
                <p-tabPanel header="API Endpoints" leftIcon="pi pi-code">
                  <div class="api-endpoints-interface">
                    <p-card header="Account Management API Endpoints">
                      <div class="api-description">
                        <p><i class="pi pi-info-circle"></i> Direct access to Account Management API endpoints for testing and integration.</p>
                      </div>

                      <p-accordion>
                        <p-accordionTab 
                          *ngFor="let endpoint of getEndpointsByCategory(category)"
                          [header]="getAccordionHeader(endpoint)"
                        >
                          <div class="endpoint-details">
                            <div class="endpoint-info">
                              <div class="endpoint-meta">
                                <p-chip 
                                  [label]="endpoint.method" 
                                  [class]="'method-' + endpoint.method.toLowerCase()"
                                ></p-chip>
                                <span class="endpoint-path">{{ endpoint.endpoint }}</span>
                                <p-badge 
                                  *ngIf="endpoint.requiresAuth" 
                                  value="AUTH" 
                                  severity="warning"
                                ></p-badge>
                              </div>
                              <p class="endpoint-summary">{{ endpoint.summary }}</p>
                              
                              <div class="endpoint-parameters" *ngIf="endpoint.parameters && endpoint.parameters.length > 0">
                                <h5>Parameters:</h5>
                                <div class="parameters-list">
                                  <p-chip 
                                    *ngFor="let param of endpoint.parameters" 
                                    [label]="param"
                                    class="parameter-chip"
                                  ></p-chip>
                                </div>
                              </div>

                              <div class="endpoint-actions">
                                <p-button 
                                  label="Test Endpoint" 
                                  icon="pi pi-play" 
                                  size="small"
                                  (onClick)="openEndpointTester(endpoint.endpoint, endpoint.method)"
                                ></p-button>
                                <p-button 
                                  label="Copy cURL" 
                                  icon="pi pi-copy" 
                                  size="small"
                                  class="p-button-outlined"
                                  (onClick)="copyCurlCommand(endpoint)"
                                ></p-button>
                                <p-button 
                                  label="View Schema" 
                                  icon="pi pi-eye" 
                                  size="small"
                                  class="p-button-info"
                                  (onClick)="viewEndpointSchema(endpoint)"
                                ></p-button>
                              </div>
                            </div>
                          </div>
                        </p-accordionTab>
                      </p-accordion>
                    </p-card>
                  </div>
                </p-tabPanel>
              </p-tabView>
            </div>
          </ng-template>

          <!-- Two-Factor Authentication Template -->
          <ng-template #checkTwoFactorAuthentication>
            <div *ngIf="category === 'Two-Factor Authentication'; else standardCategory" class="two-factor-auth-container">
              <div class="category-header">
                <h3>{{ category }}</h3>
                <p>{{ getCategoryDescription(category) }}</p>
              </div>

              <p-tabView class="nested-tabs">
                <!-- UI Option -->
                <p-tabPanel header="UI Interface" leftIcon="pi pi-desktop">
                  <div class="two-factor-ui-interface">
                    <p-card header="Two-Factor Authentication Interface">
                      <div class="ui-description">
                        <p><i class="pi pi-info-circle"></i> A comprehensive interface for managing two-factor authentication security settings.</p>
                      </div>
                      
                      <div class="ui-features">
                        <h4>Available Features:</h4>
                        <div class="feature-grid">
                          <div class="feature-card">
                            <i class="pi pi-mobile"></i>
                            <h5>Authenticator Setup</h5>
                            <p>Enable and configure authenticator apps</p>
                            <p-button label="Setup Authenticator" icon="pi pi-external-link" class="p-button-outlined" size="small" (onClick)="openTwoFactorAuthUI('setup')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-shield"></i>
                            <h5>TFA Management</h5>
                            <p>Enable or disable two-factor authentication</p>
                            <p-button label="Manage TFA" icon="pi pi-cog" class="p-button-outlined" size="small" (onClick)="openTwoFactorAuthUI('manage')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-refresh"></i>
                            <h5>Reset Authenticator</h5>
                            <p>Reset and reconfigure your authenticator</p>
                            <p-button label="Reset TFA" icon="pi pi-refresh" class="p-button-outlined" size="small" (onClick)="openTwoFactorAuthUI('reset')"></p-button>
                          </div>
                          <div class="feature-card">
                            <i class="pi pi-key"></i>
                            <h5>Recovery Codes</h5>
                            <p>Generate backup recovery codes</p>
                            <p-button label="Recovery Codes" icon="pi pi-unlock" class="p-button-outlined" size="small" (onClick)="openTwoFactorAuthUI('recovery')"></p-button>
                          </div>
                        </div>
                      </div>

                      <p-divider></p-divider>

                      <div class="quick-two-factor-actions">
                        <h4>Quick Actions:</h4>
                        <div class="actions-row">
                          <p-button label="Check Status" icon="pi pi-info" (onClick)="openTwoFactorAuthUI('status')"></p-button>
                          <p-button label="Enable TFA" icon="pi pi-shield" class="p-button-success" (onClick)="openTwoFactorAuthUI('enable')"></p-button>
                          <p-button label="Disable TFA" icon="pi pi-times" class="p-button-warning" (onClick)="openTwoFactorAuthUI('disable')"></p-button>
                          <p-button label="Generate Codes" icon="pi pi-key" class="p-button-info" (onClick)="openTwoFactorAuthUI('generate-codes')"></p-button>
                        </div>
                      </div>
                    </p-card>
                  </div>
                </p-tabPanel>

                <!-- API Option -->
                <p-tabPanel header="API Endpoints" leftIcon="pi pi-code">
                  <div class="api-endpoints-interface">
                    <p-card header="Two-Factor Authentication API Endpoints">
                      <div class="api-description">
                        <p><i class="pi pi-info-circle"></i> Direct access to Two-Factor Authentication API endpoints for testing and integration.</p>
                      </div>

                      <p-accordion>
                        <p-accordionTab 
                          *ngFor="let endpoint of getEndpointsByCategory(category)"
                          [header]="getAccordionHeader(endpoint)"
                        >
                          <div class="endpoint-details">
                            <div class="endpoint-info">
                              <div class="endpoint-meta">
                                <p-chip 
                                  [label]="endpoint.method" 
                                  [class]="'method-' + endpoint.method.toLowerCase()"
                                ></p-chip>
                                <span class="endpoint-path">{{ endpoint.endpoint }}</span>
                                <p-badge 
                                  *ngIf="endpoint.requiresAuth" 
                                  value="AUTH" 
                                  severity="warning"
                                ></p-badge>
                              </div>
                              <p class="endpoint-summary">{{ endpoint.summary }}</p>
                              
                              <div class="endpoint-parameters" *ngIf="endpoint.parameters && endpoint.parameters.length > 0">
                                <h5>Parameters:</h5>
                                <div class="parameters-list">
                                  <p-chip 
                                    *ngFor="let param of endpoint.parameters" 
                                    [label]="param"
                                    class="parameter-chip"
                                  ></p-chip>
                                </div>
                              </div>

                              <div class="endpoint-actions">
                                <p-button 
                                  label="Test Endpoint" 
                                  icon="pi pi-play" 
                                  size="small"
                                  (onClick)="openEndpointTester(endpoint.endpoint, endpoint.method)"
                                ></p-button>
                                <p-button 
                                  label="Copy cURL" 
                                  icon="pi pi-copy" 
                                  size="small"
                                  class="p-button-outlined"
                                  (onClick)="copyCurlCommand(endpoint)"
                                ></p-button>
                                <p-button 
                                  label="View Details" 
                                  icon="pi pi-eye" 
                                  size="small"
                                  class="p-button-text"
                                  (onClick)="showEndpointDetails(endpoint)"
                                ></p-button>
                              </div>
                            </div>
                          </div>
                        </p-accordionTab>
                      </p-accordion>
                    </p-card>
                  </div>
                </p-tabPanel>
              </p-tabView>
            </div>
          </ng-template>

          <!-- Standard Category Template -->
          <ng-template #standardCategory>
            <div class="category-endpoints">
              <div class="category-header">
                <h3>{{ category }} Endpoints</h3>
                <p>{{ getCategoryDescription(category) }}</p>
              </div>

              <p-accordion>
                <p-accordionTab 
                  *ngFor="let endpoint of getEndpointsByCategory(category)"
                  [header]="getAccordionHeader(endpoint)"
                >
                  <div class="endpoint-details">
                    <div class="endpoint-info">
                      <div class="endpoint-meta">
                        <p-chip 
                          [label]="endpoint.method" 
                          [class]="'method-' + endpoint.method.toLowerCase()"
                        ></p-chip>
                        <span class="endpoint-path">{{ endpoint.endpoint }}</span>
                        <p-badge 
                          *ngIf="endpoint.requiresAuth" 
                          value="AUTH" 
                          severity="warning"
                        ></p-badge>
                      </div>
                      <p class="endpoint-summary">{{ endpoint.summary }}</p>
                      
                      <div class="endpoint-parameters" *ngIf="endpoint.parameters && endpoint.parameters.length > 0">
                        <h5>Parameters:</h5>
                        <div class="parameters-list">
                          <p-chip 
                            *ngFor="let param of endpoint.parameters" 
                            [label]="param"
                            class="parameter-chip"
                          ></p-chip>
                        </div>
                      </div>

                      <div class="endpoint-actions">
                        <p-button 
                          label="Test Endpoint" 
                          icon="pi pi-play" 
                          size="small"
                          (onClick)="openEndpointTester(endpoint.endpoint, endpoint.method)"
                        ></p-button>
                        <p-button 
                          label="Copy cURL" 
                          icon="pi pi-copy" 
                          size="small"
                          class="p-button-outlined"
                          (onClick)="copyCurlCommand(endpoint)"
                        ></p-button>
                      </div>
                    </div>
                  </div>
                </p-accordionTab>
              </p-accordion>
            </div>
          </ng-template>
        </p-tabPanel>

        <!-- API Tester Tab -->
        <p-tabPanel header="API Tester" leftIcon="pi pi-play">
          <div class="api-tester">
            <p-card header="Test API Endpoints">
              <div class="tester-form">
                <div class="form-row">
                  <div class="form-field">
                    <label for="method">Method</label>
                    <p-dropdown
                      [(ngModel)]="testPayload.method"
                      [options]="httpMethods"
                      placeholder="Select Method"
                      styleClass="w-full"
                    ></p-dropdown>
                  </div>
                  <div class="form-field flex-grow">
                    <label for="endpoint">Endpoint</label>
                    <input 
                      pInputText 
                      [(ngModel)]="testPayload.endpoint"
                      placeholder="Enter API endpoint (e.g., /api/User)"
                      class="w-full"
                    />
                  </div>
                </div>

                <div class="form-field">
                  <label for="headers">Headers (JSON format)</label>
                  <textarea 
                    pInputTextarea 
                    [(ngModel)]="headersJson"
                    placeholder='{"Authorization": "Bearer your-token", "Content-Type": "application/json"}'
                    rows="3"
                    class="w-full"
                  ></textarea>
                </div>

                <div class="form-field" *ngIf="showRequestBody()">
                  <label for="body">Request Body (JSON format)</label>
                  <textarea 
                    pInputTextarea 
                    [(ngModel)]="testPayload.body"
                    placeholder='{"key": "value"}'
                    rows="6"
                    class="w-full"
                  ></textarea>
                </div>

                <div class="form-actions">
                  <p-button 
                    label="Send Request" 
                    icon="pi pi-send" 
                    (onClick)="sendTestRequest()"
                    [loading]="isTestingEndpoint"
                  ></p-button>
                  <p-button 
                    label="Clear" 
                    icon="pi pi-refresh" 
                    class="p-button-outlined"
                    (onClick)="clearTestForm()"
                  ></p-button>
                </div>
              </div>

              <p-divider></p-divider>

              <div class="test-results" *ngIf="lastTestResult">
                <h4>Response</h4>
                <div class="result-meta">
                  <p-badge 
                    [value]="lastTestResult.status.toString()" 
                    [severity]="getStatusSeverity(lastTestResult.status)"
                  ></p-badge>
                  <span class="timestamp">{{ lastTestResult.timestamp | date:'medium' }}</span>
                </div>
                
                <div class="result-content">
                  <pre class="result-data">{{ formatJsonResponse(lastTestResult.data) }}</pre>
                  <div class="result-error" *ngIf="lastTestResult.error">
                    <p-message severity="error" [text]="lastTestResult.error"></p-message>
                  </div>
                </div>
              </div>
            </p-card>
          </div>
        </p-tabPanel>

        <!-- Documentation Tab -->
        <p-tabPanel header="Documentation" leftIcon="pi pi-book">
          <div class="documentation">
            <p-card header="API Documentation">
              <div class="doc-content">
                <h3>Authentication</h3>
                <p>Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:</p>
                <pre class="code-sample">Authorization: Bearer your-jwt-token</pre>

                <h3>Response Format</h3>
                <p>All API responses follow a standard format:</p>
                <pre class="code-sample">{{sampleResponse}}</pre>

                <h3>Error Handling</h3>
                <p>API errors return appropriate HTTP status codes with error details in the response body.</p>

                <h3>Rate Limiting</h3>
                <p>API requests may be rate limited. Check response headers for limit information.</p>

                <h3>Pagination</h3>
                <p>List endpoints support pagination with pageNumber and pageSize parameters.</p>
              </div>
            </p-card>
          </div>
        </p-tabPanel>
      </p-tabView>
    </div>

    <!-- Login Dialog Modal -->
    <p-dialog 
      header="User Login" 
      [(visible)]="showLoginDialog" 
      [modal]="true" 
      [style]="{width: '500px'}"
      [draggable]="false"
      [resizable]="false"
      (onHide)="closeLoginDialog()"
    >
      <div class="login-dialog-content">
        <p class="form-description">
          <i class="pi pi-info-circle"></i> 
          This form calls the <code>/api/Authorize/token</code> POST endpoint to authenticate users.
        </p>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
          <div class="form-row">
            <div class="form-field">
              <label for="userName">Email Address:</label>
              <input 
                id="userName"
                type="email" 
                pInputText 
                formControlName="userName"
                placeholder="Enter your email address"
                [class.ng-invalid]="isFieldInvalid('userName')"
              />
              <small class="error-message" *ngIf="isFieldInvalid('userName')">
                {{ getFieldError('userName') }}
              </small>
            </div>

            <div class="form-field">
              <label for="password">Password:</label>
              <input 
                id="password"
                type="password" 
                pInputText 
                formControlName="password"
                placeholder="Enter your password"
                [class.ng-invalid]="isFieldInvalid('password')"
              />
              <small class="error-message" *ngIf="isFieldInvalid('password')">
                {{ getFieldError('password') }}
              </small>
            </div>
          </div>

          <div class="form-actions">
            <p-button 
              type="submit"
              label="Login" 
              icon="pi pi-sign-in"
              [loading]="isLoggingIn"
              [disabled]="loginForm.invalid || isLoggingIn"
              class="p-button-success"
            ></p-button>
            <p-button 
              type="button"
              label="Cancel" 
              icon="pi pi-times"
              (onClick)="closeLoginDialog()"
              class="p-button-secondary"
            ></p-button>
          </div>
        </form>

        <!-- Login Result Display -->
        <div *ngIf="loginResult" class="login-result">
          <p-divider></p-divider>
          <h5>API Response:</h5>
          <div class="result-container" [ngClass]="loginResult.success ? 'success' : 'error'">
            <div class="result-header">
              <i [class]="loginResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
              <span>{{ loginResult.success ? 'Login Successful' : 'Login Failed' }}</span>
              <p-badge 
                [value]="loginResult.status.toString()" 
                [severity]="loginResult.success ? 'success' : 'danger'"
              ></p-badge>
            </div>
            
            <div class="result-details">
              <h6>Response Data:</h6>
              <pre>{{ loginResult.data ? (loginResult.data | json) : (loginResult.fullError ? (loginResult.fullError | json) : loginResult.error) }}</pre>
              <div *ngIf="!loginResult.success && loginResult.fullError" class="error-debugging">
                <h6>Debug Information:</h6>
                <div class="debug-item">
                  <strong>Status:</strong> {{ loginResult.status }}
                </div>
                <div class="debug-item" *ngIf="loginResult.fullError?.type">
                  <strong>Error Type:</strong> {{ loginResult.fullError.type }}
                </div>
                <div class="debug-item" *ngIf="loginResult.fullError?.title">
                  <strong>Title:</strong> {{ loginResult.fullError.title }}
                </div>
                <div class="debug-item" *ngIf="loginResult.fullError?.detail">
                  <strong>Detail:</strong> {{ loginResult.fullError.detail }}
                </div>
                <div class="debug-item" *ngIf="loginResult.fullError?.errors">
                  <strong>Validation Errors:</strong>
                  <pre class="validation-errors">{{ loginResult.fullError.errors | json }}</pre>
                </div>
              </div>
              <small>Timestamp: {{ loginResult.timestamp | date:'medium' }}</small>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Registration Dialog -->
    <p-dialog 
      [(visible)]="showRegisterDialog" 
      [modal]="true" 
      [closable]="true" 
      [resizable]="false" 
      [draggable]="true"
      header="User Registration" 
      styleClass="register-dialog" 
      (onHide)="closeRegisterDialog()"
    >
      <div class="register-dialog-content">
        <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="register-form">
          
          <!-- Username Field -->
          <div class="form-field">
            <label for="registerUserName">Username</label>
            <input 
              id="registerUserName"
              type="text" 
              pInputText 
              formControlName="userName"
              placeholder="Enter username"
              [class.ng-invalid]="isRegisterFieldInvalid('userName')"
            />
            <small 
              class="p-error" 
              *ngIf="isRegisterFieldInvalid('userName')"
            >
              {{ getRegisterFieldError('userName') }}
            </small>
          </div>

          <!-- Email Field -->
          <div class="form-field">
            <label for="registerEmail">Email</label>
            <input 
              id="registerEmail"
              type="email" 
              pInputText 
              formControlName="email"
              placeholder="Enter email address"
              [class.ng-invalid]="isRegisterFieldInvalid('email')"
            />
            <small 
              class="p-error" 
              *ngIf="isRegisterFieldInvalid('email')"
            >
              {{ getRegisterFieldError('email') }}
            </small>
          </div>

          <!-- Password Field -->
          <div class="form-field">
            <label for="registerPassword">Password</label>
            <input 
              id="registerPassword"
              type="password" 
              pInputText 
              formControlName="password"
              placeholder="Enter password"
              [class.ng-invalid]="isRegisterFieldInvalid('password')"
            />
            <small 
              class="p-error" 
              *ngIf="isRegisterFieldInvalid('password')"
            >
              {{ getRegisterFieldError('password') }}
            </small>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-field">
            <label for="registerConfirmPassword">Confirm Password</label>
            <input 
              id="registerConfirmPassword"
              type="password" 
              pInputText 
              formControlName="confirmPassword"
              placeholder="Confirm password"
              [class.ng-invalid]="isRegisterFieldInvalid('confirmPassword')"
            />
            <small 
              class="p-error" 
              *ngIf="isRegisterFieldInvalid('confirmPassword')"
            >
              {{ getRegisterFieldError('confirmPassword') }}
            </small>
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <p-button 
              type="submit" 
              label="Register" 
              icon="pi pi-user-plus"
              class="p-button-success"
              [loading]="isRegistering"
              [disabled]="registerForm.invalid || isRegistering"
            ></p-button>
            <p-button 
              type="button" 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-secondary"
              (onClick)="closeRegisterDialog()"
            ></p-button>
          </div>
        </form>

        <!-- Registration Result -->
        <div class="result-display" *ngIf="registerResult">
          <div class="result-header" [ngClass]="registerResult.success ? 'success' : 'error'">
            <i [class]="registerResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ registerResult.success ? 'Registration Successful!' : 'Registration Failed' }}</span>
          </div>
          
          <div class="result-details">
            <p><strong>Status:</strong> {{ registerResult.status }}</p>
            <p><strong>Time:</strong> {{ registerResult.timestamp | date:'medium' }}</p>
            
            <div *ngIf="registerResult.success && registerResult.data" class="success-data">
              <h4>Registration Details:</h4>
              <pre>{{ registerResult.data | json }}</pre>
            </div>
            
            <div *ngIf="!registerResult.success" class="error-data">
              <p><strong>Error:</strong> {{ registerResult.error }}</p>
              <details *ngIf="registerResult.fullError">
                <summary>Full Error Details (for debugging)</summary>
                <pre>{{ registerResult.fullError | json }}</pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Password Reset Dialog -->
    <p-dialog 
      header="Reset Password" 
      [(visible)]="showPasswordResetDialog" 
      [modal]="true" 
      [style]="{width: '450px'}" 
      [draggable]="false" 
      [resizable]="false"
      (onHide)="closePasswordResetDialog()"
      class="password-reset-dialog"
    >
      <div class="password-reset-dialog-content">
        <form [formGroup]="passwordResetForm" (ngSubmit)="onPasswordReset()" class="password-reset-form">
          <div class="form-field">
            <label for="oldPassword">Current Password *</label>
            <input 
              type="password" 
              id="oldPassword" 
              formControlName="oldPassword" 
              placeholder="Enter your current password"
              [class.ng-invalid]="isPasswordResetFieldInvalid('oldPassword')"
            />
            <small class="p-error" *ngIf="isPasswordResetFieldInvalid('oldPassword')">
              {{ getPasswordResetFieldError('oldPassword') }}
            </small>
          </div>

          <div class="form-field">
            <label for="newPassword">New Password *</label>
            <input 
              type="password" 
              id="newPassword" 
              formControlName="newPassword" 
              placeholder="Enter your new password (min 6 characters)"
              [class.ng-invalid]="isPasswordResetFieldInvalid('newPassword')"
            />
            <small class="p-error" *ngIf="isPasswordResetFieldInvalid('newPassword')">
              {{ getPasswordResetFieldError('newPassword') }}
            </small>
          </div>

          <div class="form-field">
            <label for="confirmNewPassword">Confirm New Password *</label>
            <input 
              type="password" 
              id="confirmNewPassword" 
              formControlName="confirmPassword" 
              placeholder="Confirm your new password"
              [class.ng-invalid]="isPasswordResetFieldInvalid('confirmPassword')"
            />
            <small class="p-error" *ngIf="isPasswordResetFieldInvalid('confirmPassword')">
              {{ getPasswordResetFieldError('confirmPassword') }}
            </small>
          </div>

          <div class="form-actions">
            <p-button 
              label="Cancel" 
              icon="pi pi-times" 
              type="button"
              class="p-button-outlined" 
              (onClick)="closePasswordResetDialog()"
            ></p-button>
            <p-button 
              label="Reset Password" 
              icon="pi pi-refresh" 
              type="submit"
              [loading]="isResettingPassword"
              [disabled]="passwordResetForm.invalid || isResettingPassword"
            ></p-button>
          </div>
        </form>

        <!-- Password Reset Result -->
        <div class="result-display" *ngIf="passwordResetResult">
          <div class="result-header" [ngClass]="passwordResetResult.success ? 'success' : 'error'">
            <i [class]="passwordResetResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ passwordResetResult.success ? 'Password Reset Successful!' : 'Password Reset Failed' }}</span>
          </div>
          
          <div class="result-details">
            <p><strong>Status:</strong> {{ passwordResetResult.status }}</p>
            <p><strong>Time:</strong> {{ passwordResetResult.timestamp | date:'medium' }}</p>
            
            <div *ngIf="passwordResetResult.success && passwordResetResult.data" class="success-data">
              <h4>Reset Details:</h4>
              <pre>{{ passwordResetResult.data | json }}</pre>
            </div>
            
            <div *ngIf="!passwordResetResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ passwordResetResult.error }}</p>
              <details *ngIf="passwordResetResult.fullError">
                <summary>Technical Details</summary>
                <pre>{{ passwordResetResult.fullError | json }}</pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Confirm Email Dialog -->
    <p-dialog 
      [(visible)]="showConfirmEmailDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '450px'}"
      header="Confirm Email"
      (onHide)="closeConfirmEmailDialog()"
    >
      <div class="confirm-email-dialog">
        <form [formGroup]="confirmEmailForm" (ngSubmit)="onConfirmEmail()" class="confirm-email-form">
          <div class="form-field">
            <label for="userId">User ID *</label>
            <input 
              type="text" 
              id="userId"
              formControlName="userId" 
              pInputText 
              placeholder="Enter User ID"
              [class.ng-invalid]="isConfirmEmailFieldInvalid('userId')"
            />
            <div 
              *ngIf="isConfirmEmailFieldInvalid('userId')" 
              class="error-message"
            >
              {{ getConfirmEmailFieldError('userId') }}
            </div>
          </div>

          <div class="form-field">
            <label for="code">Confirmation Code *</label>
            <input 
              type="text" 
              id="code"
              formControlName="code" 
              pInputText 
              placeholder="Enter confirmation code"
              [class.ng-invalid]="isConfirmEmailFieldInvalid('code')"
            />
            <div 
              *ngIf="isConfirmEmailFieldInvalid('code')" 
              class="error-message"
            >
              {{ getConfirmEmailFieldError('code') }}
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Confirm Email" 
              icon="pi pi-check"
              [disabled]="confirmEmailForm.invalid || isConfirmingEmail"
              [loading]="isConfirmingEmail"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeConfirmEmailDialog()"
            ></button>
          </div>
        </form>

        <!-- Confirm Email Result -->
        <div *ngIf="confirmEmailResult" class="result-section">
          <div class="result-header" [ngClass]="confirmEmailResult.success ? 'success' : 'error'">
            <i [class]="confirmEmailResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ confirmEmailResult.success ? 'Email Confirmed Successfully!' : 'Email Confirmation Failed' }}</span>
          </div>
          
          <div class="result-details">
            <p><strong>Status:</strong> {{ confirmEmailResult.status }}</p>
            <p><strong>Time:</strong> {{ confirmEmailResult.timestamp | date:'medium' }}</p>
            
            <div *ngIf="confirmEmailResult.success && confirmEmailResult.data" class="success-data">
              <h4>Confirmation Details:</h4>
              <pre>{{ confirmEmailResult.data | json }}</pre>
            </div>
            
            <div *ngIf="!confirmEmailResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ confirmEmailResult.error }}</p>
              <details *ngIf="confirmEmailResult.fullError">
                <summary>Technical Details</summary>
                <pre>{{ confirmEmailResult.fullError | json }}</pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Refresh Token Dialog -->
    <p-dialog 
      [(visible)]="showRefreshTokenDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '450px'}"
      header="Refresh Token"
      (onHide)="closeRefreshTokenDialog()"
    >
      <div class="refresh-token-dialog">
        <form [formGroup]="refreshTokenForm" (ngSubmit)="onRefreshToken()" class="refresh-token-form">
          <div class="form-field">
            <label for="refreshUserId">User ID *</label>
            <input 
              type="text" 
              id="refreshUserId"
              formControlName="userId" 
              pInputText 
              placeholder="Enter User ID"
              [class.ng-invalid]="isRefreshTokenFieldInvalid('userId')"
            />
            <div 
              *ngIf="isRefreshTokenFieldInvalid('userId')" 
              class="error-message"
            >
              {{ getRefreshTokenFieldError('userId') }}
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Refresh Token" 
              icon="pi pi-refresh"
              [disabled]="refreshTokenForm.invalid || isRefreshingToken"
              [loading]="isRefreshingToken"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeRefreshTokenDialog()"
            ></button>
          </div>
        </form>

        <!-- Refresh Token Result -->
        <div *ngIf="refreshTokenResult" class="result-section">
          <div class="result-header" [ngClass]="refreshTokenResult.success ? 'success' : 'error'">
            <i [class]="refreshTokenResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ refreshTokenResult.success ? 'Token Refreshed Successfully!' : 'Token Refresh Failed' }}</span>
          </div>
          
          <div class="result-details">
            <p><strong>Status:</strong> {{ refreshTokenResult.status }}</p>
            <p><strong>Time:</strong> {{ refreshTokenResult.timestamp | date:'medium' }}</p>
            
            <div *ngIf="refreshTokenResult.success && refreshTokenResult.data" class="success-data">
              <h4>New Token Details:</h4>
              <pre>{{ refreshTokenResult.data | json }}</pre>
            </div>
            
            <div *ngIf="!refreshTokenResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ refreshTokenResult.error }}</p>
              <details *ngIf="refreshTokenResult.fullError">
                <summary>Technical Details</summary>
                <pre>{{ refreshTokenResult.fullError | json }}</pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Authentication Login Dialog -->
    <p-dialog 
      [(visible)]="showAuthLoginDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '450px'}"
      header="Authentication Login"
      (onHide)="closeAuthLoginDialog()"
    >
      <div class="auth-dialog">
        <form [formGroup]="authLoginForm" (ngSubmit)="onAuthLogin()" class="auth-form">
          <div class="form-field">
            <label for="authUserName">User Name *</label>
            <input 
              type="text" 
              id="authUserName"
              formControlName="userName" 
              pInputText 
              placeholder="Enter User Name"
              [class.ng-invalid]="isAuthLoginFieldInvalid('userName')"
            />
            <div *ngIf="isAuthLoginFieldInvalid('userName')" class="error-message">
              {{ getAuthLoginFieldError('userName') }}
            </div>
          </div>

          <div class="form-field">
            <label for="authPassword">Password *</label>
            <input 
              type="password" 
              id="authPassword"
              formControlName="password" 
              pInputText 
              placeholder="Enter Password"
              [class.ng-invalid]="isAuthLoginFieldInvalid('password')"
            />
            <div *ngIf="isAuthLoginFieldInvalid('password')" class="error-message">
              {{ getAuthLoginFieldError('password') }}
            </div>
          </div>

          <div class="form-field">
            <label for="authDeviceCode">Device Code *</label>
            <input 
              type="text" 
              id="authDeviceCode"
              formControlName="deviceCode" 
              pInputText 
              placeholder="Enter Device Code"
              [class.ng-invalid]="isAuthLoginFieldInvalid('deviceCode')"
            />
            <div *ngIf="isAuthLoginFieldInvalid('deviceCode')" class="error-message">
              {{ getAuthLoginFieldError('deviceCode') }}
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Login" 
              icon="pi pi-sign-in"
              [disabled]="authLoginForm.invalid || isAuthLoggingIn"
              [loading]="isAuthLoggingIn"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeAuthLoginDialog()"
            ></button>
          </div>
        </form>

        <div *ngIf="authLoginResult" class="result-section">
          <div class="result-header" [ngClass]="authLoginResult.success ? 'success' : 'error'">
            <i [class]="authLoginResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ authLoginResult.success ? 'Login Successful!' : 'Login Failed' }}</span>
          </div>
          <div class="result-details">
            <p><strong>Status:</strong> {{ authLoginResult.status }}</p>
            <p><strong>Time:</strong> {{ authLoginResult.timestamp | date:'medium' }}</p>
            <div *ngIf="authLoginResult.success && authLoginResult.data" class="success-data">
              <h4>Response:</h4>
              <pre>{{ authLoginResult.data | json }}</pre>
            </div>
            <div *ngIf="!authLoginResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ authLoginResult.error }}</p>
              <details *ngIf="authLoginResult.fullError">
                <summary>Technical Details</summary>
                <pre>{{ authLoginResult.fullError | json }}</pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Authentication Logout Dialog -->
    <p-dialog 
      [(visible)]="showAuthLogoutDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '400px'}"
      header="Authentication Logout"
      (onHide)="closeAuthLogoutDialog()"
    >
      <div class="auth-dialog">
        <form [formGroup]="authLogoutForm" (ngSubmit)="onAuthLogout()" class="auth-form">
          <p>Are you sure you want to logout?</p>
          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Logout" 
              icon="pi pi-sign-out"
              [disabled]="isAuthLoggingOut"
              [loading]="isAuthLoggingOut"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeAuthLogoutDialog()"
            ></button>
          </div>
        </form>

        <div *ngIf="authLogoutResult" class="result-section">
          <div class="result-header" [ngClass]="authLogoutResult.success ? 'success' : 'error'">
            <i [class]="authLogoutResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ authLogoutResult.success ? 'Logout Successful!' : 'Logout Failed' }}</span>
          </div>
          <div class="result-details">
            <p><strong>Status:</strong> {{ authLogoutResult.status }}</p>
            <p><strong>Time:</strong> {{ authLogoutResult.timestamp | date:'medium' }}</p>
            <div *ngIf="!authLogoutResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ authLogoutResult.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Is Authenticated Dialog -->
    <p-dialog 
      [(visible)]="showIsAuthenticatedDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '400px'}"
      header="Check Authentication Status"
      (onHide)="closeIsAuthenticatedDialog()"
    >
      <div class="auth-dialog">
        <form [formGroup]="isAuthenticatedForm" (ngSubmit)="onIsAuthenticated()" class="auth-form">
          <p>Check current authentication status</p>
          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Check Status" 
              icon="pi pi-user"
              [disabled]="isCheckingAuthentication"
              [loading]="isCheckingAuthentication"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeIsAuthenticatedDialog()"
            ></button>
          </div>
        </form>

        <div *ngIf="isAuthenticatedResult" class="result-section">
          <div class="result-header" [ngClass]="isAuthenticatedResult.success ? 'success' : 'error'">
            <i [class]="isAuthenticatedResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ isAuthenticatedResult.success ? 'Authentication Check Complete!' : 'Authentication Check Failed' }}</span>
          </div>
          <div class="result-details">
            <p><strong>Status:</strong> {{ isAuthenticatedResult.status }}</p>
            <p><strong>Time:</strong> {{ isAuthenticatedResult.timestamp | date:'medium' }}</p>
            <div *ngIf="isAuthenticatedResult.success && isAuthenticatedResult.data" class="success-data">
              <h4>Authentication Status:</h4>
              <pre>{{ isAuthenticatedResult.data | json }}</pre>
            </div>
            <div *ngIf="!isAuthenticatedResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ isAuthenticatedResult.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Forgot Password Dialog -->
    <p-dialog 
      [(visible)]="showForgotPasswordDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '450px'}"
      header="Forgot Password"
      (onHide)="closeForgotPasswordDialog()"
    >
      <div class="auth-dialog">
        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onForgotPassword()" class="auth-form">
          <div class="form-field">
            <label for="forgotEmail">Email *</label>
            <input 
              type="email" 
              id="forgotEmail"
              formControlName="email" 
              pInputText 
              placeholder="Enter Email Address"
              [class.ng-invalid]="isForgotPasswordFieldInvalid('email')"
            />
            <div *ngIf="isForgotPasswordFieldInvalid('email')" class="error-message">
              {{ getForgotPasswordFieldError('email') }}
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Send Reset Link" 
              icon="pi pi-envelope"
              [disabled]="forgotPasswordForm.invalid || isSendingForgotPassword"
              [loading]="isSendingForgotPassword"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeForgotPasswordDialog()"
            ></button>
          </div>
        </form>

        <div *ngIf="forgotPasswordResult" class="result-section">
          <div class="result-header" [ngClass]="forgotPasswordResult.success ? 'success' : 'error'">
            <i [class]="forgotPasswordResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ forgotPasswordResult.success ? 'Reset Link Sent!' : 'Failed to Send Reset Link' }}</span>
          </div>
          <div class="result-details">
            <p><strong>Status:</strong> {{ forgotPasswordResult.status }}</p>
            <p><strong>Time:</strong> {{ forgotPasswordResult.timestamp | date:'medium' }}</p>
            <div *ngIf="!forgotPasswordResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ forgotPasswordResult.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Resend Verification Email Dialog -->
    <p-dialog 
      [(visible)]="showResendVerificationEmailDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '450px'}"
      header="Resend Verification Email"
      (onHide)="closeResendVerificationEmailDialog()"
    >
      <div class="auth-dialog">
        <form [formGroup]="resendVerificationEmailForm" (ngSubmit)="onResendVerificationEmail()" class="auth-form">
          <div class="form-field">
            <label for="resendUserId">User ID *</label>
            <input 
              type="text" 
              id="resendUserId"
              formControlName="userId" 
              pInputText 
              placeholder="Enter User ID"
              [class.ng-invalid]="isResendVerificationEmailFieldInvalid('userId')"
            />
            <div *ngIf="isResendVerificationEmailFieldInvalid('userId')" class="error-message">
              {{ getResendVerificationEmailFieldError('userId') }}
            </div>
          </div>

          <div class="form-field">
            <label for="resendLastName">Last Name *</label>
            <input 
              type="text" 
              id="resendLastName"
              formControlName="lastName" 
              pInputText 
              placeholder="Enter Last Name"
              [class.ng-invalid]="isResendVerificationEmailFieldInvalid('lastName')"
            />
            <div *ngIf="isResendVerificationEmailFieldInvalid('lastName')" class="error-message">
              {{ getResendVerificationEmailFieldError('lastName') }}
            </div>
          </div>

          <div class="form-field">
            <label for="resendEmail">Email *</label>
            <input 
              type="email" 
              id="resendEmail"
              formControlName="email" 
              pInputText 
              placeholder="Enter Email Address"
              [class.ng-invalid]="isResendVerificationEmailFieldInvalid('email')"
            />
            <div *ngIf="isResendVerificationEmailFieldInvalid('email')" class="error-message">
              {{ getResendVerificationEmailFieldError('email') }}
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Resend Email" 
              icon="pi pi-envelope"
              [disabled]="resendVerificationEmailForm.invalid || isResendingVerificationEmail"
              [loading]="isResendingVerificationEmail"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeResendVerificationEmailDialog()"
            ></button>
          </div>
        </form>

        <div *ngIf="resendVerificationEmailResult" class="result-section">
          <div class="result-header" [ngClass]="resendVerificationEmailResult.success ? 'success' : 'error'">
            <i [class]="resendVerificationEmailResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ resendVerificationEmailResult.success ? 'Verification Email Sent!' : 'Failed to Send Email' }}</span>
          </div>
          <div class="result-details">
            <p><strong>Status:</strong> {{ resendVerificationEmailResult.status }}</p>
            <p><strong>Time:</strong> {{ resendVerificationEmailResult.timestamp | date:'medium' }}</p>
            <div *ngIf="!resendVerificationEmailResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ resendVerificationEmailResult.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Set TFA Dialog -->
    <p-dialog 
      [(visible)]="showSetTfaDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '450px'}"
      header="Set Two-Factor Authentication"
      (onHide)="closeSetTfaDialog()"
    >
      <div class="auth-dialog">
        <form [formGroup]="setTfaForm" (ngSubmit)="onSetTfa()" class="auth-form">
          <div class="form-field">
            <label for="setTfaUserId">User ID *</label>
            <input 
              type="text" 
              id="setTfaUserId"
              formControlName="userId" 
              pInputText 
              placeholder="Enter User ID"
              [class.ng-invalid]="isSetTfaFieldInvalid('userId')"
            />
            <div *ngIf="isSetTfaFieldInvalid('userId')" class="error-message">
              {{ getSetTfaFieldError('userId') }}
            </div>
          </div>

          <div class="form-field">
            <label for="setTfaEnabled">Enable TFA</label>
            <p-checkbox 
              formControlName="isEnabled" 
              binary="true"
              label="Enable Two-Factor Authentication"
            ></p-checkbox>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Update TFA" 
              icon="pi pi-shield"
              [disabled]="setTfaForm.invalid || isSettingTfa"
              [loading]="isSettingTfa"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeSetTfaDialog()"
            ></button>
          </div>
        </form>

        <div *ngIf="setTfaResult" class="result-section">
          <div class="result-header" [ngClass]="setTfaResult.success ? 'success' : 'error'">
            <i [class]="setTfaResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ setTfaResult.success ? 'TFA Updated Successfully!' : 'Failed to Update TFA' }}</span>
          </div>
          <div class="result-details">
            <p><strong>Status:</strong> {{ setTfaResult.status }}</p>
            <p><strong>Time:</strong> {{ setTfaResult.timestamp | date:'medium' }}</p>
            <div *ngIf="!setTfaResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ setTfaResult.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Set Password Dialog -->
    <p-dialog 
      [(visible)]="showSetPasswordDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '450px'}"
      header="Set Password"
      (onHide)="closeSetPasswordDialog()"
    >
      <div class="auth-dialog">
        <form [formGroup]="setPasswordForm" (ngSubmit)="onSetPassword()" class="auth-form">
          <div class="form-field">
            <label for="setPasswordUserId">User ID *</label>
            <input 
              type="text" 
              id="setPasswordUserId"
              formControlName="userId" 
              pInputText 
              placeholder="Enter User ID"
              [class.ng-invalid]="isSetPasswordFieldInvalid('userId')"
            />
            <div *ngIf="isSetPasswordFieldInvalid('userId')" class="error-message">
              {{ getSetPasswordFieldError('userId') }}
            </div>
          </div>

          <div class="form-field">
            <label for="setPasswordNew">New Password *</label>
            <input 
              type="password" 
              id="setPasswordNew"
              formControlName="Password" 
              pInputText 
              placeholder="Enter New Password"
              [class.ng-invalid]="isSetPasswordFieldInvalid('Password')"
            />
            <div *ngIf="isSetPasswordFieldInvalid('Password')" class="error-message">
              {{ getSetPasswordFieldError('Password') }}
            </div>
          </div>

          <div class="form-field">
            <label for="setPasswordConfirm">Confirm Password *</label>
            <input 
              type="password" 
              id="setPasswordConfirm"
              formControlName="ConfirmPassword" 
              pInputText 
              placeholder="Confirm New Password"
              [class.ng-invalid]="isSetPasswordFieldInvalid('ConfirmPassword')"
            />
            <div *ngIf="isSetPasswordFieldInvalid('ConfirmPassword')" class="error-message">
              {{ getSetPasswordFieldError('ConfirmPassword') }}
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Set Password" 
              icon="pi pi-key"
              [disabled]="setPasswordForm.invalid || isSettingPassword"
              [loading]="isSettingPassword"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeSetPasswordDialog()"
            ></button>
          </div>
        </form>

        <div *ngIf="setPasswordResult" class="result-section">
          <div class="result-header" [ngClass]="setPasswordResult.success ? 'success' : 'error'">
            <i [class]="setPasswordResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ setPasswordResult.success ? 'Password Set Successfully!' : 'Failed to Set Password' }}</span>
          </div>
          <div class="result-details">
            <p><strong>Status:</strong> {{ setPasswordResult.status }}</p>
            <p><strong>Time:</strong> {{ setPasswordResult.timestamp | date:'medium' }}</p>
            <div *ngIf="!setPasswordResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ setPasswordResult.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Send TFA SMS Dialog -->
    <p-dialog 
      [(visible)]="showSendTfaSmsDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '450px'}"
      header="Send TFA SMS"
      (onHide)="closeSendTfaSmsDialog()"
    >
      <div class="auth-dialog">
        <form [formGroup]="sendTfaSmsForm" (ngSubmit)="onSendTfaSms()" class="auth-form">
          <div class="form-field">
            <label for="sendTfaSmsUserId">User ID *</label>
            <input 
              type="text" 
              id="sendTfaSmsUserId"
              formControlName="userId" 
              pInputText 
              placeholder="Enter User ID"
              [class.ng-invalid]="isSendTfaSmsFieldInvalid('userId')"
            />
            <div *ngIf="isSendTfaSmsFieldInvalid('userId')" class="error-message">
              {{ getSendTfaSmsFieldError('userId') }}
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Send SMS" 
              icon="pi pi-mobile"
              [disabled]="sendTfaSmsForm.invalid || isSendingTfaSms"
              [loading]="isSendingTfaSms"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeSendTfaSmsDialog()"
            ></button>
          </div>
        </form>

        <div *ngIf="sendTfaSmsResult" class="result-section">
          <div class="result-header" [ngClass]="sendTfaSmsResult.success ? 'success' : 'error'">
            <i [class]="sendTfaSmsResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ sendTfaSmsResult.success ? 'TFA SMS Sent!' : 'Failed to Send TFA SMS' }}</span>
          </div>
          <div class="result-details">
            <p><strong>Status:</strong> {{ sendTfaSmsResult.status }}</p>
            <p><strong>Time:</strong> {{ sendTfaSmsResult.timestamp | date:'medium' }}</p>
            <div *ngIf="!sendTfaSmsResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ sendTfaSmsResult.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- Verify TFA Code Dialog -->
    <p-dialog 
      [(visible)]="showVerifyTfaCodeDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '450px'}"
      header="Verify TFA Code"
      (onHide)="closeVerifyTfaCodeDialog()"
    >
      <div class="auth-dialog">
        <form [formGroup]="verifyTfaCodeForm" (ngSubmit)="onVerifyTfaCode()" class="auth-form">
          <div class="form-field">
            <label for="verifyTfaUserId">User ID *</label>
            <input 
              type="text" 
              id="verifyTfaUserId"
              formControlName="userId" 
              pInputText 
              placeholder="Enter User ID"
              [class.ng-invalid]="isVerifyTfaCodeFieldInvalid('userId')"
            />
            <div *ngIf="isVerifyTfaCodeFieldInvalid('userId')" class="error-message">
              {{ getVerifyTfaCodeFieldError('userId') }}
            </div>
          </div>

          <div class="form-field">
            <label for="verifyTfaCode">TFA Code *</label>
            <input 
              type="text" 
              id="verifyTfaCode"
              formControlName="Code" 
              pInputText 
              placeholder="Enter TFA Code"
              [class.ng-invalid]="isVerifyTfaCodeFieldInvalid('Code')"
            />
            <div *ngIf="isVerifyTfaCodeFieldInvalid('Code')" class="error-message">
              {{ getVerifyTfaCodeFieldError('Code') }}
            </div>
          </div>

          <div class="form-field">
            <label for="verifyTfaRemember">Remember Me</label>
            <p-checkbox 
              formControlName="RememberMe" 
              binary="true"
              label="Remember this device"
            ></p-checkbox>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Verify Code" 
              icon="pi pi-check"
              [disabled]="verifyTfaCodeForm.invalid || isVerifyingTfaCode"
              [loading]="isVerifyingTfaCode"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeVerifyTfaCodeDialog()"
            ></button>
          </div>
        </form>

        <div *ngIf="verifyTfaCodeResult" class="result-section">
          <div class="result-header" [ngClass]="verifyTfaCodeResult.success ? 'success' : 'error'">
            <i [class]="verifyTfaCodeResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ verifyTfaCodeResult.success ? 'TFA Code Verified!' : 'TFA Code Verification Failed' }}</span>
          </div>
          <div class="result-details">
            <p><strong>Status:</strong> {{ verifyTfaCodeResult.status }}</p>
            <p><strong>Time:</strong> {{ verifyTfaCodeResult.timestamp | date:'medium' }}</p>
            <div *ngIf="verifyTfaCodeResult.success && verifyTfaCodeResult.data" class="success-data">
              <h4>Verification Result:</h4>
              <pre>{{ verifyTfaCodeResult.data | json }}</pre>
            </div>
            <div *ngIf="!verifyTfaCodeResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ verifyTfaCodeResult.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>

    <!-- QR Code Dialog -->
    <p-dialog 
      [(visible)]="showQrCodeDialog" 
      [modal]="true" 
      [closable]="true"
      [style]="{width: '450px'}"
      header="Generate QR Code"
      (onHide)="closeQrCodeDialog()"
    >
      <div class="auth-dialog">
        <form [formGroup]="qrCodeForm" (ngSubmit)="onGenerateQrCode()" class="auth-form">
          <div class="form-field">
            <label for="qrCodeUserId">User ID *</label>
            <input 
              type="text" 
              id="qrCodeUserId"
              formControlName="userId" 
              pInputText 
              placeholder="Enter User ID"
              [class.ng-invalid]="isQrCodeFieldInvalid('userId')"
            />
            <div *ngIf="isQrCodeFieldInvalid('userId')" class="error-message">
              {{ getQrCodeFieldError('userId') }}
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              pButton 
              label="Generate QR Code" 
              icon="pi pi-qrcode"
              [disabled]="qrCodeForm.invalid || isGeneratingQrCode"
              [loading]="isGeneratingQrCode"
            ></button>
            <button 
              type="button" 
              pButton 
              label="Cancel" 
              icon="pi pi-times"
              class="p-button-outlined"
              (click)="closeQrCodeDialog()"
            ></button>
          </div>
        </form>

        <div *ngIf="qrCodeResult" class="result-section">
          <div class="result-header" [ngClass]="qrCodeResult.success ? 'success' : 'error'">
            <i [class]="qrCodeResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            <span>{{ qrCodeResult.success ? 'QR Code Generated!' : 'QR Code Generation Failed' }}</span>
          </div>
          <div class="result-details">
            <p><strong>Status:</strong> {{ qrCodeResult.status }}</p>
            <p><strong>Time:</strong> {{ qrCodeResult.timestamp | date:'medium' }}</p>
            <div *ngIf="qrCodeResult.success && qrCodeResult.data" class="success-data">
              <h4>QR Code Data:</h4>
              <pre>{{ qrCodeResult.data | json }}</pre>
            </div>
            <div *ngIf="!qrCodeResult.success" class="error-data">
              <h4>Error Details:</h4>
              <p><strong>Error:</strong> {{ qrCodeResult.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [`
    .api-dashboard-container {
      padding: 1rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      color: #2563eb;
      margin-bottom: 0.5rem;
    }

    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      margin-top: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
    }

    .stat-card h3 {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
      font-weight: 700;
    }

    .stat-card p {
      margin: 0;
      opacity: 0.9;
    }

    .overview-content {
      padding: 1rem 0;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      margin-top: 1rem;
    }

    .category-info {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }

    .category-description {
      font-size: 0.9rem;
      color: #6b7280;
    }

    .category-methods {
      display: flex;
      flex-wrap: wrap;
    }

    .category-endpoints {
    }

    .category-header {
      margin-bottom: 1.5rem;
    }

    .category-header h3 {
      color: #2563eb;
      margin-bottom: 0.5rem;
    }

    .endpoint-details {
      padding: 1rem 0;
    }

    .endpoint-meta {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .endpoint-path {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .endpoint-summary {
      color: #4b5563;
      margin-bottom: 1rem;
    }

    .endpoint-parameters {
      margin-bottom: 1rem;
    }

    .endpoint-parameters h5 {
      margin-bottom: 0.5rem;
      color: #374151;
    }

    .parameters-list {
      display: flex;
      flex-wrap: wrap;
    }

    .parameter-chip {
      background: #eff6ff !important;
      color: #2563eb !important;
    }

    .endpoint-actions {
      display: flex;
      flex-wrap: wrap;
    }

    .api-tester {
      max-width: 800px;
    }

    .tester-form {
      display: flex;
      flex-direction: column;
    }

    .form-row {
      display: flex;
      align-items: end;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field.flex-grow {
      flex: 1;
    }

    .form-field label {
      font-weight: 500;
      color: #374151;
    }

    .form-actions {
      display: flex;
    }

    .test-results {
    }

    .result-meta {
      display: flex;
      align-items: center;
    }

    .timestamp {
      color: #6b7280;
      font-size: 0.9rem;
    }

    .result-content {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }

    .result-data {
      background: #f9fafb;
      padding: 1rem;
      margin: 0;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9rem;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .result-error {
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .documentation {
      max-width: 800px;
    }

    .doc-content h3 {
      color: #2563eb;
      margin-top: 2rem;
    }

    .doc-content h3:first-child {
      margin-top: 0;
    }

    .code-sample {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 1rem;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9rem;
      margin: 1rem 0;
      overflow-x: auto;
    }

    /* Method-specific styling */
    :host ::ng-deep {
      .method-get { background: #22c55e !important; color: white !important; }
      .method-post { background: #3b82f6 !important; color: white !important; }
      .method-put { background: #f59e0b !important; color: white !important; }
      .method-delete { background: #ef4444 !important; color: white !important; }
      .method-patch { background: #8b5cf6 !important; color: white !important; }
    }

    /* User Management specific styles */
    .user-management-container, .authentication-container, .role-management-container, .claims-management-container, .user-role-management-container, .account-management-container, .two-factor-auth-container {
      padding: 1rem 0;
    }

    .nested-tabs {
      margin-top: 1rem;
    }

    .user-ui-interface, .auth-ui-interface, .role-ui-interface, .claims-ui-interface, .user-role-ui-interface, .account-ui-interface, .two-factor-ui-interface, .api-endpoints-interface {
      padding: 1rem 0;
    }

    .ui-description, .api-description {
      background: #f0f9ff;
      border: 1px solid #0ea5e9;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .ui-description p, .api-description p {
      margin: 0;
      color: #0c4a6e;
    }

    .ui-description i, .api-description i {
      color: #0ea5e9;
      margin-right: 0.5rem;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .feature-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      background: #fafafa;
      transition: all 0.2s ease;
    }

    .feature-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .feature-card i {
      font-size: 2rem;
      color: #3b82f6;
      margin-bottom: 1rem;
    }

    .feature-card h5 {
      color: #1f2937;
    }

    .feature-card p {
      color: #6b7280;
      font-size: 0.9rem;
    }

    .logged-in-status {
      display: flex;
      flex-direction: column;
    }

    .login-status {
      color: #10b981;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
    }

    .quick-user-actions, .quick-auth-actions, .quick-role-actions, .quick-claims-actions, .quick-user-role-actions, .quick-account-actions, .quick-two-factor-actions {
      margin-top: 1.5rem;
    }

    .quick-user-actions h4, .quick-auth-actions h4, .quick-role-actions h4, .quick-claims-actions h4, .quick-user-role-actions h4, .quick-account-actions h4, .quick-two-factor-actions h4 {
      color: #374151;
    }

    .actions-row {
      display: flex;
      flex-wrap: wrap;
    }

    .ui-features h4 {
      color: #374151;
    }

    /* Login Dialog Styles */
    .login-dialog-content {
      padding: 0.5rem 0;
    }

    .form-description {
      color: #6b7280;
      margin-bottom: 1.5rem;
      padding: 0.75rem;
      background-color: #f3f4f6;
      border-radius: 0.5rem;
      border-left: 4px solid #3b82f6;
    }

    .form-description code {
      background-color: #1f2937;
      color: #60a5fa;
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-family: 'Courier New', monospace;
    }

    .login-form {
      padding: 1rem 0;
    }

    .form-row {
      display: flex;
      flex-direction: column;
      margin-bottom: 1.5rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field label {
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-field input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-field input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-field input.ng-invalid {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-start;
    }

    .login-result {
      margin-top: 1.5rem;
    }

    .result-container {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
    }

    .result-container.success {
      border-color: #10b981;
      background-color: #ecfdf5;
    }

    .result-container.error {
      border-color: #ef4444;
      background-color: #fef2f2;
    }

    .result-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .result-header i {
      font-size: 1.25rem;
    }

    .result-container.success .result-header i {
      color: #10b981;
    }

    .result-container.error .result-header i {
      color: #ef4444;
    }

    .result-details h6 {
      margin: 0 0 0.5rem 0;
      color: #374151;
      font-size: 0.875rem;
    }

    .result-details pre {
      background-color: #f3f4f6;
      padding: 1rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #d1d5db;
    }

    .result-details small {
      color: #6b7280;
      font-size: 0.75rem;
    }

    .error-debugging {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 0.375rem;
    }

    .debug-item {
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .debug-item strong {
      color: #374151;
    }

    .validation-errors {
      background-color: #fff5f5;
      border: 1px solid #fed7d7;
      margin-top: 0.5rem;
      font-size: 0.75rem;
      max-height: 150px;
    }

    /* Registration Dialog Styles */
    .register-form, .password-reset-form, .confirm-email-form, .refresh-token-form {
      display: flex;
      flex-direction: column;
    }

    .register-form .form-field, .password-reset-form .form-field, .confirm-email-form .form-field, .refresh-token-form .form-field, .auth-form .form-field {
      display: flex;
      flex-direction: column;
    }

    .register-form input, .password-reset-form input, .confirm-email-form input, .refresh-token-form input, .auth-form input {
      border: 1px solid #d1d5db;
    }

    .register-form input:focus, .password-reset-form input:focus, .confirm-email-form input:focus, .refresh-token-form input:focus, .auth-form input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .register-form input.ng-invalid.ng-touched, .password-reset-form input.ng-invalid.ng-touched, .confirm-email-form input.ng-invalid.ng-touched, .refresh-token-form input.ng-invalid.ng-touched, .auth-form input.ng-invalid.ng-touched {
      border-color: #ef4444;
    }

    .register-form .form-actions, .password-reset-form .form-actions, .confirm-email-form .form-actions, .refresh-token-form .form-actions, .auth-form .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .dashboard-stats {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
      
      .category-grid {
        grid-template-columns: 1fr;
      }

      .feature-grid {
        grid-template-columns: 1fr;
      }
      
      .form-row {
        flex-direction: column;
        align-items: stretch;
      }

      .form-actions {
        flex-direction: column;
      }
      
      .endpoint-meta {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .quick-actions, .actions-row {
        flex-direction: column;
      }
    }
  `]
})
export class ApiDashboardComponent implements OnInit {
  endpoints: ApiEndpointInfo[] = API_ENDPOINTS_INFO;
  
  // Form properties
  loginForm: FormGroup;
  isLoggingIn = false;
  loginResult: any = null;
  showLoginDialog = false;
  
  // Registration form properties
  registerForm: FormGroup;
  isRegistering = false;
  registerResult: any = null;
  showRegisterDialog = false;

  // Password reset form properties
  passwordResetForm: FormGroup;
  isResettingPassword = false;
  passwordResetResult: any = null;
  showPasswordResetDialog = false;

  // Confirm Email form properties
  confirmEmailForm: FormGroup;
  isConfirmingEmail = false;
  confirmEmailResult: any = null;
  showConfirmEmailDialog = false;

  // Refresh Token form properties
  refreshTokenForm: FormGroup;
  isRefreshingToken = false;
  refreshTokenResult: any = null;
  showRefreshTokenDialog = false;

  // Authentication endpoints form properties
  authLoginForm: FormGroup;
  isAuthLoggingIn = false;
  authLoginResult: any = null;
  showAuthLoginDialog = false;

  authLogoutForm: FormGroup;
  isAuthLoggingOut = false;
  authLogoutResult: any = null;
  showAuthLogoutDialog = false;

  isAuthenticatedForm: FormGroup;
  isCheckingAuthentication = false;
  isAuthenticatedResult: any = null;
  showIsAuthenticatedDialog = false;

  forgotPasswordForm: FormGroup;
  isSendingForgotPassword = false;
  forgotPasswordResult: any = null;
  showForgotPasswordDialog = false;

  resendVerificationEmailForm: FormGroup;
  isResendingVerificationEmail = false;
  resendVerificationEmailResult: any = null;
  showResendVerificationEmailDialog = false;

  setTfaForm: FormGroup;
  isSettingTfa = false;
  setTfaResult: any = null;
  showSetTfaDialog = false;

  setPasswordForm: FormGroup;
  isSettingPassword = false;
  setPasswordResult: any = null;
  showSetPasswordDialog = false;

  sendTfaSmsForm: FormGroup;
  isSendingTfaSms = false;
  sendTfaSmsResult: any = null;
  showSendTfaSmsDialog = false;

  verifyTfaCodeForm: FormGroup;
  isVerifyingTfaCode = false;
  verifyTfaCodeResult: any = null;
  showVerifyTfaCodeDialog = false;

  qrCodeForm: FormGroup;
  isGeneratingQrCode = false;
  qrCodeResult: any = null;
  showQrCodeDialog = false;
  
  testPayload: TestPayload = {
    endpoint: '',
    method: 'GET',
    body: ''
  };

  headersJson = '{"Content-Type": "application/json"}';
  isTestingEndpoint = false;
  lastTestResult: EndpointTestResult | null = null;

  httpMethods = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
    { label: 'PATCH', value: 'PATCH' }
  ];

  sampleResponse = `{
  "success": true,
  "data": { ... },
  "message": null,
  "errors": null,
  "statusCode": 200,
  "timestamp": "2025-01-20T10:30:00Z"
}`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });

    this.passwordResetForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordResetMatchValidator 
    });

    this.confirmEmailForm = this.fb.group({
      userId: ['', [Validators.required]],
      code: ['', [Validators.required]]
    });

    this.refreshTokenForm = this.fb.group({
      userId: ['', [Validators.required]]
    });

    // Authentication endpoints forms initialization
    this.authLoginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      deviceCode: ['', [Validators.required]]
    });

    this.authLogoutForm = this.fb.group({
      // No fields required for logout
    });

    this.isAuthenticatedForm = this.fb.group({
      // No fields required for authentication check
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resendVerificationEmailForm = this.fb.group({
      userId: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.setTfaForm = this.fb.group({
      userId: ['', [Validators.required]],
      isEnabled: [false, [Validators.required]]
    });

    this.setPasswordForm = this.fb.group({
      userId: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });

    this.sendTfaSmsForm = this.fb.group({
      userId: ['', [Validators.required]]
    });

    this.verifyTfaCodeForm = this.fb.group({
      userId: ['', [Validators.required]],
      Code: ['', [Validators.required]],
      RememberMe: [false]
    });

    this.qrCodeForm = this.fb.group({
      userId: ['', [Validators.required]]
    });
  }

  // Password match validator for registration form
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  // Password match validator for password reset form
  passwordResetMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  ngOnInit(): void {
    // Initialize with a sample endpoint for testing
    this.testPayload.endpoint = '/api/manage/userInfo';
    this.testPayload.method = 'GET';
  }

  // Cookie management methods
  setCookie(name: string, value: string, days: number = 7): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  }

  getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  getTotalEndpointsCount(): number {
    return this.endpoints.length;
  }

  getCategoriesCount(): number {
    return this.getUniqueCategories().length;
  }

  getAuthRequiredCount(): number {
    return this.endpoints.filter(e => e.requiresAuth).length;
  }

  getMethodCount(method: string): number {
    return this.endpoints.filter(e => e.method === method).length;
  }

  getUniqueCategories(): string[] {
    return [...new Set(this.endpoints.map(e => e.category))];
  }

  getCategories() {
    const categories = this.getUniqueCategories().map(category => {
      const categoryEndpoints = this.endpoints.filter(e => e.category === category);
      const methods = [...new Set(categoryEndpoints.map(e => e.method))];
      
      return {
        name: category,
        count: categoryEndpoints.length,
        methods: methods,
        description: this.getCategoryDescription(category)
      };
    });

    return categories;
  }

  getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
      [API_CATEGORIES.AUTHENTICATION]: 'User login, registration, and token management',
      [API_CATEGORIES.USER_MANAGEMENT]: 'Create, read, update, and delete user accounts',
      [API_CATEGORIES.ROLE_MANAGEMENT]: 'Manage user roles and permissions',
      [API_CATEGORIES.CLAIMS_MANAGEMENT]: 'Handle user and role claims',
      [API_CATEGORIES.USER_ROLE_MANAGEMENT]: 'Assign and manage user-role relationships',
      [API_CATEGORIES.ACCOUNT_MANAGEMENT]: 'User profile and account settings',
      [API_CATEGORIES.TWO_FACTOR_AUTH]: 'Two-factor authentication setup and management'
    };

    return descriptions[category] || 'API endpoints for various operations';
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      [API_CATEGORIES.AUTHENTICATION]: 'pi pi-shield',
      [API_CATEGORIES.USER_MANAGEMENT]: 'pi pi-users',
      [API_CATEGORIES.ROLE_MANAGEMENT]: 'pi pi-key',
      [API_CATEGORIES.CLAIMS_MANAGEMENT]: 'pi pi-tags',
      [API_CATEGORIES.USER_ROLE_MANAGEMENT]: 'pi pi-link',
      [API_CATEGORIES.ACCOUNT_MANAGEMENT]: 'pi pi-user',
      [API_CATEGORIES.TWO_FACTOR_AUTH]: 'pi pi-mobile'
    };

    return icons[category] || 'pi pi-cog';
  }

  getEndpointsByCategory(category: string): ApiEndpointInfo[] {
    return this.endpoints.filter(e => e.category === category);
  }

  getAccordionHeader(endpoint: ApiEndpointInfo): string {
    return `${endpoint.method} ${endpoint.endpoint}`;
  }

  openEndpointTester(endpoint: string, method: string): void {
    this.testPayload.endpoint = endpoint;
    this.testPayload.method = method;
    
    // Switch to API Tester tab
    // This would need to be implemented based on your tab switching mechanism
  }

  copyCurlCommand(endpoint: ApiEndpointInfo): void {
    const baseUrl = 'http://localhost:7136';
    const headers = JSON.parse(this.headersJson || '{}');
    
    let curlCommand = `curl -X ${endpoint.method} "${baseUrl}${endpoint.endpoint}"`;
    
    Object.entries(headers).forEach(([key, value]) => {
      curlCommand += ` -H "${key}: ${value}"`;
    });

    if (endpoint.method !== 'GET' && this.testPayload.body) {
      curlCommand += ` -d '${this.testPayload.body}'`;
    }

    navigator.clipboard.writeText(curlCommand).then(() => {
      // Show success message
      console.log('cURL command copied to clipboard');
    });
  }

  showRequestBody(): boolean {
    return ['POST', 'PUT', 'PATCH'].includes(this.testPayload.method);
  }

  sendTestRequest(): void {
    this.isTestingEndpoint = true;
    
    // Simulate API call (replace with actual HTTP client call)
    setTimeout(() => {
      const mockResult: EndpointTestResult = {
        success: true,
        status: 200,
        data: {
          message: 'This is a simulated response',
          endpoint: this.testPayload.endpoint,
          method: this.testPayload.method,
          note: 'Connect to real API for actual testing'
        },
        timestamp: new Date()
      };

      this.lastTestResult = mockResult;
      this.isTestingEndpoint = false;
    }, 1500);
  }

  clearTestForm(): void {
    this.testPayload = {
      endpoint: '',
      method: 'GET',
      body: ''
    };
    this.headersJson = '{"Content-Type": "application/json"}';
    this.lastTestResult = null;
  }

  getStatusSeverity(status: number): string {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'danger';
    return 'info';
  }

  formatJsonResponse(data: any): string {
    if (!data) return '';
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return data.toString();
    }
  }

  // User Management UI methods
  openUserManagementUI(action: string): void {
    console.log(`Opening User Management UI for action: ${action}`);
    // Here you would navigate to specific user management pages
    // For now, just log the action
    switch (action) {
      case 'list':
        console.log('Navigate to user list view');
        break;
      case 'create':
        console.log('Navigate to create user form');
        break;
      case 'reports':
        console.log('Navigate to user reports');
        break;
      case 'import':
        console.log('Navigate to import users');
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  // View endpoint schema method
  viewEndpointSchema(endpoint: ApiEndpointInfo): void {
    console.log('Viewing schema for endpoint:', endpoint);
    // Here you would show a modal or navigate to schema view
    // For now, just log the endpoint details
    alert(`Schema information for ${endpoint.method} ${endpoint.endpoint}\n\nSummary: ${endpoint.summary}\n\nThis would normally show detailed request/response schemas.`);
  }

  // Authentication UI methods
  openAuthenticationUI(action: string): void {
    console.log(`Opening Authentication UI for action: ${action}`);
    // Here you would navigate to specific authentication pages
    // For now, just log the action
    switch (action) {
      case 'login':
        this.openLoginDialog();
        break;
      case 'register':
        this.openRegisterDialog();
        break;
      case 'reset':
        this.openPasswordResetDialog();
        break;
      case 'tokens':
        console.log('Navigate to token management');
        break;
      case 'validate':
        console.log('Check current token validity');
        break;
      case 'logout':
        console.log('Perform logout');
        break;
      case 'profile':
        console.log('Navigate to user profile');
        break;
      default:
        console.log('Unknown authentication action:', action);
    }
  }

  // Role Management UI methods
  openRoleManagementUI(action: string): void {
    console.log(`Opening Role Management UI for action: ${action}`);
    // Here you would navigate to specific role management pages
    // For now, just log the action
    switch (action) {
      case 'list':
        console.log('Navigate to role list view');
        break;
      case 'create':
        console.log('Navigate to create role form');
        break;
      case 'edit':
        console.log('Navigate to edit role form');
        break;
      case 'assignments':
        console.log('Navigate to role assignment management');
        break;
      case 'stats':
        console.log('Navigate to role statistics');
        break;
      case 'export':
        console.log('Export roles data');
        break;
      default:
        console.log('Unknown role management action:', action);
    }
  }

  openClaimsManagementUI(action: string): void {
    console.log(`Opening Claims Management UI for action: ${action}`);
    // Here you would navigate to specific claims management pages
    // For now, just log the action
    switch (action) {
      case 'list':
        console.log('Navigate to claims list view');
        break;
      case 'create':
        console.log('Navigate to create claim form');
        break;
      case 'edit':
        console.log('Navigate to edit claim form');
        break;
      case 'validate':
        console.log('Navigate to claim validation');
        break;
      case 'reports':
        console.log('Navigate to claims reports');
        break;
      default:
        console.log('Unknown claims management action:', action);
    }
  }

  // User Role Management UI methods
  openUserRoleManagementUI(action: string): void {
    console.log(`Opening User Role Management UI for action: ${action}`);
    // Here you would navigate to specific user role management pages
    // For now, just log the action
    switch (action) {
      case 'user-roles':
        console.log('Navigate to user roles management');
        break;
      case 'assign':
        console.log('Navigate to role assignment interface');
        break;
      case 'overview':
        console.log('Navigate to role assignments overview');
        break;
      case 'analytics':
        console.log('Navigate to role analytics and statistics');
        break;
      case 'list':
        console.log('Navigate to user role list view');
        break;
      case 'reports':
        console.log('Navigate to user role reports');
        break;
      case 'bulk':
        console.log('Navigate to bulk role operations');
        break;
      default:
        console.log('Unknown user role management action:', action);
    }
  }

  // Account Management UI methods
  openAccountManagementUI(action: string): void {
    console.log(`Opening Account Management UI for action: ${action}`);
    // Here you would navigate to specific account management pages
    // For now, just log the action
    switch (action) {
      case 'profile':
        console.log('Navigate to profile management');
        break;
      case 'password':
        console.log('Navigate to password change interface');
        break;
      case 'email':
        console.log('Navigate to email verification settings');
        break;
      case 'settings':
        console.log('Navigate to account settings');
        break;
      case 'view-profile':
        console.log('Navigate to view profile page');
        break;
      case 'change-password':
        console.log('Navigate to change password form');
        break;
      case 'verify-email':
        console.log('Navigate to email verification');
        break;
      case 'security':
        console.log('Navigate to security settings');
        break;
      default:
        console.log('Unknown account management action:', action);
    }
  }

  openTwoFactorAuthUI(action: string): void {
    console.log(`Opening Two-Factor Authentication UI for action: ${action}`);
    // Here you would navigate to specific TFA pages
    // For now, just log the action
    switch (action) {
      case 'setup':
        console.log('Navigate to authenticator setup');
        break;
      case 'manage':
        console.log('Navigate to TFA management interface');
        break;
      case 'reset':
        console.log('Navigate to reset authenticator');
        break;
      case 'recovery':
        console.log('Navigate to recovery codes management');
        break;
      case 'status':
        console.log('Navigate to TFA status check');
        break;
      case 'enable':
        console.log('Navigate to enable TFA');
        break;
      case 'disable':
        console.log('Navigate to disable TFA');
        break;
      case 'generate-codes':
        console.log('Navigate to generate recovery codes');
        break;
      default:
        console.log('Unknown two-factor authentication action:', action);
    }
  }

  openLoginDialog(): void {
    this.showLoginDialog = true;
    this.loginForm.reset();
    this.loginResult = null;
  }

  closeLoginDialog(): void {
    this.showLoginDialog = false;
    this.loginForm.reset();
    this.loginResult = null;
  }

  // Registration dialog methods
  openRegisterDialog(): void {
    this.showRegisterDialog = true;
    this.registerForm.reset();
    this.registerResult = null;
  }

  closeRegisterDialog(): void {
    this.showRegisterDialog = false;
    this.registerForm.reset();
    this.registerResult = null;
  }

  openPasswordResetDialog(): void {
    this.showPasswordResetDialog = true;
    this.passwordResetForm.reset();
    this.passwordResetResult = null;
  }

  closePasswordResetDialog(): void {
    this.showPasswordResetDialog = false;
    this.passwordResetForm.reset();
    this.passwordResetResult = null;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoggingIn = true;
    this.loginResult = null;

    const loginData = {
      userName: this.loginForm.get('userName')?.value,
      password: this.loginForm.get('password')?.value,
      deviceCode: '0'
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Sending login request:', loginData);

    // Call the /api/Authorize/token endpoint
    this.http.post('http://localhost:7136/api/Authorize/token', loginData, { headers, observe: 'response' })
      .subscribe({
        next: (response) => {
          this.isLoggingIn = false;
          
          // Extract access_token from response and save to cookies
          const responseData = response.body as any;
          if (responseData && responseData.access_token) {
            this.setCookie('access_token', responseData.access_token, 7); // Save for 7 days
            console.log('Access token saved to cookies');
          }
          
          this.loginResult = {
            success: true,
            status: response.status,
            data: response.body,
            timestamp: new Date()
          };
          console.log('Login successful:', response.body);
        },
        error: (error) => {
          this.isLoggingIn = false;
          console.error('Login error details:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error body:', error.error);
          
          this.loginResult = {
            success: false,
            status: error.status || 500,
            error: error.error?.message || error.error?.title || error.message || 'Login failed',
            timestamp: new Date(),
            fullError: error.error // Add full error details for debugging
          };
        }
      });
  }

  logout(): void {
    // Clear the access_token from cookies
    this.deleteCookie('access_token');
    console.log('User logged out, access token cleared from cookies');
    
    // Reset login form and result
    this.loginForm.reset();
    this.loginResult = null;
    this.showLoginDialog = false;
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isRegistering = true;
    this.registerResult = null;

    const registerData = {
      userName: this.registerForm.get('userName')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      confirmPassword: this.registerForm.get('confirmPassword')?.value
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Sending registration request:', registerData);

    // Call the /api/Authorize/register endpoint
    this.http.post('http://localhost:7136/api/Authorize/register', registerData, { headers, observe: 'response' })
      .subscribe({
        next: (response) => {
          this.isRegistering = false;
          this.registerResult = {
            success: true,
            status: response.status,
            data: response.body,
            timestamp: new Date()
          };
          console.log('Registration successful:', response.body);
        },
        error: (error) => {
          this.isRegistering = false;
          console.error('Registration error details:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error body:', error.error);
          
          this.registerResult = {
            success: false,
            status: error.status || 500,
            error: error.error?.message || error.error?.title || error.message || 'Registration failed',
            timestamp: new Date(),
            fullError: error.error // Add full error details for debugging
          };
        }
      });
  }

  onPasswordReset(): void {
    if (this.passwordResetForm.invalid) {
      this.passwordResetForm.markAllAsTouched();
      return;
    }

    this.isResettingPassword = true;
    this.passwordResetResult = null;

    const passwordResetData = {
      oldPassword: this.passwordResetForm.get('oldPassword')?.value,
      newPassword: this.passwordResetForm.get('newPassword')?.value,
      confirmPassword: this.passwordResetForm.get('confirmPassword')?.value,
      statusMessage: "Password reset request"
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Sending password reset request:', passwordResetData);

    // Call the /api/manage/changePassword endpoint
    this.http.post('http://localhost:7136/api/manage/changePassword', passwordResetData, { headers, observe: 'response' })
      .subscribe({
        next: (response) => {
          this.isResettingPassword = false;
          this.passwordResetResult = {
            success: true,
            status: response.status,
            data: response.body,
            timestamp: new Date()
          };
          console.log('Password reset successful:', response.body);
        },
        error: (error) => {
          this.isResettingPassword = false;
          console.error('Password reset error details:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error body:', error.error);
          
          this.passwordResetResult = {
            success: false,
            status: error.status || 500,
            error: error.error?.message || error.error?.title || error.message || 'Password reset failed',
            timestamp: new Date(),
            fullError: error.error // Add full error details for debugging
          };
        }
      });
  }

  // Check if user is logged in by checking for access_token in cookies
  isLoggedIn(): boolean {
    return this.getCookie('access_token') !== null;
  }

  // Get the current access token from cookies
  getAccessToken(): string | null {
    return this.getCookie('access_token');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  // Registration form validation methods
  isRegisterFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getRegisterFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }

  isPasswordResetFieldInvalid(fieldName: string): boolean {
    const field = this.passwordResetForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getPasswordResetFieldError(fieldName: string): string {
    const field = this.passwordResetForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        const fieldLabels: { [key: string]: string } = {
          'oldPassword': 'Current password',
          'newPassword': 'New password',
          'confirmPassword': 'Confirm password'
        };
        return `${fieldLabels[fieldName] || fieldName} is required`;
      }
      if (field.errors['minlength']) {
        return `New password must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['passwordMismatch']) {
        return 'New passwords do not match';
      }
    }
    return '';
  }

  // Quick Actions authentication handlers
  handleConfirmEmail(): void {
    console.log('Confirm Email clicked');
    this.showConfirmEmailDialog = true;
    this.confirmEmailResult = null;
    this.confirmEmailForm.reset();
  }

  handleRefreshToken(): void {
    console.log('Refresh Token clicked');
    this.openRefreshTokenDialog();
  }

  handleLogin(): void {
    console.log('Login clicked');
    this.openAuthLoginDialog();
  }

  handleLogout(): void {
    console.log('Logout clicked');
    this.openAuthLogoutDialog();
  }

  handleIsAuthenticated(): void {
    console.log('Is Authenticated clicked');
    this.openIsAuthenticatedDialog();
  }

  handleForgotPassword(): void {
    console.log('Forgot Password clicked');
    this.openForgotPasswordDialog();
  }

  handleResendVerificationEmail(): void {
    console.log('Resend Verification Email clicked');
    this.openResendVerificationEmailDialog();
  }

  handleSetTfa(): void {
    console.log('Set TFA clicked');
    this.openSetTfaDialog();
  }

  handleSetPassword(): void {
    console.log('Set Password clicked');
    this.openSetPasswordDialog();
  }

  handleSendTfaSMS(): void {
    console.log('Send TFA SMS clicked');
    this.openSendTfaSmsDialog();
  }

  handleVerifyTFACode(): void {
    console.log('Verify TFA Code clicked');
    this.openVerifyTfaCodeDialog();
  }

  handleQRCode(): void {
    console.log('QR Code clicked');
    this.openQrCodeDialog();
    alert('QR Code functionality - Implementation pending');
  }

  // Confirm Email Dialog Methods
  openConfirmEmailDialog(): void {
    this.showConfirmEmailDialog = true;
    this.confirmEmailResult = null;
    this.confirmEmailForm.reset();
  }

  closeConfirmEmailDialog(): void {
    this.showConfirmEmailDialog = false;
    this.confirmEmailResult = null;
  }

  onConfirmEmail(): void {
    if (this.confirmEmailForm.invalid) {
      return;
    }

    this.isConfirmingEmail = true;
    this.confirmEmailResult = null;

    const confirmEmailData = {
      userId: this.confirmEmailForm.get('userId')?.value,
      code: this.confirmEmailForm.get('code')?.value
    };

    console.log('Sending confirm email request:', confirmEmailData);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJpeXlhbmFybXNlY0BnbWFpbC5jb20iLCJqdGkiOiI4ZDViNTIwMi03Nzg0LTQ3NTQtODFjOS1iZGFmMzk4MDYwZjQiLCJlbWFpbCI6Iml5eWFuYXJtc2VjQGdtYWlsLmNvbSIsImlzcyI6IkhhZHZpZGEgSW5jIiwidWlkIjoiNzQ1ODBmOGQtYzVhYi00ZmEzLTgzYzgtMTkxNWU4ZjIwMDY0IiwiaXAiOiIxOTIuMTY4LjI5LjE1MSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6Iml5eWFuYXJtc2VjQGdtYWlsLmNvbSIsInJvbGVzIjoiQ2hvcnVzIFNpdGUgQWRtaW4iLCJleHAiOjE3NTg0NTIxMTJ9.'
    });

    this.http.post('http://localhost:7136/api/authorize/confirmEmail', confirmEmailData, { 
      headers, 
      observe: 'response',
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        this.isConfirmingEmail = false;
        console.log('Confirm email successful:', response.body);
        this.confirmEmailResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isConfirmingEmail = false;
        console.error('Confirm email error details:', error);
        this.confirmEmailResult = {
          success: false,
          status: error.status || 0,
          error: error.error?.message || error.error?.title || error.message || 'Email confirmation failed',
          fullError: error,
          timestamp: new Date()
        };
      }
    });
  }

  isConfirmEmailFieldInvalid(fieldName: string): boolean {
    const field = this.confirmEmailForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getConfirmEmailFieldError(fieldName: string): string {
    const field = this.confirmEmailForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        const fieldLabels: { [key: string]: string } = {
          'userId': 'User ID',
          'code': 'Confirmation code'
        };
        return `${fieldLabels[fieldName] || fieldName} is required`;
      }
    }
    return '';
  }

  // Refresh Token Dialog Methods
  openRefreshTokenDialog(): void {
    this.showRefreshTokenDialog = true;
    this.refreshTokenResult = null;
    this.refreshTokenForm.reset();
  }

  closeRefreshTokenDialog(): void {
    this.showRefreshTokenDialog = false;
    this.refreshTokenResult = null;
    this.refreshTokenForm.reset();
  }

  onRefreshToken(): void {
    if (this.refreshTokenForm.invalid) {
      return;
    }

    this.isRefreshingToken = true;
    this.refreshTokenResult = null;

    const userId = this.refreshTokenForm.get('userId')?.value;
    const refreshTokenUrl = `http://localhost:7136/api/authorize/refresh-token/${userId}`;

    console.log('Sending refresh token request for userId:', userId);

    const httpOptions = {
      headers: {
        'accept': 'text/plain'
      },
      observe: 'response' as const
    };

    this.http.post(refreshTokenUrl, '', httpOptions).subscribe({
      next: (response) => {
        this.isRefreshingToken = false;
        console.log('Refresh token successful:', response.body);
        
        this.refreshTokenResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isRefreshingToken = false;
        console.error('Refresh token error details:', error);
        
        this.refreshTokenResult = {
          success: false,
          status: error.status,
          error: error.error || error.message,
          fullError: error,
          timestamp: new Date()
        };
      }
    });
  }

  isRefreshTokenFieldInvalid(fieldName: string): boolean {
    const field = this.refreshTokenForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getRefreshTokenFieldError(fieldName: string): string {
    const field = this.refreshTokenForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        const fieldLabels: { [key: string]: string } = {
          'userId': 'User ID'
        };
        return `${fieldLabels[fieldName] || fieldName} is required`;
      }
    }
    return '';
  }

  // Authentication Login Dialog Methods
  openAuthLoginDialog(): void {
    this.showAuthLoginDialog = true;
    this.authLoginResult = null;
    this.authLoginForm.reset();
  }

  closeAuthLoginDialog(): void {
    this.showAuthLoginDialog = false;
    this.authLoginResult = null;
    this.authLoginForm.reset();
  }

  onAuthLogin(): void {
    if (this.authLoginForm.invalid) return;

    this.isAuthLoggingIn = true;
    this.authLoginResult = null;

    const loginData = {
      userName: this.authLoginForm.get('userName')?.value,
      password: this.authLoginForm.get('password')?.value,
      deviceCode: this.authLoginForm.get('deviceCode')?.value
    };

    const httpOptions = {
      headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
      observe: 'response' as const
    };

    this.http.post('http://localhost:7136/api/authorize/login', loginData, httpOptions).subscribe({
      next: (response) => {
        this.isAuthLoggingIn = false;
        this.authLoginResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isAuthLoggingIn = false;
        this.authLoginResult = {
          success: false,
          status: error.status,
          error: error.error || error.message,
          fullError: error,
          timestamp: new Date()
        };
      }
    });
  }

  isAuthLoginFieldInvalid(fieldName: string): boolean {
    const field = this.authLoginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getAuthLoginFieldError(fieldName: string): string {
    const field = this.authLoginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        const fieldLabels: { [key: string]: string } = {
          'userName': 'User Name',
          'password': 'Password',
          'deviceCode': 'Device Code'
        };
        return `${fieldLabels[fieldName] || fieldName} is required`;
      }
    }
    return '';
  }

  // Authentication Logout Dialog Methods
  openAuthLogoutDialog(): void {
    this.showAuthLogoutDialog = true;
    this.authLogoutResult = null;
  }

  closeAuthLogoutDialog(): void {
    this.showAuthLogoutDialog = false;
    this.authLogoutResult = null;
  }

  onAuthLogout(): void {
    this.isAuthLoggingOut = true;
    this.authLogoutResult = null;

    const httpOptions = {
      headers: { 'accept': '*/*' },
      observe: 'response' as const
    };

    this.http.post('http://localhost:7136/api/authorize/logout', '', httpOptions).subscribe({
      next: (response) => {
        this.isAuthLoggingOut = false;
        this.authLogoutResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isAuthLoggingOut = false;
        this.authLogoutResult = {
          success: false,
          status: error.status,
          error: error.error || error.message,
          timestamp: new Date()
        };
      }
    });
  }

  // Is Authenticated Dialog Methods
  openIsAuthenticatedDialog(): void {
    this.showIsAuthenticatedDialog = true;
    this.isAuthenticatedResult = null;
  }

  closeIsAuthenticatedDialog(): void {
    this.showIsAuthenticatedDialog = false;
    this.isAuthenticatedResult = null;
  }

  onIsAuthenticated(): void {
    this.isCheckingAuthentication = true;
    this.isAuthenticatedResult = null;

    const httpOptions = {
      headers: { 'accept': '*/*' },
      observe: 'response' as const
    };

    this.http.get('http://localhost:7136/api/authorize/isauthenticated', httpOptions).subscribe({
      next: (response) => {
        this.isCheckingAuthentication = false;
        this.isAuthenticatedResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isCheckingAuthentication = false;
        this.isAuthenticatedResult = {
          success: false,
          status: error.status,
          error: error.error || error.message,
          timestamp: new Date()
        };
      }
    });
  }

  // Forgot Password Dialog Methods
  openForgotPasswordDialog(): void {
    this.showForgotPasswordDialog = true;
    this.forgotPasswordResult = null;
    this.forgotPasswordForm.reset();
  }

  closeForgotPasswordDialog(): void {
    this.showForgotPasswordDialog = false;
    this.forgotPasswordResult = null;
    this.forgotPasswordForm.reset();
  }

  onForgotPassword(): void {
    if (this.forgotPasswordForm.invalid) return;

    this.isSendingForgotPassword = true;
    this.forgotPasswordResult = null;

    const email = this.forgotPasswordForm.get('email')?.value;
    const forgotPasswordUrl = `http://localhost:7136/api/authorize/forgotPassword?email=${encodeURIComponent(email)}`;

    const httpOptions = {
      headers: { 'accept': '*/*' },
      observe: 'response' as const
    };

    this.http.post(forgotPasswordUrl, '', httpOptions).subscribe({
      next: (response) => {
        this.isSendingForgotPassword = false;
        this.forgotPasswordResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isSendingForgotPassword = false;
        this.forgotPasswordResult = {
          success: false,
          status: error.status,
          error: error.error || error.message,
          timestamp: new Date()
        };
      }
    });
  }

  isForgotPasswordFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getForgotPasswordFieldError(fieldName: string): string {
    const field = this.forgotPasswordForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Email is required';
      if (field.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }

  // Resend Verification Email Dialog Methods
  openResendVerificationEmailDialog(): void {
    this.showResendVerificationEmailDialog = true;
    this.resendVerificationEmailResult = null;
    this.resendVerificationEmailForm.reset();
  }

  closeResendVerificationEmailDialog(): void {
    this.showResendVerificationEmailDialog = false;
    this.resendVerificationEmailResult = null;
    this.resendVerificationEmailForm.reset();
  }

  onResendVerificationEmail(): void {
    if (this.resendVerificationEmailForm.invalid) return;

    this.isResendingVerificationEmail = true;
    this.resendVerificationEmailResult = null;

    const payload = {
      userId: this.resendVerificationEmailForm.get('userId')?.value,
      lastName: this.resendVerificationEmailForm.get('lastName')?.value,
      email: this.resendVerificationEmailForm.get('email')?.value
    };

    const httpOptions = {
      headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
      observe: 'response' as const
    };

    this.http.post('http://localhost:7136/api/authorize/resendVerificationEmail', payload, httpOptions).subscribe({
      next: (response) => {
        this.isResendingVerificationEmail = false;
        this.resendVerificationEmailResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isResendingVerificationEmail = false;
        this.resendVerificationEmailResult = {
          success: false,
          status: error.status,
          error: error.error || error.message,
          timestamp: new Date()
        };
      }
    });
  }

  isResendVerificationEmailFieldInvalid(fieldName: string): boolean {
    const field = this.resendVerificationEmailForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getResendVerificationEmailFieldError(fieldName: string): string {
    const field = this.resendVerificationEmailForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        const fieldLabels: { [key: string]: string } = {
          'userId': 'User ID',
          'lastName': 'Last Name',
          'email': 'Email'
        };
        return `${fieldLabels[fieldName] || fieldName} is required`;
      }
      if (field.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }

  // Set TFA Dialog Methods
  openSetTfaDialog(): void {
    this.showSetTfaDialog = true;
    this.setTfaResult = null;
    this.setTfaForm.reset();
  }

  closeSetTfaDialog(): void {
    this.showSetTfaDialog = false;
    this.setTfaResult = null;
    this.setTfaForm.reset();
  }

  onSetTfa(): void {
    if (this.setTfaForm.invalid) return;

    this.isSettingTfa = true;
    this.setTfaResult = null;

    const userId = this.setTfaForm.get('userId')?.value;
    const isEnabled = this.setTfaForm.get('isEnabled')?.value;
    const setTfaUrl = `http://localhost:7136/api/authorize/settfa/${userId}?isEnabled=${isEnabled}`;

    const httpOptions = {
      headers: { 'accept': '*/*' },
      observe: 'response' as const
    };

    this.http.post(setTfaUrl, '', httpOptions).subscribe({
      next: (response) => {
        this.isSettingTfa = false;
        this.setTfaResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isSettingTfa = false;
        this.setTfaResult = {
          success: false,
          status: error.status,
          error: error.error || error.message,
          timestamp: new Date()
        };
      }
    });
  }

  isSetTfaFieldInvalid(fieldName: string): boolean {
    const field = this.setTfaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getSetTfaFieldError(fieldName: string): string {
    const field = this.setTfaForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'User ID is required';
    }
    return '';
  }

  // Set Password Dialog Methods
  openSetPasswordDialog(): void {
    this.showSetPasswordDialog = true;
    this.setPasswordResult = null;
    this.setPasswordForm.reset();
  }

  closeSetPasswordDialog(): void {
    this.showSetPasswordDialog = false;
    this.setPasswordResult = null;
    this.setPasswordForm.reset();
  }

  onSetPassword(): void {
    if (this.setPasswordForm.invalid) return;

    this.isSettingPassword = true;
    this.setPasswordResult = null;

    const payload = {
      userId: this.setPasswordForm.get('userId')?.value,
      Password: this.setPasswordForm.get('Password')?.value,
      ConfirmPassword: this.setPasswordForm.get('ConfirmPassword')?.value
    };

    const httpOptions = {
      headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
      observe: 'response' as const
    };

    this.http.post('http://localhost:7136/api/authorize/setpassword', payload, httpOptions).subscribe({
      next: (response) => {
        this.isSettingPassword = false;
        this.setPasswordResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isSettingPassword = false;
        this.setPasswordResult = {
          success: false,
          status: error.status,
          error: error.error || error.message,
          timestamp: new Date()
        };
      }
    });
  }

  isSetPasswordFieldInvalid(fieldName: string): boolean {
    const field = this.setPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getSetPasswordFieldError(fieldName: string): string {
    const field = this.setPasswordForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        const fieldLabels: { [key: string]: string } = {
          'userId': 'User ID',
          'Password': 'Password',
          'ConfirmPassword': 'Confirm Password'
        };
        return `${fieldLabels[fieldName] || fieldName} is required`;
      }
      if (field.errors['minlength']) return 'Password must be at least 6 characters long';
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }

  // Send TFA SMS Dialog Methods
  openSendTfaSmsDialog(): void {
    this.showSendTfaSmsDialog = true;
    this.sendTfaSmsResult = null;
    this.sendTfaSmsForm.reset();
  }

  closeSendTfaSmsDialog(): void {
    this.showSendTfaSmsDialog = false;
    this.sendTfaSmsResult = null;
    this.sendTfaSmsForm.reset();
  }

  onSendTfaSms(): void {
    if (this.sendTfaSmsForm.invalid) return;

    this.isSendingTfaSms = true;
    this.sendTfaSmsResult = null;

    const userId = this.sendTfaSmsForm.get('userId')?.value;
    const sendTfaSmsUrl = `http://localhost:7136/api/authorize/SendTfaSMS/${userId}`;

    const httpOptions = {
      headers: { 'accept': '*/*' },
      observe: 'response' as const
    };

    this.http.post(sendTfaSmsUrl, '', httpOptions).subscribe({
      next: (response) => {
        this.isSendingTfaSms = false;
        this.sendTfaSmsResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isSendingTfaSms = false;
        this.sendTfaSmsResult = {
          success: false,
          status: error.status,
          error: error.error || error.message,
          timestamp: new Date()
        };
      }
    });
  }

  isSendTfaSmsFieldInvalid(fieldName: string): boolean {
    const field = this.sendTfaSmsForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getSendTfaSmsFieldError(fieldName: string): string {
    const field = this.sendTfaSmsForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'User ID is required';
    }
    return '';
  }

  // Verify TFA Code Dialog Methods
  openVerifyTfaCodeDialog(): void {
    this.showVerifyTfaCodeDialog = true;
    this.verifyTfaCodeResult = null;
    this.verifyTfaCodeForm.reset();
  }

  closeVerifyTfaCodeDialog(): void {
    this.showVerifyTfaCodeDialog = false;
    this.verifyTfaCodeResult = null;
    this.verifyTfaCodeForm.reset();
  }

  onVerifyTfaCode(): void {
    if (this.verifyTfaCodeForm.invalid) return;

    this.isVerifyingTfaCode = true;
    this.verifyTfaCodeResult = null;

    const payload = {
      userId: this.verifyTfaCodeForm.get('userId')?.value,
      Code: this.verifyTfaCodeForm.get('Code')?.value,
      RememberMe: this.verifyTfaCodeForm.get('RememberMe')?.value
    };

    const httpOptions = {
      headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
      observe: 'response' as const
    };

    this.http.post('http://localhost:7136/api/authorize/VerifyTFACode', payload, httpOptions).subscribe({
      next: (response) => {
        this.isVerifyingTfaCode = false;
        this.verifyTfaCodeResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isVerifyingTfaCode = false;
        this.verifyTfaCodeResult = {
          success: false,
          status: error.status,
          error: error.error || error.message,
          timestamp: new Date()
        };
      }
    });
  }

  isVerifyTfaCodeFieldInvalid(fieldName: string): boolean {
    const field = this.verifyTfaCodeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getVerifyTfaCodeFieldError(fieldName: string): string {
    const field = this.verifyTfaCodeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        const fieldLabels: { [key: string]: string } = {
          'userId': 'User ID',
          'Code': 'TFA Code'
        };
        return `${fieldLabels[fieldName] || fieldName} is required`;
      }
    }
    return '';
  }

  // QR Code Dialog Methods
  openQrCodeDialog(): void {
    this.showQrCodeDialog = true;
    this.qrCodeResult = null;
    this.qrCodeForm.reset();
  }

  closeQrCodeDialog(): void {
    this.showQrCodeDialog = false;
    this.qrCodeResult = null;
    this.qrCodeForm.reset();
  }

  onGenerateQrCode(): void {
    if (this.qrCodeForm.invalid) return;

    this.isGeneratingQrCode = true;
    this.qrCodeResult = null;

    const userId = this.qrCodeForm.get('userId')?.value;
    const qrCodeUrl = `http://localhost:7136/api/authorize/QRCode/${userId}`;

    const httpOptions = {
      headers: { 'accept': '*/*' },
      observe: 'response' as const
    };

    this.http.get(qrCodeUrl, httpOptions).subscribe({
      next: (response) => {
        this.isGeneratingQrCode = false;
        this.qrCodeResult = {
          success: true,
          status: response.status,
          data: response.body,
          timestamp: new Date()
        };
      },
      error: (error) => {
        this.isGeneratingQrCode = false;
        this.qrCodeResult = {
          success: false,
          status: error.status,
          error: error.error || error.message,
          timestamp: new Date()
        };
      }
    });
  }

  isQrCodeFieldInvalid(fieldName: string): boolean {
    const field = this.qrCodeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getQrCodeFieldError(fieldName: string): string {
    const field = this.qrCodeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'User ID is required';
    }
    return '';
  }
}