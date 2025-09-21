import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  RoleResponseDto, 
  CreateRoleDto,
  RoleResponseDtoApiResponse,
  RoleResponseDtoPagedResponseDtoApiResponse,
  UserResponseDtoPagedResponseDtoApiResponse,
  UserResponseDto,
  ApiResponse,
  PaginationParams,
  PagedResponseDto,
  API_BASE_URL,
  API_ENDPOINTS
} from '../models/api-models';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly http = inject(HttpClient);

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Get all roles with pagination and optional search
   */
  getRoles(params?: PaginationParams): Observable<PagedResponseDto<RoleResponseDto>> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ROLE}`;
    
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

    return this.http.get<RoleResponseDtoPagedResponseDtoApiResponse>(url, {
      headers: this.getAuthHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch roles');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Get roles error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch roles'));
      })
    );
  }

  /**
   * Get a specific role by ID
   */
  getRole(id: string): Observable<RoleResponseDto> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ROLE_BY_ID}/${id}`;
    
    return this.http.get<RoleResponseDtoApiResponse>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch role');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Get role error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch role'));
      })
    );
  }

  /**
   * Create a new role
   */
  createRole(roleData: CreateRoleDto): Observable<RoleResponseDto> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ROLE}`;
    
    return this.http.post<RoleResponseDtoApiResponse>(url, roleData, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create role');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Create role error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to create role'));
      })
    );
  }

  /**
   * Update an existing role
   */
  updateRole(id: string, roleData: CreateRoleDto): Observable<RoleResponseDto> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ROLE_BY_ID}/${id}`;
    
    return this.http.put<RoleResponseDtoApiResponse>(url, roleData, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update role');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Update role error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to update role'));
      })
    );
  }

  /**
   * Delete a role
   */
  deleteRole(id: string): Observable<boolean> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ROLE_BY_ID}/${id}`;
    
    return this.http.delete<ApiResponse>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => {
        return response.success;
      }),
      catchError(error => {
        console.error('Delete role error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to delete role'));
      })
    );
  }

  /**
   * Get all users assigned to a specific role
   */
  getRoleUsers(roleId: string, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResponseDto<UserResponseDto>> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ROLE_USERS.replace('{id}', roleId)}`;
    
    const httpParams = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<UserResponseDtoPagedResponseDtoApiResponse>(url, {
      headers: this.getAuthHeaders(),
      params: httpParams
    }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch role users');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Get role users error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch role users'));
      })
    );
  }

  /**
   * Search roles by name or description
   */
  searchRoles(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<PagedResponseDto<RoleResponseDto>> {
    return this.getRoles({
      searchTerm,
      pageNumber,
      pageSize
    });
  }

  /**
   * Get total role count
   */
  getRoleCount(): Observable<number> {
    return this.getRoles({ pageNumber: 1, pageSize: 1 }).pipe(
      map(response => response.totalCount)
    );
  }

  /**
   * Get all roles (without pagination) - useful for dropdowns
   */
  getAllRoles(): Observable<RoleResponseDto[]> {
    return this.getRoles({ pageNumber: 1, pageSize: 1000 }).pipe(
      map(response => response.items || [])
    );
  }

  /**
   * Check if role name is available
   */
  isRoleNameAvailable(name: string, excludeId?: string): Observable<boolean> {
    return this.searchRoles(name, 1, 10).pipe(
      map(response => {
        const existingRoles = response.items || [];
        return !existingRoles.some(role => 
          role.name?.toLowerCase() === name.toLowerCase() && 
          role.id !== excludeId
        );
      })
    );
  }

  /**
   * Get role statistics
   */
  getRoleStatistics(): Observable<{
    totalRoles: number;
    rolesWithUsers: number;
    rolesWithoutUsers: number;
    averageUsersPerRole: number;
  }> {
    return this.getAllRoles().pipe(
      map(roles => {
        const totalRoles = roles.length;
        const rolesWithUsers = roles.filter(role => role.userCount > 0).length;
        const rolesWithoutUsers = totalRoles - rolesWithUsers;
        const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0);
        const averageUsersPerRole = totalRoles > 0 ? totalUsers / totalRoles : 0;

        return {
          totalRoles,
          rolesWithUsers,
          rolesWithoutUsers,
          averageUsersPerRole: Math.round(averageUsersPerRole * 100) / 100
        };
      })
    );
  }

  /**
   * Batch delete roles
   */
  batchDeleteRoles(roleIds: string[]): Observable<boolean[]> {
    const deleteOperations = roleIds.map(id => this.deleteRole(id));
    
    return new Observable(observer => {
      let completed = 0;
      const results: boolean[] = [];
      
      deleteOperations.forEach((operation, index) => {
        operation.subscribe({
          next: (success) => {
            results[index] = success;
            completed++;
            if (completed === roleIds.length) {
              observer.next(results);
              observer.complete();
            }
          },
          error: (error) => {
            results[index] = false;
            completed++;
            if (completed === roleIds.length) {
              observer.next(results);
              observer.complete();
            }
          }
        });
      });
    });
  }

  /**
   * Export roles data (client-side implementation)
   */
  exportRoles(format: 'json' | 'csv' = 'json'): Observable<Blob> {
    return this.getAllRoles().pipe(
      map(roles => {
        if (format === 'csv') {
          const headers = ['ID', 'Name', 'Description', 'User Count'];
          const csvContent = [
            headers.join(','),
            ...roles.map(role => [
              role.id || '',
              role.name || '',
              role.description || '',
              role.userCount.toString()
            ].join(','))
          ].join('\n');
          
          return new Blob([csvContent], { type: 'text/csv' });
        } else {
          return new Blob([JSON.stringify(roles, null, 2)], { type: 'application/json' });
        }
      })
    );
  }

  /**
   * Get roles by user count range
   */
  getRolesByUserCount(minUsers: number = 0, maxUsers: number = Number.MAX_SAFE_INTEGER): Observable<RoleResponseDto[]> {
    return this.getAllRoles().pipe(
      map(roles => roles.filter(role => 
        role.userCount >= minUsers && role.userCount <= maxUsers
      ))
    );
  }

  /**
   * Get most popular roles (by user count)
   */
  getMostPopularRoles(limit: number = 5): Observable<RoleResponseDto[]> {
    return this.getAllRoles().pipe(
      map(roles => 
        roles
          .sort((a, b) => b.userCount - a.userCount)
          .slice(0, limit)
      )
    );
  }

  /**
   * Get least popular roles (by user count)
   */
  getLeastPopularRoles(limit: number = 5): Observable<RoleResponseDto[]> {
    return this.getAllRoles().pipe(
      map(roles => 
        roles
          .sort((a, b) => a.userCount - b.userCount)
          .slice(0, limit)
      )
    );
  }
}