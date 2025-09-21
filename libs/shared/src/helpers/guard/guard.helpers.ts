import { Router, UrlTree } from '@angular/router';

export const isAuthenticated = (
  auth: boolean,
  router: Router,
): boolean | UrlTree => {
  if (auth) {
    return true;
  }

  return router.createUrlTree([]);
};
