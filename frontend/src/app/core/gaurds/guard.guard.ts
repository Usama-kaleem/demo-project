import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guardGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const auth = inject(AuthService);
  const demosession = localStorage.getItem('session');
  if(demosession) {
    //console.log('demosession:', demosession);
    return true;
  }
  router.navigate(['/auth/login']);
  return false;
};
