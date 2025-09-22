import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-api-dashboard-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TabViewModule,
    ButtonModule
  ],
  template: `
    <div class="api-dashboard-container">
      <h1>API Dashboard Test</h1>
      
      <p-tabView>
        <p-tabPanel header="Overview" leftIcon="pi pi-chart-line">
          <div class="tab-content">
            <h3>Overview Tab</h3>
            <p>This is the overview tab content</p>
            <p-button label="Test Button" icon="pi pi-check"></p-button>
          </div>
        </p-tabPanel>

        <p-tabPanel header="User Management" leftIcon="pi pi-users">
          <div class="tab-content">
            <h3>User Management Tab</h3>
            <p>This is the user management tab content</p>
          </div>
        </p-tabPanel>

        <p-tabPanel header="Role Management" leftIcon="pi pi-key">
          <div class="tab-content">
            <h3>Role Management Tab</h3>
            <p>This is the role management tab content</p>
          </div>
        </p-tabPanel>

        <p-tabPanel header="Authentication" leftIcon="pi pi-shield">
          <div class="tab-content">
            <h3>Authentication Tab</h3>
            <p>This is the authentication tab content</p>
          </div>
        </p-tabPanel>
      </p-tabView>
    </div>
  `,
  styles: [`
    .api-dashboard-container {
      padding: 20px;
    }
    .tab-content {
      padding: 20px;
    }
  `]
})
export class ApiDashboardTestComponent {
}