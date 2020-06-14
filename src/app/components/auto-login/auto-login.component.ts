import {Component, OnInit, OnDestroy} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';

@Component({
    selector: 'app-auto-login',
    templateUrl: './auto-login.component.html',
    styleUrls: ['./auto-login.component.scss']
})
export class AutoLoginComponent implements OnInit, OnDestroy {

    constructor(public oidcSecurityService: OidcSecurityService) {
        //this.oidcSecurityService.onModuleSetup.subscribe(() => { this.onModuleSetup(); });
        this.oidcSecurityService.authorize();
    }

    ngOnInit() {
        // if (this.oidcSecurityService.moduleSetup) {
        //   this.onModuleSetup();
        // }
    }

    ngOnDestroy(): void {
        //this.oidcSecurityService.onModuleSetup.unsubscribe();
    }

    private onModuleSetup() {
        this.oidcSecurityService.authorize();
    }

}
