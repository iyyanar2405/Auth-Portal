import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiEndpointInfo, API_ENDPOINTS_INFO, API_CATEGORIES } from '../../../libs/shared/src/models/api-models';

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

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private testResultsSubject = new BehaviorSubject<EndpointTestResult[]>([]);
  public testResults$ = this.testResultsSubject.asObservable();

  private testDialogVisibleSubject = new BehaviorSubject<boolean>(false);
  public testDialogVisible$ = this.testDialogVisibleSubject.asObservable();

  private currentTestPayloadSubject = new BehaviorSubject<TestPayload>({
    endpoint: '',
    method: 'GET'
  });
  public currentTestPayload$ = this.currentTestPayloadSubject.asObservable();

  constructor() {}

  // Endpoint data methods
  getEndpoints(): ApiEndpointInfo[] {
    return API_ENDPOINTS_INFO;
  }

  getUniqueCategories(): string[] {
    return [...new Set(API_ENDPOINTS_INFO.map(e => e.category))];
  }

  getEndpointsByCategory(category: string): ApiEndpointInfo[] {
    return API_ENDPOINTS_INFO.filter(e => e.category === category);
  }

  getCategories() {
    const categories = this.getUniqueCategories().map(category => {
      const categoryEndpoints = API_ENDPOINTS_INFO.filter(e => e.category === category);
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
      'Authentication': 'Core authentication endpoints for login, registration, and token management',
      'User Management': 'Complete user lifecycle management including CRUD operations and account control',
      'Role Management': 'Role-based access control with creation, modification, and assignment capabilities',
      'Claims Management': 'Fine-grained permission system for controlling user access and authorization',
      'User Role Management': 'Association management between users and roles with assignment controls',
      'Account Management': 'Personal account settings, password changes, and profile management',
      'Two-Factor Authentication': 'Enhanced security features including TOTP, recovery codes, and authenticator setup'
    };
    return descriptions[category] || 'API endpoints for various operations';
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Authentication': 'pi pi-shield',
      'User Management': 'pi pi-users',
      'Role Management': 'pi pi-key',
      'Claims Management': 'pi pi-verified',
      'User Role Management': 'pi pi-sitemap',
      'Account Management': 'pi pi-user',
      'Two-Factor Authentication': 'pi pi-lock'
    };
    return icons[category] || 'pi pi-cog';
  }

  // Statistics methods
  getTotalEndpointsCount(): number {
    return API_ENDPOINTS_INFO.length;
  }

  getCategoriesCount(): number {
    return this.getUniqueCategories().length;
  }

  getAuthRequiredCount(): number {
    return API_ENDPOINTS_INFO.filter(e => e.requiresAuth).length;
  }

  getMethodCount(method: string): number {
    return API_ENDPOINTS_INFO.filter(e => e.method === method).length;
  }

  // Dialog management
  openEndpointTester(endpoint: string, method: string): void {
    this.currentTestPayloadSubject.next({
      endpoint,
      method,
      body: ['POST', 'PUT'].includes(method) ? '{}' : undefined
    });
    this.testDialogVisibleSubject.next(true);
  }

  closeTestDialog(): void {
    this.testDialogVisibleSubject.next(false);
  }

  addTestResult(result: EndpointTestResult): void {
    const currentResults = this.testResultsSubject.value;
    this.testResultsSubject.next([result, ...currentResults.slice(0, 9)]); // Keep last 10 results
  }

  // Utility methods
  getAccordionHeader(endpoint: ApiEndpointInfo): string {
    return `${endpoint.method} ${endpoint.endpoint}`;
  }

  formatJsonResponse(data: any): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }

  getStatusSeverity(status: number): string {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warn';
    if (status >= 500) return 'danger';
    return 'info';
  }
}