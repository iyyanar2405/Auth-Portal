import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';

import { AuthTokenConstants } from '../constants/auth-constants';

export const authGuard: CanActivateFn = () => {
  const tokenExpiry = localStorage.getItem(AuthTokenConstants.TOKEN_EXPIRY_KEY);

  if (!tokenExpiry) {
    return of(false);
  }

  const expiryDate = new Date(tokenExpiry);
  const currentDateUtc = new Date(Date.now());

  return of(expiryDate > currentDateUtc);
};
