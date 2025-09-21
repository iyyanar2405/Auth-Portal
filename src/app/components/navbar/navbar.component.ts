import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'auth-portal-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule
  ],
  template: `
    <nav class="navbar-container">
      <div class="navbar-left">
        <p-button 
          icon="pi pi-bars" 
          [text]="true"
          (click)="toggleSidebar()"
          class="sidebar-toggle">
        </p-button>
        <h3 class="navbar-title">Auth Portal</h3>
      </div>
      <div class="navbar-right">
        <p-button 
          label="Profile" 
          icon="pi pi-user"
          [text]="true"
          class="profile-btn">
        </p-button>
        <p-button 
          label="Logout" 
          icon="pi pi-sign-out"
          [text]="true"
          (click)="logout()"
          class="logout-btn">
        </p-button>
      </div>
    </nav>
  `,
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  public toggleSidebarEvent = output<boolean>();
  private router = inject(Router);

  ngOnInit(): void {
    // Initialize navbar
  }

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit(true);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
