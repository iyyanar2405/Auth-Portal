import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

export interface CrudEntity {
  id: string | number;
  [key: string]: any;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: { [key: string]: any };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CrudOperations<T extends CrudEntity> {
  getAll(params?: PaginationParams): Observable<PaginatedResponse<T>>;
  getById(id: string | number): Observable<T>;
  create(item: Omit<T, 'id'>): Observable<T>;
  update(id: string | number, item: Partial<T>): Observable<T>;
  delete(id: string | number): Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class BaseCrudService<T extends CrudEntity> implements CrudOperations<T> {
  protected mockData: T[] = [];

  constructor() {}

  getAll(params?: PaginationParams): Observable<PaginatedResponse<T>> {
    return of(null).pipe(
      delay(500), // Simulate API delay
      map(() => {
        let filteredData = [...this.mockData];

        // Apply filters
        if (params?.filters) {
          Object.keys(params.filters).forEach(key => {
            const filterValue = params.filters![key];
            if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
              filteredData = filteredData.filter(item => 
                item[key]?.toString().toLowerCase().includes(filterValue.toString().toLowerCase())
              );
            }
          });
        }

        // Apply sorting
        if (params?.sortField) {
          filteredData.sort((a, b) => {
            const aVal = a[params.sortField!];
            const bVal = b[params.sortField!];
            let comparison = 0;

            if (aVal > bVal) comparison = 1;
            if (aVal < bVal) comparison = -1;

            return params.sortOrder === 'desc' ? comparison * -1 : comparison;
          });
        }

        // Apply pagination
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return {
          data: paginatedData,
          total: filteredData.length,
          page,
          limit,
          totalPages: Math.ceil(filteredData.length / limit)
        };
      })
    );
  }

  getById(id: string | number): Observable<T> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const item = this.mockData.find(x => x.id === id);
        if (!item) {
          throw new Error(`Item with id ${id} not found`);
        }
        return item;
      })
    );
  }

  create(item: Omit<T, 'id'>): Observable<T> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const newId = this.generateId();
        const newItem = { ...item, id: newId } as T;
        this.mockData.unshift(newItem);
        return newItem;
      })
    );
  }

  update(id: string | number, item: Partial<T>): Observable<T> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const index = this.mockData.findIndex(x => x.id === id);
        if (index === -1) {
          throw new Error(`Item with id ${id} not found`);
        }
        
        this.mockData[index] = { ...this.mockData[index], ...item };
        return this.mockData[index];
      })
    );
  }

  delete(id: string | number): Observable<boolean> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const index = this.mockData.findIndex(x => x.id === id);
        if (index === -1) {
          throw new Error(`Item with id ${id} not found`);
        }
        
        this.mockData.splice(index, 1);
        return true;
      })
    );
  }

  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  protected setMockData(data: T[]): void {
    this.mockData = data;
  }
}

// Example implementation for Users
export interface User extends CrudEntity {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserCrudService extends BaseCrudService<User> {
  constructor() {
    super();
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@company.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'administrator',
        status: 'active',
        createdAt: '2024-01-15T08:00:00Z',
        lastLogin: '2024-03-15T14:30:00Z'
      },
      {
        id: '2',
        username: 'john.doe',
        email: 'john.doe@company.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        status: 'active',
        createdAt: '2024-02-10T10:15:00Z',
        lastLogin: '2024-03-14T16:45:00Z'
      },
      {
        id: '3',
        username: 'jane.smith',
        email: 'jane.smith@company.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'manager',
        status: 'active',
        createdAt: '2024-01-20T12:30:00Z',
        lastLogin: '2024-03-13T09:20:00Z'
      },
      {
        id: '4',
        username: 'bob.wilson',
        email: 'bob.wilson@company.com',
        firstName: 'Bob',
        lastName: 'Wilson',
        role: 'user',
        status: 'inactive',
        createdAt: '2024-03-01T14:45:00Z'
      }
    ];

    this.setMockData(mockUsers);
  }
}