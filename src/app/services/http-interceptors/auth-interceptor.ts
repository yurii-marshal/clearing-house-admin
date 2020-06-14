import {Injectable, Injector} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Router} from "@angular/router";
import 'rxjs/add/operator/do';
import {TransitionsService} from "../transitions.service";
import {RequestsService} from "./requests.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private oidcSecurityService: OidcSecurityService;

    authService: any;

    constructor(private injector: Injector,
                private transitionService: TransitionsService,
                private requestsService: RequestsService,
                private router: Router) {
    }

    logout() {
        this.authService.logout();
        this.router.navigate(["login"]);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let requestToForward = req;
        // this.transitionService.transiteLoadingProgress(true);
        if (this.oidcSecurityService === undefined) {
            this.oidcSecurityService = this.injector.get(OidcSecurityService);
        }
        if (this.oidcSecurityService !== undefined) {
            let token = this.oidcSecurityService.getToken();
            if (token !== "") {
                let tokenValue = "Bearer " + token;
                // console.log(tokenValue);
                requestToForward = req.clone({setHeaders: {"Authorization": tokenValue}});
            }
        } else {
            console.debug("OidcSecurityService undefined: NO auth header!");
        }

        return next.handle(requestToForward).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    console.log(err);
                    // this.router.navigate( ['/unauthorized'] );
                    // this.oidcSecurityService.authorize();
                }
            }
        }, () => {
            // this.transitionService.transiteLoadingProgress(false);
        });
    }
}
