import { ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from './../_services/alertify.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private alertifyService: AlertifyService) { }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (next.firstChild) {
      // ['roles'] is the same name in routes file
      const roles = next.firstChild.data['roles'] as Array<string>;
      if (roles) {
        const match = this.authService.roleMatch(roles);
        if (match) {
          return true;
        } else {
          this.router.navigate(['members']);
          this.alertifyService.error('You are not authorized to access this area.');
        }
      }
    }

    if (this.authService.loggedIn()) {
      return true;
    }

    this.alertifyService.error('You need to be logged in to access this area.');
    this.router.navigate(['/home']);
    return false;
  }
}
