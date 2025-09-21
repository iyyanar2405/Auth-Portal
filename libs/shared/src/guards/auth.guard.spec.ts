import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';

import { createAuthServiceMock, createRouteServiceMock } from '../__mocks__';
import { AuthTokenConstants } from '../constants';
import { AuthService } from '../services';
import { authGuard } from './auth.guard';

async function getValue<T>(maybeAsync: MaybeAsync<T>): Promise<T> {
  if (maybeAsync instanceof Observable) {
    return firstValueFrom(maybeAsync);
  }

  if (maybeAsync instanceof Promise) {
    return maybeAsync;
  }

  return maybeAsync;
}

describe('authGuard', () => {
  const authService: Partial<AuthService> = createAuthServiceMock();
  const routeServiceMock: Partial<Router> = createRouteServiceMock();
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: routeServiceMock },
      ],
    });

    route = {} as ActivatedRouteSnapshot;
    state = {} as RouterStateSnapshot;
  });

  test('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  test('should allow the authenticated user to access the route', async () => {
    // Arrange
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1); // Set expiry 1 hour in future
    localStorage.setItem(
      AuthTokenConstants.TOKEN_EXPIRY_KEY,
      futureDate.toISOString(),
    );

    // Act
    const result = await getValue(
      TestBed.runInInjectionContext(() => authGuard(route, state)),
    );

    // Assert
    expect(result).toBe(true);

    // Cleanup
    localStorage.removeItem(AuthTokenConstants.TOKEN_EXPIRY_KEY);
  });

  test('should not allow access when token is expired', async () => {
    // Arrange
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 1); // Set expiry 1 hour in past
    localStorage.setItem(
      AuthTokenConstants.TOKEN_EXPIRY_KEY,
      pastDate.toISOString(),
    );

    // Act
    const result = await getValue(
      TestBed.runInInjectionContext(() => authGuard(route, state)),
    );

    // Assert
    expect(result).toBe(false);

    // Cleanup
    localStorage.removeItem(AuthTokenConstants.TOKEN_EXPIRY_KEY);
  });
});
