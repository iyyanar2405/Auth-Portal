import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'auth-portal-simple-welcome',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    DividerModule
  ],
  template: `
    <div class="welcome-container">
      <div class="welcome-content">
        <!-- Main Welcome Card -->
        <p-card header="Welcome to Authentication Portal" class="welcome-card">
          <div class="welcome-body">
            <h2>Dashboard Overview</h2>
            <p>You have successfully logged in to the Authentication Portal. This is your main dashboard where you can access all available features and manage your account.</p>
            
            <div class="features-grid">
              <div class="feature-item">
                <i class="pi pi-users feature-icon"></i>
                <h3>User Management</h3>
                <p>Manage user accounts, roles, and permissions</p>
              </div>
              
              <div class="feature-item">
                <i class="pi pi-database feature-icon"></i>
                <h3>Data Management</h3>
                <p>Handle customers, orders, and product data</p>
              </div>
              
              <div class="feature-item">
                <i class="pi pi-chart-bar feature-icon"></i>
                <h3>Reports & Analytics</h3>
                <p>View detailed reports and analytics</p>
              </div>
              
              <div class="feature-item">
                <i class="pi pi-cog feature-icon"></i>
                <h3>Settings</h3>
                <p>Configure system and profile settings</p>
              </div>
            </div>

            <p-divider></p-divider>

            <div class="api-documentation-section">
              <h3>API Documentation</h3>
              <p>Access comprehensive API documentation with examples, payloads, and response formats.</p>
              
              <div class="api-examples">
                <div class="api-example">
                  <h4>Users API</h4>
                  <code>GET /api/users</code>
                  <p>Retrieve paginated user list with filtering options</p>
                </div>
                
                <div class="api-example">
                  <h4>Authentication API</h4>
                  <code>POST /api/auth/login</code>
                  <p>Authenticate user with username and password</p>
                </div>
                
                <div class="api-example">
                  <h4>Dashboard API</h4>
                  <code>GET /api/dashboard</code>
                  <p>Get dashboard summary data and metrics</p>
                </div>
              </div>
            </div>

            <div class="actions">
              <p-button 
                label="View CRUD Demo" 
                icon="pi pi-table" 
                class="p-button-outlined"
                (onClick)="viewCrudDemo()">
              </p-button>
              
              <p-button 
                label="View API Documentation" 
                icon="pi pi-book" 
                class="p-button-outlined"
                (onClick)="viewApiDocs()">
              </p-button>
              
              <p-button 
                label="Logout" 
                icon="pi pi-sign-out" 
                severity="secondary"
                (onClick)="logout()">
              </p-button>
            </div>
          </div>
        </p-card>

        <!-- Quick Stats Card -->
        <p-card header="Quick Statistics" class="stats-card">
          <div class="stats-content">
            <div class="stat-item">
              <span class="stat-value">24</span>
              <span class="stat-label">Active Users</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">156</span>
              <span class="stat-label">Total Records</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">98%</span>
              <span class="stat-label">System Uptime</span>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styleUrls: ['./simple-welcome.component.scss']
})
export class SimpleWelcomeComponent {
  
  constructor(private router: Router) {}

  viewCrudDemo(): void {
    this.router.navigate(['/demo']);
  }

  viewApiDocs(): void {
    // Navigate to API documentation or open in new tab
    window.open('/api-docs', '_blank');
  }

  logout(): void {
    // Clear session and navigate to login
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}