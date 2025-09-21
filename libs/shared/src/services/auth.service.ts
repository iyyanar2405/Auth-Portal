import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService {
  private readonly STORAGE_KEY = 'auth_user';
  private readonly STATIC_CREDENTIALS = {
    username: 'admin',
    password: 'password123'
  };

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in on service initialization
    this.checkAuthStatus();
  }

  /**
   * Authenticate user with static credentials
   */
  login(credentials: LoginCredentials): Observable<boolean> {
    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        if (this.validateCredentials(credentials)) {
          const user: User = {
            id: '1',
            username: credentials.username,
            email: 'admin@company.com',
            role: 'administrator'
          };

          this.setCurrentUser(user);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);

          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      }, 1000);
    });
  }

  /**
   * Logout user and clear session
   */
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user information
   */
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Validate static credentials
   */
  private validateCredentials(credentials: LoginCredentials): boolean {
    return credentials.username === this.STATIC_CREDENTIALS.username &&
           credentials.password === this.STATIC_CREDENTIALS.password;
  }

  /**
   * Set current user in local storage and memory
   */
  private setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  /**
   * Check if there's a valid token in storage
   */
  private hasValidToken(): boolean {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    return !!userData;
  }

  /**
   * Check authentication status on service initialization
   */
  private checkAuthStatus(): void {
    const user = this.getCurrentUser();
    if (user) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(user);
    }
  }
}