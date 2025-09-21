import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { 
  LoginViewModel, 
  TokenModel, 
  TokenModelApiResponse, 
  UserModel, 
  ApiResponse,
  RegisterViewModel,
  ForgotPasswordViewModel,
  ResetPasswordViewModel,
  API_BASE_URL,
  API_ENDPOINTS
} from '../models/api-models';

export interface User {
  id: string;
  email: string;
  roles: string[];
  emailConfirmed: boolean;
  tfaEnabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.currentUserSubject.pipe(
    map(user => !!user)
  );

  private readonly STORAGE_KEYS = {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'current_user'
  } as const;

  constructor() {
    // Check for stored authentication on service initialization
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const storedToken = localStorage.getItem(this.STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(this.STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        this.tokenSubject.next(storedToken);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearStoredData();
      }
    }
  }

  private clearStoredData(): void {
    localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(this.STORAGE_KEYS.USER);
  }

  private getHeaders(): HttpHeaders {
    const token = this.tokenSubject.value;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Authenticate user and generate access token
   */
  login(credentials: LoginViewModel): Observable<User> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.TOKEN}`;
    
    return this.http.post<TokenModelApiResponse>(url, credentials).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Login failed');
        }
        
        const tokenData = response.data;
        
        // Store tokens
        if (tokenData.access_token) {
          localStorage.setItem(this.STORAGE_KEYS.TOKEN, tokenData.access_token);
          this.tokenSubject.next(tokenData.access_token);
        }
        
        if (tokenData.refreshToken) {
          localStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken);
        }

        // Create user object from token data
        const user: User = {
          id: tokenData.refreshToken, // Using refresh token as temp ID until we get user info
          email: credentials.userName, // Using username as email for now
          roles: [], // Will be populated by getUserInfo call
          emailConfirmed: tokenData.hasVerifiedEmail || false,
          tfaEnabled: tokenData.tfaEnabled || false
        };

        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
        this.currentUserSubject.next(user);

        // Fetch detailed user info after successful login
        this.getUserInfo().subscribe({
          next: (userInfo) => {
            const updatedUser: User = {
              ...user,
              email: userInfo.email || user.email,
              roles: userInfo.roles || [],
              emailConfirmed: userInfo.emailConfirmed,
              tfaEnabled: userInfo.tfaEnabled
            };
            localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);
          },
          error: (error) => {
            console.warn('Failed to fetch user info after login:', error);
          }
        });

        return user;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Login failed'));
      })
    );
  }

  /**
   * Register a new user account
   */
  register(registrationData: RegisterViewModel): Observable<ApiResponse> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`;
    
    return this.http.post<ApiResponse>(url, registrationData).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error(error.error?.message || 'Registration failed'));
      })
    );
  }

  /**
   * Log out user
   */
  logout(): Observable<boolean> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`;
    const loginData: LoginViewModel = {
      userName: this.currentUserSubject.value?.email || '',
      password: '' // Password not needed for logout
    };

    return this.http.post<ApiResponse<boolean>>(url, loginData, { headers: this.getHeaders() }).pipe(
      map(response => {
        // Clear local storage and subjects regardless of API response
        this.clearStoredData();
        this.tokenSubject.next(null);
        this.currentUserSubject.next(null);
        
        return response.success && response.data === true;
      }),
      catchError(error => {
        // Even if logout API fails, clear local data
        this.clearStoredData();
        this.tokenSubject.next(null);
        this.currentUserSubject.next(null);
        
        console.error('Logout error:', error);
        return throwError(() => new Error(error.error?.message || 'Logout failed'));
      })
    );
  }

  /**
   * Get current user information
   */
  getUserInfo(): Observable<UserModel> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.MANAGE_USER_INFO}`;
    
    return this.http.get<ApiResponse<UserModel>>(url, { headers: this.getHeaders() }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch user info');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Get user info error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to fetch user info'));
      })
    );
  }

  /**
   * Forgot password - sends reset email
   */
  forgotPassword(email: string): Observable<ApiResponse> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.FORGOT_PASSWORD}`;
    const data: ForgotPasswordViewModel = { email };
    
    return this.http.post<ApiResponse>(url, data).pipe(
      catchError(error => {
        console.error('Forgot password error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to send reset email'));
      })
    );
  }

  /**
   * Reset password with token
   */
  resetPassword(resetData: ResetPasswordViewModel): Observable<ApiResponse> {
    const url = `${API_BASE_URL}${API_ENDPOINTS.RESET_PASSWORD}`;
    
    return this.http.post<ApiResponse>(url, resetData).pipe(
      catchError(error => {
        console.error('Reset password error:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to reset password'));
      })
    );
  }

  /**
   * Refresh JWT token using refresh token
   */
  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const url = `${API_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}/${refreshToken}`;
    
    return this.http.post<ApiResponse>(url, {}).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Token refresh failed');
        }
        
        // Handle the new token (implementation depends on API response structure)
        // This would need to be adjusted based on the actual refresh token response
        return 'new-token'; // Placeholder
      }),
      catchError(error => {
        console.error('Refresh token error:', error);
        // If refresh fails, logout user
        this.logout().subscribe();
        return throwError(() => new Error(error.error?.message || 'Token refresh failed'));
      })
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value && !!this.tokenSubject.value;
  }

  /**
   * Get current user data
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Check if current user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  /**
   * Check if current user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user?.roles) return false;
    
    return roles.some(role => user.roles.includes(role));
  }

  /**
   * Check if current user has all of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user?.roles) return false;
    
    return roles.every(role => user.roles.includes(role));
  }
}