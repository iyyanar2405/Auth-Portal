import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  UserResponseDto, 
  CreateUserDto, 
  UpdateUserDto,
  UserResponseDtoApiResponse,
  UserResponseDtoPagedResponseDtoApiResponse,
  ApiResponse,
  PaginationParams,
  PagedResponseDto,
  API_BASE_URL,
  API_ENDPOINTS
} from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Get all users with pagination and optional search
   */
  getUsers(params?: PaginationParams): Observable<PagedResponseDto<UserResponseDto>> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.USER}`;
    
    let httpParams = new HttpParams();
    if (params?.pageNumber) {
      httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }
    if (params?.searchTerm) {
      httpParams = httpParams.set('searchTerm', params.searchTerm);
    }

    return this.http.get<UserResponseDtoPagedResponseDtoApiResponse>(url, {
      headers: this.getAuthHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch users');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Get users error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch users'));
      })
    );
  }

  /**
   * Get a specific user by ID
   */
  getUser(id: string): Observable<UserResponseDto> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.USER_BY_ID}/${id}`;
    
    return this.http.get<UserResponseDtoApiResponse>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch user');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Get user error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch user'));
      })
    );
  }

  /**
   * Create a new user
   */
  createUser(userData: CreateUserDto): Observable<UserResponseDto> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.USER}`;
    
    return this.http.post<UserResponseDtoApiResponse>(url, userData, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create user');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Create user error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create user'));
      })
    );
  }

  /**
   * Update an existing user
   */
  updateUser(id: string, userData: UpdateUserDto): Observable<UserResponseDto> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.USER_BY_ID}/${id}`;
    
    return this.http.put<UserResponseDtoApiResponse>(url, userData, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update user');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Update user error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update user'));
      })
    );
  }

  /**
   * Delete a user
   */
  deleteUser(id: string): Observable<boolean> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.USER_BY_ID}/${id}`;
    
    return this.http.delete<ApiResponse>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        return response.success;
      }),
      catchError(error => {
        console.error('Delete user error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete user'));
      })
    );
  }

  /**
   * Lock out a user account
   */
  lockoutUser(id: string, lockoutEnd?: Date): Observable<boolean> {
    let url = `${API_BASE_URL}${API_ENDPOINTS.USER_LOCKOUT.replace('{id}', id)}`;
    
    let httpParams = new HttpParams();
    if (lockoutEnd) {
      httpParams = httpParams.set('lockoutEnd', lockoutEnd.toISOString());
    }
    
    return this.http.post<ApiResponse>(url, {}, {
      headers: this.getAuthHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        return response.success;
      }),
      catchError(error => {
        console.error('Lockout user error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to lockout user'));
      })
    );
  }

  /**
   * Unlock a user account
   */
  unlockUser(id: string): Observable<boolean> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.USER_UNLOCK.replace('{id}', id)}`;
    
    return this.http.post<ApiResponse>(url, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        return response.success;
      }),
      catchError(error => {
        console.error('Unlock user error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to unlock user'));
      })
    );
  }

  /**
   * Reset user password (Admin only)
   */
  resetUserPassword(id: string, newPassword: string): Observable<boolean> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.USER_RESET_PASSWORD.replace('{id}', id)}`;
    
    return this.http.post<ApiResponse>(url, newPassword, {
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    }).pipe(
      map(response => {
        return response.success;
      }),
      catchError(error => {
        console.error('Reset user password error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to reset user password'));
      })
    );
  }

  /**
   * Check if user is authenticated with credentials
   */
  isUserAuthenticated(credentials: { userName: string; password: string }): Observable<boolean> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.USER_IS_AUTHENTICATED}`;
    
    return this.http.post<ApiResponse<boolean>>(url, credentials, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        return response.success && response.data === true;
      }),
      catchError(error => {
        console.error('Check user authentication error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to check user authentication'));
      })
    );
  }

  /**
   * Search users by email or other criteria
   */
  searchUsers(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResponseDto<UserResponseDto>> {
    return this.getUsers({
      searchTerm,
      pageNumber,
      pageSize
    });
  }

  /**
   * Get total user count
   */
  getUserCount(): Observable<number> {
    return this.getUsers({ pageNumber: 1, pageSize: 1 }).pipe(
      map(response => response.totalCount)
    );
  }

  /**
   * Batch operations helper
   */
  batchDeleteUsers(userIds: string[]): Observable<boolean[]> {
    const deleteOperations = userIds.map(id => this.deleteUser(id));
    
    // Note: This could be optimized with a dedicated batch API endpoint
    return new Observable(observer => {
      let completed = 0;
      const results: boolean[] = [];
      
      deleteOperations.forEach((operation, index) => {
        operation.subscribe({
          next: (success) => {
            results[index] = success;
            completed++;
            if (completed === userIds.length) {
              observer.next(results);
              observer.complete();
            }
          },
          error: (error) => {
            results[index] = false;
            completed++;
            if (completed === userIds.length) {
              observer.next(results);
              observer.complete();
            }
          }
        });
      });
    });
  }

  /**
   * Export users data (client-side implementation)
   */
  exportUsers(format: 'json' | 'csv' = 'json'): Observable<Blob> {
    return this.getUsers({ pageNumber: 1, pageSize: 1000 }).pipe(
      map(response => {
        const users = response.items || [];
        
        if (format === 'csv') {
          const headers = ['ID', 'Email', 'Phone', 'Email Confirmed', 'Lockout Enabled', '2FA Enabled', 'Roles'];
          const csvContent = [
            headers.join(','),
            ...users.map(user => [
              user.id || '',
              user.email || '',
              user.phoneNumber || '',
              user.emailConfirmed.toString(),
              user.lockoutEnabled.toString(),
              user.twoFactorEnabled.toString(),
              (user.roles || []).join(';')
            ].join(','))
          ].join('\n');
          
          return new Blob([csvContent], { type: 'text/csv' });
        } else {
          return new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
        }
      })
    );
  }
}