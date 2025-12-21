import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);

  const isAuth = await authService.isAuthenticated();

  if (isAuth) {
    return true;
  }

  // Init login flow
  authService.login();
  return false;
};
