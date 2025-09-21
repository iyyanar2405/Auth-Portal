import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-simple-demo',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    RouterModule
  ],
  template: `
    <div class="demo-container">
      <p-card header="API Documentation & CRUD Operations Demo">
        <p>This demo showcases the integration of CRUD operations with API documentation references based on the AuthProvider API specifications.</p>
        
        <p-tabView>
          <!-- API Documentation Tab -->
          <p-tabPanel header="API Documentation">
            <div class="api-docs">
              <h3>AuthProvider API Reference</h3>
              <p>Complete API documentation with payloads and responses for all endpoints.</p>
              
              <div class="api-section">
                <h4>Authentication Controller (/api/authorize)</h4>
                <div class="endpoint">
                  <strong>POST /api/authorize/token</strong>
                  <div class="code-block">
                    <p>Request Payload:</p>
                    <pre>{{ authTokenRequest | json }}</pre>
                    <p>Response:</p>
                    <pre>{{ authTokenResponse | json }}</pre>
                  </div>
                </div>
                
                <div class="endpoint">
                  <strong>POST /api/authorize/register</strong>
                  <div class="code-block">
                    <p>Request Payload:</p>
                    <pre>{{ registerRequest | json }}</pre>
                    <p>Response:</p>
                    <pre>{{ registerResponse | json }}</pre>
                  </div>
                </div>
              </div>
              
              <div class="api-section">
                <h4>User Management Controller (/api/user)</h4>
                <div class="endpoint">
                  <strong>GET /api/user</strong>
                  <div class="code-block">
                    <p>Query Parameters: ?page=1&pageSize=10&search=term</p>
                    <p>Response:</p>
                    <pre>{{ userListResponse | json }}</pre>
                  </div>
                </div>
                
                <div class="endpoint">
                  <strong>POST /api/user</strong>
                  <div class="code-block">
                    <p>Request Payload:</p>
                    <pre>{{ createUserRequest | json }}</pre>
                    <p>Response:</p>
                    <pre>{{ createUserResponse | json }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </p-tabPanel>

          <!-- Sample Data Tab -->
          <p-tabPanel header="Sample CRUD Data">
            <div class="crud-demo">
              <h3>User Management Grid</h3>
              <p>Example of how data would be displayed in a CRUD grid with API integration.</p>
              
              <p-table [value]="sampleUsers" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-user>
                  <tr>
                    <td>{{ user.userName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.roles.join(', ') }}</td>
                    <td>
                      <span [class]="'status-' + (user.isActive ? 'active' : 'inactive')">
                        {{ user.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td>
                      <p-button icon="pi pi-pencil" class="p-button-text p-button-sm mr-1"></p-button>
                      <p-button icon="pi pi-trash" severity="danger" class="p-button-text p-button-sm"></p-button>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </p-tabPanel>

          <!-- Menu Configuration Tab -->
          <p-tabPanel header="Menu Configuration">
            <div class="menu-config">
              <h3>Application Menu with API References</h3>
              <p>This shows how the menu system integrates with API documentation.</p>
              
              <div class="menu-item" *ngFor="let item of menuItems">
                <h4>{{ item.label }}</h4>
                <p>{{ item.description }}</p>
                <div *ngIf="item.apiEndpoint" class="api-ref">
                  <strong>API Endpoint:</strong> <code>{{ item.apiEndpoint }}</code>
                </div>
              </div>
            </div>
          </p-tabPanel>
        </p-tabView>
        
        <div class="actions">
          <p-button 
            label="Back to Dashboard" 
            icon="pi pi-arrow-left" 
            (onClick)="goBack()">
          </p-button>
        </div>
      </p-card>
    </div>
  `,
  styleUrls: ['./simple-demo.component.scss']
})
export class SimpleDemoComponent {
  // Sample API request/response data based on the provided documentation
  authTokenRequest = {
    userName: "user@example.com",
    password: "Password123!",
    deviceCode: "0"
  };

  authTokenResponse = {
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    token_type: "Bearer",
    expires_in: 3600,
    refreshToken: "550e8400-e29b-41d4-a716-446655440000"
  };

  registerRequest = {
    userName: "user@example.com",
    email: "user@example.com",
    password: "Password123!",
    confirmPassword: "Password123!"
  };

  registerResponse = {
    success: true,
    data: {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      email: "user@example.com"
    }
  };

  userListResponse = {
    success: true,
    data: {
      items: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          userName: "user@example.com",
          email: "user@example.com",
          emailConfirmed: true,
          phoneNumber: "+1234567890",
          roles: ["User", "Manager"],
          isActive: true,
          lastPasswordChanged: "2025-09-15T10:30:00Z"
        }
      ],
      totalCount: 25,
      pageNumber: 1,
      pageSize: 10
    }
  };

  createUserRequest = {
    userName: "newuser@example.com",
    email: "newuser@example.com",
    password: "Password123!",
    phoneNumber: "+1234567890"
  };

  createUserResponse = {
    success: true,
    data: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      userName: "newuser@example.com",
      email: "newuser@example.com"
    }
  };

  sampleUsers = [
    {
      userName: "admin",
      email: "admin@company.com",
      roles: ["Administrator"],
      isActive: true
    },
    {
      userName: "john.doe",
      email: "john.doe@company.com",
      roles: ["User"],
      isActive: true
    },
    {
      userName: "jane.smith",
      email: "jane.smith@company.com",
      roles: ["Manager"],
      isActive: false
    }
  ];

  menuItems = [
    {
      label: "User Management",
      description: "Manage user accounts and permissions",
      apiEndpoint: "/api/user"
    },
    {
      label: "Role Management",
      description: "Manage user roles and permissions",
      apiEndpoint: "/api/role"
    },
    {
      label: "Authentication",
      description: "User authentication and token management",
      apiEndpoint: "/api/authorize"
    },
    {
      label: "Claims Management",
      description: "Manage user and role claims",
      apiEndpoint: "/api/claims"
    }
  ];

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}