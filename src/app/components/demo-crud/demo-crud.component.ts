import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';

import { CrudGridComponent, CrudConfig } from '../../../../libs/shared/src/components/crud-grid/crud-grid.component';
import { UserCrudService, User } from '../../../../libs/shared/src/services/crud.service';

@Component({
  selector: 'app-demo-crud',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    CardModule,
    CrudGridComponent
  ],
  template: `
    <div class="demo-container">
      <p-card header="CRUD Operations Demo with API Documentation">
        <p>This demo showcases the CRUD operations with integrated API documentation based on the AuthProvider API specifications.</p>
        
        <p-tabView>
          <!-- User Management Tab -->
          <p-tabPanel header="User Management">
            <shared-crud-grid
              [config]="userConfig"
              [crudService]="userCrudService"
              (itemCreated)="onUserCreated($event)"
              (itemUpdated)="onUserUpdated($event)"
              (itemDeleted)="onUserDeleted($event)">
            </shared-crud-grid>
          </p-tabPanel>

          <!-- Role Management Tab -->
          <p-tabPanel header="Role Management">
            <shared-crud-grid
              [config]="roleConfig"
              [crudService]="userCrudService"
              (itemCreated)="onRoleCreated($event)"
              (itemUpdated)="onRoleUpdated($event)"
              (itemDeleted)="onRoleDeleted($event)">
            </shared-crud-grid>
          </p-tabPanel>

          <!-- Authentication Tab -->
          <p-tabPanel header="Authentication">
            <div class="auth-demo">
              <h3>Authentication API Documentation</h3>
              <p>Reference implementation based on AuthProvider API specifications:</p>
              
              <div class="api-reference">
                <h4>Token Endpoint</h4>
                <div class="code-block">
                  <strong>POST</strong> <code>/api/authorize/token</code>
                  <pre>{{ tokenRequestExample | json }}</pre>
                  <strong>Response:</strong>
                  <pre>{{ tokenResponseExample | json }}</pre>
                </div>
                
                <h4>User Registration</h4>
                <div class="code-block">
                  <strong>POST</strong> <code>/api/authorize/register</code>
                  <pre>{{ registerRequestExample | json }}</pre>
                  <strong>Response:</strong>
                  <pre>{{ registerResponseExample | json }}</pre>
                </div>
              </div>
            </div>
          </p-tabPanel>
        </p-tabView>
      </p-card>
    </div>
  `,
  styleUrls: ['./demo-crud.component.scss']
})
export class DemoCrudComponent implements OnInit {
  userConfig: CrudConfig = {
    title: 'User',
    columns: [
      { field: 'username', header: 'Username', sortable: true, filterable: true },
      { field: 'email', header: 'Email', sortable: true, filterable: true },
      { field: 'firstName', header: 'First Name', sortable: true },
      { field: 'lastName', header: 'Last Name', sortable: true },
      { field: 'role', header: 'Role', type: 'tag', tagSeverity: this.getRoleSeverity },
      { field: 'status', header: 'Status', type: 'tag', tagSeverity: this.getStatusSeverity },
      { field: 'actions', header: 'Actions', type: 'actions', width: '120px' }
    ],
    formFields: [
      { name: 'username', label: 'Username', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
      { 
        name: 'role', 
        label: 'Role', 
        type: 'select', 
        required: true,
        options: [
          { label: 'Administrator', value: 'administrator' },
          { label: 'Manager', value: 'manager' },
          { label: 'User', value: 'user' }
        ]
      },
      { 
        name: 'status', 
        label: 'Status', 
        type: 'select', 
        required: true,
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' }
        ]
      }
    ],
    apiDocumentation: {
      baseEndpoint: '/api/user',
      description: 'User Management API - Manage user accounts and permissions based on AuthProvider API specifications',
      methods: {
        get: {
          description: 'Retrieve paginated user list with search and filtering options',
          responseExample: {
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
          }
        },
        post: {
          description: 'Create a new user account with profile information',
          requestExample: {
            userName: "newuser@example.com",
            email: "newuser@example.com",
            password: "Password123!",
            phoneNumber: "+1234567890",
            profile: {
              firstName: "John",
              lastName: "Doe"
            }
          },
          responseExample: {
            success: true,
            data: {
              id: "550e8400-e29b-41d4-a716-446655440001",
              userName: "newuser@example.com",
              email: "newuser@example.com",
              isActive: true,
              createdAt: "2025-09-21T11:30:00Z"
            }
          }
        },
        put: {
          description: 'Update existing user information',
          requestExample: {
            userName: "updated@example.com",
            email: "updated@example.com",
            phoneNumber: "+1234567891",
            profile: {
              firstName: "Jane",
              lastName: "Smith"
            }
          },
          responseExample: {
            success: true,
            data: {
              id: "550e8400-e29b-41d4-a716-446655440000",
              userName: "updated@example.com",
              updatedAt: "2025-09-21T12:00:00Z"
            }
          }
        },
        delete: {
          description: 'Delete user account (soft delete recommended)',
          responseExample: {
            success: true,
            message: "User deleted successfully"
          }
        }
      }
    }
  };

