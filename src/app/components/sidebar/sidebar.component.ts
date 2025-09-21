import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'auth-portal-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    MenuModule
  ],
  template: `
    <div class="sidebar-container">
      <div class="sidebar-header">
        <h4>Navigation</h4>
        <p-button 
          icon="pi pi-times" 
          [text]="true"
          (click)="onClose()"
          class="close-btn">
        </p-button>
      </div>
      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" 
             routerLinkActive="active" 
             class="nav-item"
             (click)="onClose()">
            <i class="pi pi-home"></i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/demo" 
             routerLinkActive="active" 
             class="nav-item"
             (click)="onClose()">
            <i class="pi pi-table"></i>
            <span>User Management</span>
          </a>
          <a routerLink="/profile" 
             routerLinkActive="active" 
             class="nav-item"
             (click)="onClose()">
            <i class="pi pi-user"></i>
            <span>Profile Settings</span>
          </a>
          <a routerLink="/api-docs" 
             routerLinkActive="active" 
             class="nav-item"
             (click)="onClose()">
            <i class="pi pi-book"></i>
            <span>API Documentation</span>
          </a>
        </nav>
      </div>
    </div>
  `,
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  public closeEvent = output<void>();
  private router = inject(Router);

  onClose(): void {
    this.closeEvent.emit();
  }

  onNavigateTo(url: string): void {
    this.router.navigate([url]);
    this.onClose();
  }
}
