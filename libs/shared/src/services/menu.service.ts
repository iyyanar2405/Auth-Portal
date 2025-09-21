import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  routerLink?: string;
  url?: string;
  target?: string;
  items?: MenuItem[];
  separator?: boolean;
  badge?: string;
  badgeStyleClass?: string;
  apiDocumentation?: {
    description: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    requestPayload?: any;
    responsePayload?: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>(this.getDefaultMenuItems());
  public menuItems$ = this.menuItemsSubject.asObservable();

  constructor() {}

  getMenuItems(): MenuItem[] {
    return this.menuItemsSubject.value;
  }

  updateMenuItems(items: MenuItem[]): void {
    this.menuItemsSubject.next(items);
  }

  private getDefaultMenuItems(): MenuItem[] {
    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
        apiDocumentation: {
          description: 'Get dashboard overview data',
          endpoint: '/api/dashboard',
          method: 'GET',
          responsePayload: {
            summary: {
              totalUsers: 'number',
              activeUsers: 'number',
              totalTransactions: 'number'
            },
            charts: 'ChartData[]',
            notifications: 'Notification[]'
          }
        }
      },
      {
        id: 'user-management',
        label: 'User Management',
        icon: 'pi pi-users',
        items: [
          {
            id: 'users',
            label: 'Users',
            icon: 'pi pi-user',
            routerLink: '/users',
            apiDocumentation: {
              description: 'Manage user accounts and permissions',
              endpoint: '/api/users',
              method: 'GET',
              responsePayload: {
                users: [
                  {
                    id: 'string',
                    username: 'string',
                    email: 'string',
                    role: 'string',
                    status: 'active | inactive',
                    createdAt: 'string',
                    lastLogin: 'string'
                  }
                ],
                pagination: {
                  page: 'number',
                  limit: 'number',
                  total: 'number'
                }
              }
            }
          },
          {
            id: 'create-user',
            label: 'Create User',
            icon: 'pi pi-user-plus',
            routerLink: '/users/create',
            apiDocumentation: {
              description: 'Create a new user account',
              endpoint: '/api/users',
              method: 'POST',
              requestPayload: {
                username: 'string',
                email: 'string',
                password: 'string',
                role: 'string',
                profile: {
                  firstName: 'string',
                  lastName: 'string',
                  phone: 'string'
                }
              },
              responsePayload: {
                id: 'string',
                username: 'string',
                email: 'string',
                role: 'string',
                status: 'active',
                createdAt: 'string'
              }
            }
          },
          {
            id: 'roles',
            label: 'Roles & Permissions',
            icon: 'pi pi-key',
            routerLink: '/roles',
            apiDocumentation: {
              description: 'Manage user roles and permissions',
              endpoint: '/api/roles',
              method: 'GET',
              responsePayload: {
                roles: [
                  {
                    id: 'string',
                    name: 'string',
                    description: 'string',
                    permissions: 'string[]',
                    userCount: 'number'
                  }
                ]
              }
            }
          }
        ]
      },
      {
        id: 'data-management',
        label: 'Data Management',
        icon: 'pi pi-database',
        items: [
          {
            id: 'customers',
            label: 'Customers',
            icon: 'pi pi-briefcase',
            routerLink: '/customers',
            apiDocumentation: {
              description: 'Customer data CRUD operations',
              endpoint: '/api/customers',
              method: 'GET',
              responsePayload: {
                customers: [
                  {
                    id: 'string',
                    name: 'string',
                    email: 'string',
                    phone: 'string',
                    address: 'Address',
                    status: 'active | inactive',
                    createdAt: 'string',
                    updatedAt: 'string'
                  }
                ],
                pagination: 'PaginationInfo'
              }
            }
          },
          {
            id: 'orders',
            label: 'Orders',
            icon: 'pi pi-shopping-cart',
            routerLink: '/orders',
            apiDocumentation: {
              description: 'Order management and tracking',
              endpoint: '/api/orders',
              method: 'GET',
              responsePayload: {
                orders: [
                  {
                    id: 'string',
                    customerId: 'string',
                    items: 'OrderItem[]',
                    total: 'number',
                    status: 'pending | confirmed | shipped | delivered | cancelled',
                    createdAt: 'string',
                    updatedAt: 'string'
                  }
                ]
              }
            }
          },
          {
            id: 'products',
            label: 'Products',
            icon: 'pi pi-box',
            routerLink: '/products',
            apiDocumentation: {
              description: 'Product catalog management',
              endpoint: '/api/products',
              method: 'GET',
              responsePayload: {
                products: [
                  {
                    id: 'string',
                    name: 'string',
                    description: 'string',
                    price: 'number',
                    category: 'string',
                    stock: 'number',
                    images: 'string[]',
                    status: 'active | inactive'
                  }
                ]
              }
            }
          }
        ]
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: 'pi pi-chart-bar',
        items: [
          {
            id: 'analytics',
            label: 'Analytics',
            icon: 'pi pi-chart-line',
            routerLink: '/reports/analytics',
            apiDocumentation: {
              description: 'Get analytical data and metrics',
              endpoint: '/api/reports/analytics',
              method: 'GET',
              responsePayload: {
                summary: {
                  totalRevenue: 'number',
                  totalOrders: 'number',
                  avgOrderValue: 'number',
                  topProducts: 'ProductSummary[]'
                },
                timeSeries: {
                  revenue: 'TimeSeriesData[]',
                  orders: 'TimeSeriesData[]'
                }
              }
            }
          },
          {
            id: 'sales-report',
            label: 'Sales Report',
            icon: 'pi pi-dollar',
            routerLink: '/reports/sales',
            apiDocumentation: {
              description: 'Generate sales reports',
              endpoint: '/api/reports/sales',
              method: 'POST',
              requestPayload: {
                startDate: 'string (ISO date)',
                endDate: 'string (ISO date)',
                groupBy: 'day | week | month',
                filters: {
                  productIds: 'string[]',
                  customerIds: 'string[]',
                  status: 'string[]'
                }
              },
              responsePayload: {
                reportId: 'string',
                data: 'SalesData[]',
                summary: 'SalesSummary',
                generatedAt: 'string'
              }
            }
          }
        ]
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'pi pi-cog',
        items: [
          {
            id: 'profile',
            label: 'Profile Settings',
            icon: 'pi pi-user-edit',
            routerLink: '/settings/profile',
            apiDocumentation: {
              description: 'Update user profile information',
              endpoint: '/api/user/profile',
              method: 'PUT',
              requestPayload: {
                firstName: 'string',
                lastName: 'string',
                email: 'string',
                phone: 'string',
                preferences: {
                  language: 'string',
                  timezone: 'string',
                  notifications: 'boolean'
                }
              },
              responsePayload: {
                id: 'string',
                firstName: 'string',
                lastName: 'string',
                email: 'string',
                phone: 'string',
                preferences: 'UserPreferences',
                updatedAt: 'string'
              }
            }
          },
          {
            id: 'system-settings',
            label: 'System Settings',
            icon: 'pi pi-sliders-h',
            routerLink: '/settings/system',
            apiDocumentation: {
              description: 'Configure system-wide settings',
              endpoint: '/api/settings/system',
              method: 'GET',
              responsePayload: {
                settings: {
                  siteName: 'string',
                  maintenanceMode: 'boolean',
                  registrationEnabled: 'boolean',
                  emailSettings: 'EmailConfiguration',
                  securitySettings: 'SecurityConfiguration'
                }
              }
            }
          }
        ]
      },
      {
        id: 'api-docs',
        label: 'API Documentation',
        icon: 'pi pi-book',
        url: '/api-docs',
        target: '_blank',
        apiDocumentation: {
          description: 'Complete API documentation with interactive examples',
          endpoint: '/api-docs',
          method: 'GET',
          responsePayload: 'HTML documentation page'
        }
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: 'pi pi-sign-out',
        separator: true
      }
    ];
  }
}