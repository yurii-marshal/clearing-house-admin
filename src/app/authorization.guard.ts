import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(
    public router: Router,
    private oidcSecurityService: OidcSecurityService
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // console.log(route, state);
    return this.oidcSecurityService.getIsAuthorized().pipe(
      map((isAuthorized: boolean) => {
        // console.log('AuthorizationGuard isAuthorized: ' + isAuthorized);
        if (!isAuthorized) {
            this.router.navigate(['/unauthorized']);
            return false;
        }
        return true;
      })
    );
  }
}
