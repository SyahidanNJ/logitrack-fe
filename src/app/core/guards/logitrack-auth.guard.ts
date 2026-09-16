import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LogitrackAuthService } from '../services/logitrack-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: LogitrackAuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // Check roles if required by route
      const expectedRoles = route.data['roles'];
      if (expectedRoles && expectedRoles.length > 0) {
        if (!expectedRoles.includes(currentUser.role)) {
          // Role not authorized
          this.router.navigate(['/dashboards']);
          return false;
        }
      }
      // Logged in and authorized
      return true;
    }

    // Not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
