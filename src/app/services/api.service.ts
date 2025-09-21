import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiEndpointInfo } from '../../../libs/shared/src/models/api-models';

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
export class ApiService {
  private http = inject(HttpClient);
  private authTokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
  public authToken$ = this.authTokenSubject.asObservable();

  constructor() {}

  // Authentication token management
  private getStoredToken(): string | null {
    return this.getCookie('auth_token') || localStorage.getItem('auth_token');
  }

  setAuthToken(token: string): void {
    this.authTokenSubject.next(token);
    this.setCookie('auth_token', token);
    localStorage.setItem('auth_token', token);
  }

  clearAuthToken(): void {
    this.authTokenSubject.next(null);
    this.deleteCookie('auth_token');
    localStorage.removeItem('auth_token');
  }

  getCurrentToken(): string | null {
    return this.authTokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentToken();
  }

  // Cookie management
  setCookie(name: string, value: string, days: number = 7): void {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  }

  getCookie(name: string): string | null {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // API Testing functionality
  async testEndpoint(payload: TestPayload): Promise<EndpointTestResult> {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...payload.headers
      });

      const baseUrl = 'https://localhost:7119';
      const fullUrl = `${baseUrl}${payload.endpoint}`;

      let response: any;
      const options = { headers, observe: 'response' as const };

      switch (payload.method.toUpperCase()) {
        case 'GET':
          response = await this.http.get(fullUrl, options).toPromise();
          break;
        case 'POST':
          const postBody = payload.body ? JSON.parse(payload.body) : {};
          response = await this.http.post(fullUrl, postBody, options).toPromise();
          break;
        case 'PUT':
          const putBody = payload.body ? JSON.parse(payload.body) : {};
          response = await this.http.put(fullUrl, putBody, options).toPromise();
          break;
        case 'DELETE':
          response = await this.http.delete(fullUrl, options).toPromise();
          break;
        default:
          throw new Error(`Unsupported method: ${payload.method}`);
      }

