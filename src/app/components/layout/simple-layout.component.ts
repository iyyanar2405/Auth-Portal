import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { BreadcrumbComponent } from '../breadcrumb';
import { FooterComponent } from '../footer';
import { NavbarComponent } from '../navbar';
import { SidebarComponent } from '../sidebar';

@Component({
  selector: 'auth-portal-layout',
  standalone: true,
  imports: [
    ButtonModule,
    RouterModule,
    ToastModule,
    BreadcrumbComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    CommonModule,
  ],
  providers: [ConfirmationService],
  template: `
    <div class="layout-container">
      <!-- Main Navigation -->
      <auth-portal-navbar 
        (toggleSidebarEvent)="onToggleSidebar($event)">
      </auth-portal-navbar>

      <!-- Sidebar Overlay -->
      <div class="sidebar-overlay" 
           [class.active]="sidebarVisible" 
           (click)="onToggleSidebar(false)">
      </div>

      <!-- Sidebar -->
      <div class="sidebar-wrapper" [class.active]="sidebarVisible">
        <auth-portal-sidebar (closeEvent)="onToggleSidebar(false)"></auth-portal-sidebar>
      </div>

      <!-- Main Content Area -->
      <div class="main-content">
        <!-- Breadcrumb -->
        <auth-portal-breadcrumb *ngIf="breadcrumbVisibility"></auth-portal-breadcrumb>
        
        <!-- Page Content -->
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>

        <!-- Footer -->
        <auth-portal-footer></auth-portal-footer>
      </div>
    </div>

    <p-toast></p-toast>
  `,
  styleUrls: ['./layout.component.scss'],
})
export class SimpleLayoutComponent implements OnInit {
  title = 'authentication-portal';
  isLoggedIn = true;
  breadcrumbVisibility = true;
  sidebarVisible = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeApp();
  }

  private initializeApp(): void {
    console.log('Layout component initialized');
  }

  onToggleSidebar(isVisible: boolean): void {
    this.sidebarVisible = isVisible;
  }
}