  roleConfig: CrudConfig = {
    title: 'Role',
    columns: [
      { field: 'name', header: 'Role Name', sortable: true, filterable: true },
      { field: 'description', header: 'Description', sortable: true },
      { field: 'userCount', header: 'User Count', type: 'number', sortable: true },
      { field: 'actions', header: 'Actions', type: 'actions', width: '120px' }
    ],
    formFields: [
      { name: 'name', label: 'Role Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true }
    ],
    apiDocumentation: {
      baseEndpoint: '/api/role',
      description: 'Role Management API - Manage user roles and permissions',
      methods: {
        get: {
          description: 'Retrieve paginated role list with user count information',
          responseExample: {
            success: true,
            data: {
              items: [
                {
                  id: "550e8400-e29b-41d4-a716-446655440000",
                  name: "Administrator",
                  normalizedName: "ADMINISTRATOR",
                  userCount: 5,
                  concurrencyStamp: "550e8400-e29b-41d4-a716-446655440001"
                }
              ],
              totalCount: 5
            }
          }
        },
        post: {
          description: 'Create a new role with specified permissions',
          requestExample: {
            name: "Manager",
            permissions: ["read_users", "edit_users"]
          },
          responseExample: {
            success: true,
            data: {
              id: "550e8400-e29b-41d4-a716-446655440002",
              name: "Manager",
              userCount: 0
            }
          }
        }
      }
    }
  };

  // API Examples for Authentication tab
  tokenRequestExample = {
    userName: "user@example.com",
    password: "Password123!",
    deviceCode: "0"
  };

  tokenResponseExample = {
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    token_type: "Bearer",
    expires_in: 3600,
    refreshToken: "550e8400-e29b-41d4-a716-446655440000"
  };

  registerRequestExample = {
    userName: "user@example.com",
    email: "user@example.com",
    password: "Password123!",
    confirmPassword: "Password123!"
  };

  registerResponseExample = {
    success: true,
    data: {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      email: "user@example.com"
    }
  };

  constructor(public userCrudService: UserCrudService) {}

  ngOnInit(): void {
    // Component initialization
  }

  getRoleSeverity(role: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (role) {
      case 'administrator': return 'danger';
      case 'manager': return 'warning';
      case 'user': return 'info';
      default: return 'info';
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
    return status === 'active' ? 'success' : 'danger';
  }

  onUserCreated(user: User): void {
    console.log('User created:', user);
  }

  onUserUpdated(user: User): void {
    console.log('User updated:', user);
  }

  onUserDeleted(id: string | number): void {
    console.log('User deleted:', id);
  }

  onRoleCreated(role: any): void {
    console.log('Role created:', role);
  }

  onRoleUpdated(role: any): void {
    console.log('Role updated:', role);
  }

  onRoleDeleted(id: string | number): void {
    console.log('Role deleted:', id);
  }
}