      return {
        success: true,
        status: response.status,
        data: response.body,
        timestamp: new Date()
      };
    } catch (error: any) {
      return {
        success: false,
        status: error.status || 500,
        error: error.message || 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getCurrentToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Utility methods for endpoint information
  copyCurlCommand(endpoint: ApiEndpointInfo): void {
    const token = this.getCurrentToken();
    const baseUrl = 'https://localhost:7119';
    
    let curlCommand = `curl -X ${endpoint.method} "${baseUrl}${endpoint.endpoint}"`;
    
    if (token) {
      curlCommand += ` -H "Authorization: Bearer ${token}"`;
    }
    
    if (['POST', 'PUT'].includes(endpoint.method)) {
      curlCommand += ` -H "Content-Type: application/json"`;
      curlCommand += ` -d '{}'`;
    }

    navigator.clipboard.writeText(curlCommand).then(() => {
      console.log('cURL command copied to clipboard');
    });
  }

  // Authentication specific methods
  async login(credentials: { userName: string; password: string; deviceCode?: string }): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/Authorize/token',
      method: 'POST',
      body: JSON.stringify(credentials)
    };
    
    const result = await this.testEndpoint(payload);
    if (result.success && result.data?.access_token) {
      this.setAuthToken(result.data.access_token);
    }
    return result;
  }

  async logout(): Promise<any> {
    if (!this.isLoggedIn()) {
      return { success: true, message: 'Already logged out' };
    }

    const payload: TestPayload = {
      endpoint: '/api/Authorize/LogOut',
      method: 'POST'
    };
    
    const result = await this.testEndpoint(payload);
    this.clearAuthToken();
    return result;
  }

  async register(userData: { userName?: string; email: string; password: string; confirmPassword?: string }): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/Authorize/register',
      method: 'POST',
      body: JSON.stringify(userData)
    };
    
    return await this.testEndpoint(payload);
  }

  async forgotPassword(email: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/Authorize/forgotPassword',
      method: 'POST',
      body: JSON.stringify({ email })
    };
    
    return await this.testEndpoint(payload);
  }

  async resetPassword(resetData: { userId: string; password: string; confirmPassword?: string; code?: string }): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/Authorize/resetPassword',
      method: 'POST',
      body: JSON.stringify(resetData)
    };
    
    return await this.testEndpoint(payload);
  }

  async confirmEmail(confirmData: { userId?: string; code?: string }): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/Authorize/confirm-email',
      method: 'POST',
      body: JSON.stringify(confirmData)
    };
    
    return await this.testEndpoint(payload);
  }

  // Claims Management Methods
  async createClaim(claimData: { type: string; value: string; userId?: string; issuer?: string }): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/Claims',
      method: 'POST',
      body: JSON.stringify(claimData)
    };
    
    return await this.testEndpoint(payload);
  }

  async updateClaim(id: string, claimData: { type: string; value: string; issuer?: string }): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/Claims/${id}`,
      method: 'PUT',
      body: JSON.stringify(claimData)
    };
    
    return await this.testEndpoint(payload);
  }

  async searchClaims(searchParams: { searchTerm?: string; type?: string; pageNumber?: number; pageSize?: number }): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (searchParams.searchTerm) queryParams.append('searchTerm', searchParams.searchTerm);
    if (searchParams.type) queryParams.append('type', searchParams.type);
    if (searchParams.pageNumber) queryParams.append('pageNumber', searchParams.pageNumber.toString());
    if (searchParams.pageSize) queryParams.append('pageSize', searchParams.pageSize.toString());
    
    const endpoint = `/api/Claims${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const payload: TestPayload = {
      endpoint,
      method: 'GET'
    };
    
    return await this.testEndpoint(payload);
  }

  async getUserClaims(userId: string, pageNumber?: number, pageSize?: number): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (pageNumber) queryParams.append('pageNumber', pageNumber.toString());
    if (pageSize) queryParams.append('pageSize', pageSize.toString());
    
    const endpoint = `/api/Claims/user/${userId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const payload: TestPayload = {
      endpoint,
      method: 'GET'
    };
    
    return await this.testEndpoint(payload);
  }

  async deleteClaim(id: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/Claims/${id}`,
      method: 'DELETE'
    };
    
    return await this.testEndpoint(payload);
  }

  async getClaimsByType(type: string, pageNumber?: number, pageSize?: number): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (pageNumber) queryParams.append('pageNumber', pageNumber.toString());
    if (pageSize) queryParams.append('pageSize', pageSize.toString());
    
    const endpoint = `/api/Claims/type/${type}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const payload: TestPayload = {
      endpoint,
      method: 'GET'
    };
    
    return await this.testEndpoint(payload);
  }

  // User Role Management Methods
  async assignUserRole(userId: string, roleId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/UserRoles/assign',
      method: 'POST',
      body: JSON.stringify({ userId, roleId })
    };
    
    return await this.testEndpoint(payload);
  }

  async removeUserRole(userId: string, roleId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/UserRoles/remove',
      method: 'DELETE',
      body: JSON.stringify({ userId, roleId })
    };
    
    return await this.testEndpoint(payload);
  }

  async getUserRoles(userId: string, pageNumber?: number, pageSize?: number): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (pageNumber) queryParams.append('pageNumber', pageNumber.toString());
    if (pageSize) queryParams.append('pageSize', pageSize.toString());
    
    const endpoint = `/api/UserRoles/user/${userId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const payload: TestPayload = {
      endpoint,
      method: 'GET'
    };
    
    return await this.testEndpoint(payload);
  }

  async getRoleUsers(roleId: string, pageNumber?: number, pageSize?: number): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (pageNumber) queryParams.append('pageNumber', pageNumber.toString());
    if (pageSize) queryParams.append('pageSize', pageSize.toString());
    
    const endpoint = `/api/UserRoles/role/${roleId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const payload: TestPayload = {
      endpoint,
      method: 'GET'
    };
    
    return await this.testEndpoint(payload);
  }

  async bulkAssignRoles(userIds: string[], roleIds: string[]): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/UserRoles/bulk-assign',
      method: 'POST',
      body: JSON.stringify({ userIds, roleIds })
    };
    
    return await this.testEndpoint(payload);
  }

  async removeAllUserRoles(userId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/UserRoles/user/${userId}/roles`,
      method: 'DELETE'
    };
    
    return await this.testEndpoint(payload);
  }

  async removeAllRoleUsers(roleId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/UserRoles/role/${roleId}/users`,
      method: 'DELETE'
    };
    
    return await this.testEndpoint(payload);
  }

  // Account Management Methods
  async updateAccount(updateData: { userId: string; email?: string; firstName?: string; lastName?: string; phoneNumber?: string; userName?: string }): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/Account/profile/${updateData.userId}`,
      method: 'PUT',
      body: JSON.stringify(updateData)
    };
    
    return await this.testEndpoint(payload);
  }

  async changePassword(passwordData: { userId: string; currentPassword: string; newPassword: string; confirmPassword: string }): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/Account/change-password',
      method: 'POST',
      body: JSON.stringify(passwordData)
    };
    
    return await this.testEndpoint(payload);
  }

  async lockAccount(userId: string, lockoutEnd?: Date, reason?: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/Account/lock/${userId}`,
      method: 'POST',
      body: JSON.stringify({ lockoutEnd, reason })
    };
    
    return await this.testEndpoint(payload);
  }

  async unlockAccount(userId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/Account/unlock/${userId}`,
      method: 'POST'
    };
    
    return await this.testEndpoint(payload);
  }

  async updateAccountProfile(profileData: { userId: string; profileData: any }): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/Account/profile/${profileData.userId}`,
      method: 'PUT',
      body: JSON.stringify(profileData.profileData)
    };
    
    return await this.testEndpoint(payload);
  }

  async getAccount(userId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/Account/profile/${userId}`,
      method: 'GET'
    };
    
    return await this.testEndpoint(payload);
  }

  async getCurrentAccount(): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/Account/profile',
      method: 'GET'
    };
    
    return await this.testEndpoint(payload);
  }

  async deactivateAccount(deactivateData: { userId: string; reason?: string; transferDataTo?: string }): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/Account/deactivate',
      method: 'POST',
      body: JSON.stringify(deactivateData)
    };
    
    return await this.testEndpoint(payload);
  }

  async activateAccount(userId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/Account/activate/${userId}`,
      method: 'POST'
    };
    
    return await this.testEndpoint(payload);
  }

  async deleteAccount(userId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/Account/delete/${userId}`,
      method: 'DELETE'
    };
    
    return await this.testEndpoint(payload);
  }

  // Additional utility methods for cURL generation and API schema
  generateCurlCommand(endpoint: string, method: string, data: any): string {
    const baseUrl = 'https://localhost:7119';
    let curlCommand = `curl -X ${method.toUpperCase()} "${baseUrl}${endpoint}"`;
    
    const token = this.getCurrentToken();
    if (token) {
      curlCommand += ` -H "Authorization: Bearer ${token}"`;
    }
    
    if (method.toUpperCase() !== 'GET' && data) {
      curlCommand += ` -H "Content-Type: application/json" -d '${JSON.stringify(data)}'`;
    }
    
    return curlCommand;
  }

  private getAuthToken(): string | null {
    return this.getCurrentToken();
  }

  // Two-Factor Authentication API Methods
  async setupTwoFactor(data: {
    userId: string;
    method: 'sms' | 'email' | 'authenticator';
    phoneNumber?: string;
    email?: string;
  }): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/TwoFactor/setup',
      method: 'POST',
      body: JSON.stringify(data)
    };
    
    return await this.testEndpoint(payload);
  }

  async verifyTwoFactor(data: {
    userId: string;
    code: string;
    method: 'sms' | 'email' | 'authenticator';
  }): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/TwoFactor/verify',
      method: 'POST',
      body: JSON.stringify(data)
    };
    
    return await this.testEndpoint(payload);
  }

  async disableTwoFactor(data: {
    userId: string;
    verificationCode: string;
  }): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/TwoFactor/disable',
      method: 'POST',
      body: JSON.stringify(data)
    };
    
    return await this.testEndpoint(payload);
  }

  async getTwoFactorStatus(userId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/TwoFactor/status/${userId}`,
      method: 'GET'
    };
    
    return await this.testEndpoint(payload);
  }

  async getRecoveryCodes(userId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/TwoFactor/recovery-codes?userId=${userId}`,
      method: 'GET'
    };
    
    return await this.testEndpoint(payload);
  }

  async regenerateRecoveryCodes(userId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: '/api/TwoFactor/recovery-codes',
      method: 'POST',
      body: JSON.stringify({ userId })
    };
    
    return await this.testEndpoint(payload);
  }

  async getAuthenticatorQrCode(userId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/TwoFactor/authenticator/qrcode?userId=${userId}`,
      method: 'GET'
    };
    
    return await this.testEndpoint(payload);
  }

  async getAuthenticatorManualKey(userId: string): Promise<any> {
    const payload: TestPayload = {
      endpoint: `/api/TwoFactor/authenticator/manual-key?userId=${userId}`,
      method: 'GET'
    };
    
    return await this.testEndpoint(payload);
  }
}