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
    DividerModule
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

                    <div class="quick-auth-actions">
                      <h4>Quick Actions:</h4>
                      <div class="actions-row">
                        <p-button label="Login Form" icon="pi pi-sign-in" (onClick)="openLoginDialog()" class="p-button-success"></p-button>
                        <p-button label="Check Token" icon="pi pi-shield" class="p-button-info" (onClick)="openAuthenticationUI('validate')"></p-button>
                        <p-button label="Logout" icon="pi pi-sign-out" class="p-button-warning" (onClick)="openAuthenticationUI('logout')"></p-button>
                        <p-button label="User Profile" icon="pi pi-user" class="p-button-secondary" (onClick)="openAuthenticationUI('profile')"></p-button>
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

    .dashboard-header h1 i {
      margin-right: 0.5rem;
    }

    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
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
      gap: 1rem;
      margin-top: 1rem;
    }

    .category-card {
      height: 100%;
    }

    .category-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .category-description {
      font-size: 0.9rem;
      color: #6b7280;
    }

    .category-methods {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }

    .category-endpoints {
      padding: 1rem 0;
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
      gap: 1rem;
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
      gap: 0.5rem;
    }

    .parameter-chip {
      background: #eff6ff !important;
      color: #2563eb !important;
    }

    .endpoint-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .api-tester {
      max-width: 800px;
      margin: 0 auto;
    }

    .tester-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
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
      gap: 1rem;
    }

    .test-results {
      margin-top: 1rem;
    }

    .result-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
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
      margin: 0 auto;
    }

    .doc-content h3 {
      color: #2563eb;
      margin-top: 2rem;
      margin-bottom: 1rem;
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
      margin-bottom: 0.5rem;
    }

    .feature-card p {
      color: #6b7280;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .logged-in-status {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .login-status {
      color: #10b981;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .quick-user-actions, .quick-auth-actions, .quick-role-actions, .quick-claims-actions, .quick-user-role-actions, .quick-account-actions, .quick-two-factor-actions {
      margin-top: 1.5rem;
    }

    .quick-user-actions h4, .quick-auth-actions h4, .quick-role-actions h4, .quick-claims-actions h4, .quick-user-role-actions h4, .quick-account-actions h4, .quick-two-factor-actions h4 {
      color: #374151;
      margin-bottom: 1rem;
    }

    .actions-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .ui-features h4 {
      color: #374151;
      margin-bottom: 1rem;
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
      font-size: 0.875rem;
    }

    .login-form {
      padding: 1rem 0;
    }

    .form-row {
      display: flex;
      flex-direction: column;
      gap: 1rem;
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
      gap: 0.5rem;
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
        console.log('Navigate to login form');
        break;
      case 'register':
        console.log('Navigate to user registration form');
        break;
      case 'reset':
        console.log('Navigate to password reset form');
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
}