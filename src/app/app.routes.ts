import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/welcome/simple-welcome.component').then(m => m.SimpleWelcomeComponent)
  },
  {
    path: 'api-dashboard',
    loadComponent: () => import('./components/api-dashboard/api-dashboard-refactored.component').then(m => m.ApiDashboardComponent)
  },
  {
    path: 'demo',
    loadComponent: () => import('./components/demo-crud/simple-demo.component').then(m => m.SimpleDemoComponent)
  },
  {
    path: '',
    redirectTo: '/api-dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/api-dashboard'
  }
];
