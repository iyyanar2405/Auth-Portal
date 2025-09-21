import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';

// Import the new modular tab components
import { AuthenticationTabComponent } from './tabs/authentication';
import { UserManagementTabComponent } from './tabs/user-management';
// import { RoleManagementTabComponent } from './tabs/role-management';
// import { ClaimsManagementTabComponent } from './tabs/claims-management';
// import { UserRoleManagementTabComponent } from './tabs/user-role-management';
// import { AccountManagementTabComponent } from './tabs/account-management';
// import { TwoFactorAuthTabComponent } from './tabs/two-factor-auth';

import { ApiService } from '../../services/api.service';
import { DashboardService } from '../../services/dashboard.service';

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
    CardModule,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    BadgeModule,
    ChipModule,
    DialogModule,
    InputTextareaModule,
    MessageModule,
    ProgressSpinnerModule,
    TooltipModule,
    DividerModule,
    
    // Import the new modular components
    AuthenticationTabComponent,
    UserManagementTabComponent
    // Add other tab components as they are created
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
            <h3>{{ dashboardService.getTotalEndpointsCount() }}</h3>
            <p>Total Endpoints</p>
          </div>
          <div class="stat-card">
            <h3>{{ dashboardService.getCategoriesCount() }}</h3>
            <p>Categories</p>
          </div>
          <div class="stat-card">
            <h3>{{ dashboardService.getAuthRequiredCount() }}</h3>
            <p>Require Auth</p>
          </div>
          <div class="stat-card">
            <h3>{{ dashboardService.getMethodCount('POST') }}</h3>
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
                  *ngFor="let category of dashboardService.getCategories()" 
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
                  (onClick)="dashboardService.openEndpointTester('/api/Authorize/token', 'POST')"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Get Users" 
                  icon="pi pi-users" 
                  (onClick)="dashboardService.openEndpointTester('/api/User', 'GET')"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Get Roles" 
                  icon="pi pi-key" 
                  (onClick)="dashboardService.openEndpointTester('/api/Role', 'GET')"
                  class="p-button-outlined"
                ></p-button>
                <p-button 
                  label="Current User Info" 
                  icon="pi pi-user" 
                  (onClick)="dashboardService.openEndpointTester('/api/manage/userInfo', 'GET')"
                  class="p-button-outlined"
                ></p-button>
              </div>
            </div>
          </div>
        </p-tabPanel>

        <!-- Modular Tab Components -->
        <p-tabPanel header="Authentication" leftIcon="pi pi-shield">
          <app-authentication-tab></app-authentication-tab>
        </p-tabPanel>

        <p-tabPanel header="User Management" leftIcon="pi pi-users">
          <app-user-management-tab></app-user-management-tab>
        </p-tabPanel>

        <!-- 
        Additional tabs can be added as components are created:
        
        <p-tabPanel header="Role Management" leftIcon="pi pi-key">
          <app-role-management-tab></app-role-management-tab>
        </p-tabPanel>

        <p-tabPanel header="Claims Management" leftIcon="pi pi-verified">
          <app-claims-management-tab></app-claims-management-tab>
        </p-tabPanel>

        <p-tabPanel header="User Role Management" leftIcon="pi pi-sitemap">
          <app-user-role-management-tab></app-user-role-management-tab>
        </p-tabPanel>

        <p-tabPanel header="Account Management" leftIcon="pi pi-user">
          <app-account-management-tab></app-account-management-tab>
        </p-tabPanel>

        <p-tabPanel header="Two-Factor Auth" leftIcon="pi pi-lock">
          <app-two-factor-auth-tab></app-two-factor-auth-tab>
        </p-tabPanel>
        -->
      </p-tabView>

      <!-- Global Endpoint Tester Dialog -->
      <p-dialog 
        header="API Endpoint Tester" 
        [(visible)]="showTestDialog" 
        [modal]="true" 
        [closable]="true" 
        [draggable]="false" 
        [resizable]="true"
        styleClass="endpoint-tester-dialog"
        [style]="{width: '50vw', minWidth: '400px'}"
      >
        <form (ngSubmit)="testEndpoint()">
          <div class="tester-form">
            <div class="form-field">
              <label for="testEndpoint">Endpoint</label>
              <input 
                pInputText 
                id="testEndpoint" 
                [(ngModel)]="testPayload.endpoint" 
                name="testEndpoint"
                placeholder="/api/endpoint"
                required
              />
            </div>

            <div class="form-field">
              <label for="testMethod">Method</label>
              <p-dropdown 
                id="testMethod"
                [(ngModel)]="testPayload.method"
                name="testMethod"
                [options]="methodOptions"
                placeholder="Select method"
                required
              ></p-dropdown>
            </div>

            <div class="form-field" *ngIf="['POST', 'PUT'].includes(testPayload.method)">
              <label for="testBody">Request Body (JSON)</label>
              <textarea 
                pInputTextarea 
                id="testBody" 
                [(ngModel)]="testPayload.body"
                name="testBody"
                rows="6"
                placeholder='{"key": "value"}'
              ></textarea>
            </div>

            <div class="form-actions">
              <p-button 
                type="submit" 
                label="Test Endpoint" 
                icon="pi pi-play" 
                [loading]="isTestingEndpoint"
              ></p-button>
              <p-button 
                type="button" 
                label="Clear" 
                icon="pi pi-refresh" 
                class="p-button-secondary" 
                (onClick)="clearTestForm()"
              ></p-button>
            </div>
          </div>
        </form>

        <div class="test-results" *ngIf="lastTestResult">
          <h4>Test Results:</h4>
          <div class="result-header">
            <p-badge 
              [value]="lastTestResult.status.toString()" 
              [severity]="getStatusSeverity(lastTestResult.status)"
            ></p-badge>
            <span class="result-status">{{ lastTestResult.success ? 'Success' : 'Error' }}</span>
            <small class="result-timestamp">{{ lastTestResult.timestamp | date:'medium' }}</small>
          </div>
          
          <div class="result-data" *ngIf="lastTestResult.data">
            <h5>Response Data:</h5>
            <pre>{{ formatJsonResponse(lastTestResult.data) }}</pre>
          </div>
          
          <div class="result-error" *ngIf="lastTestResult.error">
            <h5>Error:</h5>
            <p class="error-message">{{ lastTestResult.error }}</p>
          </div>
        </div>
      </p-dialog>
    </div>
  `,
  styleUrls: ['./api-dashboard-refactored.component.scss']
})
export class ApiDashboardComponent implements OnInit {
  protected apiService = inject(ApiService);
  protected dashboardService = inject(DashboardService);

  // Test dialog properties
  showTestDialog = false;
  isTestingEndpoint = false;
  lastTestResult: EndpointTestResult | null = null;
  
  testPayload: TestPayload = {
    endpoint: '',
    method: 'GET'
  };

  methodOptions = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' }
  ];

  ngOnInit(): void {
    // Subscribe to test dialog state
    this.dashboardService.testDialogVisible$.subscribe(visible => {
      this.showTestDialog = visible;
    });

    // Subscribe to test payload changes
    this.dashboardService.currentTestPayload$.subscribe(payload => {
      this.testPayload = { ...payload };
    });
  }

  async testEndpoint(): Promise<void> {
    this.isTestingEndpoint = true;
    
    try {
      const result = await this.apiService.testEndpoint(this.testPayload);
      this.lastTestResult = result;
      this.dashboardService.addTestResult(result);
    } catch (error: any) {
      this.lastTestResult = {
        success: false,
        status: 500,
        error: error.message,
        timestamp: new Date()
      };
    } finally {
      this.isTestingEndpoint = false;
    }
  }

  clearTestForm(): void {
    this.testPayload = {
      endpoint: '',
      method: 'GET'
    };
    this.lastTestResult = null;
  }

  formatJsonResponse(data: any): string {
    return this.dashboardService.formatJsonResponse(data);
  }

  getStatusSeverity(status: number): string {
    return this.dashboardService.getStatusSeverity(status);
  }
}