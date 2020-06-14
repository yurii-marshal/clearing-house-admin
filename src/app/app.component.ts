import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {AuthorizationResult, OidcSecurityService} from 'angular-auth-oidc-client';
import {NavigationEnd, Router} from '@angular/router';
import {DOCUMENT} from "@angular/common";
import {LocalstorageService} from "./services/localstorage.service";
import {TranslateService} from "@ngx-translate/core";
import {UserApiService} from "./services/api/user-api.service";
import {DictionariesService} from "./services/api/dictionaries-api.service";
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {NgbDateCustomParserFormatter} from "./services/ngb-date-custom-parser-formatter";
import {TransitionsService} from "./services/transitions.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}]
})
export class AppComponent implements OnInit {
    navIsFixed: boolean;
    modeIsLTR: boolean;
    userData: any;

    constructor(public oidcSecurityService: OidcSecurityService,
                private translateService: TranslateService,
                private transitionService: TransitionsService,
                private storageService: LocalstorageService,
                private userService: UserApiService,
                private dictionaryService: DictionariesService,
                @Inject(DOCUMENT) private document: Document,
                public router: Router) {
    }

    public changeModeScrollBtn() {
        this.modeIsLTR = !this.modeIsLTR;
    }

    @HostListener("window:scroll", [])
    onWindowScroll() {
        if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
            this.navIsFixed = true;
        } else if (this.navIsFixed && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
            this.navIsFixed = false;
        }
    }

    scrollToTop() {
        (function smoothscroll() {
            let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, currentScroll - (currentScroll / 5));
            }
        })();
    }

    ngOnInit() {
        // console.log("ngOnInit()");
        this.modeIsLTR = true;
        // const language = window.navigator['userLanguage'] || window.navigator.language;
        // if (language.match(/^[^-]*[^ -]/)) {
        //     switch (language.match(/^[^-]*[^ -]/)[0]) {
        //         case 'he':
        //             this.translateService.setDefaultLang('he');
        //             break;
        //         case 'en':
        //             this.translateService.setDefaultLang('en');
        //             break;
        //         default:
        //             this.translateService.setDefaultLang('he');
        //     }
        // }
        // else {
        // console.log(this.storageService.read('lang'));
        this.translateService.setDefaultLang(this.storageService.read('lang') || 'he');
        this.transitionService.currentLang = this.storageService.read('lang') || 'he';
        // }

        if (this.oidcSecurityService.moduleSetup) {
            this.onOidcModuleSetup();
        } else {
            this.oidcSecurityService.onModuleSetup.subscribe(() => {
                this.onOidcModuleSetup();
            });
        }

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });

        // this.oidcSecurityService.getUserData().subscribe(
        //     (userData: any) => {
        //         this.userData = userData;
        //         console.log("oidc getUserData received");
        //         // this.userService.getUserData((data) => {
        //         //     console.log(data);
        //         //     this.storageService.write('userData', data);
        //         // }, () => {});
        //     });
    }

    ngOnDestroy(): void {
        this.oidcSecurityService.onModuleSetup.unsubscribe();
    }

    login() {
        // console.log('start login');
        this.oidcSecurityService.authorize();
    }

    refreshSession() {
        // console.log('start refreshSession');
        this.oidcSecurityService.authorize();
    }

    logout() {
        // console.log('start logoff');
        try {
            this.oidcSecurityService.logoff();
            this.storageService.remove('userData');
        }
        catch (ex) {
            console.log(ex);
        }
    }

    private onOidcModuleSetup() {
        if (window.location.hash) {
            console.log('oidcSecurityService.authorizedCallback()');
            this.oidcSecurityService.authorizedCallback();
        } else {
            console.log('start oidcSecurityService.getIsAuthorized()');
            const path = '/autologin' !== window.location.pathname && '/' !== window.location.pathname ? window.location.pathname : null;
            console.log(path);
            this.storageService.write('redirect', path);
            

            this.oidcSecurityService.getIsAuthorized().subscribe((authorized: boolean) => {
                if (!authorized) {
                    //console.log('start oidcSecurityService.authorize()');
                    //this.oidcSecurityService.authorize();
                    console.log("!authorized");
                    this.router.navigate(['/autologin']);
                }
                else {
                    console.log('start userService.getUserData()');
                    this.userService.getUserData(() => {
                        console.log('start dictionaryService.getDictionaries()');
                        this.dictionaryService.getDictionaries(() => {
                            if (path) this.router.navigate([path]);
                            else this.router.navigate(['/merchants']);
                        });
                    }, () => {
                    });
                }
            });
        }
        this.oidcSecurityService.onAuthorizationResult.subscribe(
            (authorizationResult: AuthorizationResult) => {
                console.log("oidcSecurityService.onAuthorizationResult");
                this.onAuthorizationResultComplete(authorizationResult);
            });
    }

    private onAuthorizationResultComplete(authorizationResult: AuthorizationResult) {
        const path = this.storageService.read('redirect');
        console.log('onAuthorizationResultComplete');
        if (authorizationResult === AuthorizationResult.authorized) {
            // console.log("authorizationResult == AuthorizationResult.authorized");
            this.userService.getUserData((data) => {
                // console.log('onAuthorizationResultComplete -> userService.getUserData()');
                this.storageService.write('userData', data);
                this.dictionaryService.getDictionaries(() => {
                    if (path) this.router.navigate([path]);
                    else this.router.navigate(['/merchants']);
                });
            }, () => {
            });
            // 
        }
        else {
            console.log("authorizationResult != AuthorizationResult.authorized");
            this.router.navigate(['/unauthorized']);
        }
    }
}
