import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd, NavigationStart} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {TransitionsService} from "../../services/transitions.service";
import {UserApiService} from "../../services/api/user-api.service";
import {LocalstorageService} from "../../services/localstorage.service";
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    public isMenuWideOpened: boolean = true;
    public isRTLToggle: boolean = true;
    isUnauthorized: boolean = false;
    isActive: boolean = false;
    isRoutingBySidebar: boolean = false;
    showMenu: string = '';
    pushRightClass: string = 'push-right';

    public chVersion: string;

    constructor(private translate: TranslateService,
                private transitionService: TransitionsService,
                private localstorageService: LocalstorageService,
                public userService: UserApiService,
                public router: Router,
                public oidcSecurityService: OidcSecurityService) {

        this.chVersion = environment.VERSION;

        // console.log(this.userService.userData);
        //this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de']);

        ////////////////////////////////////////
        // TODO: set default language for system
        ////////////////////////////////////////
        //this.translate.setDefaultLang('he');

        // const browserLang = this.translate.getBrowserLang();
        // this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
            if (val instanceof NavigationStart &&
                this.localstorageService.read('merchant') !== null &&
                this.isRoutingBySidebar === true) {
                this.localstorageService.remove('idUserForTransitions');
                this.localstorageService.remove('tabForReport');
                this.localstorageService.remove('merchant');
                this.isRoutingBySidebar = false;
            }
        });
    }

    ngOnInit() {
        this.transitionService.currentRTLToggle.subscribe(data => this.isRTLToggle = data);
        
    }

    toggleNavWidth() {
        const componentShell = document.getElementsByClassName('main-container')[0];
        if (this.isMenuWideOpened) {
            componentShell.classList.remove('nav-menu-wide');
            componentShell.classList.add('nav-menu-hide');
        }
        else {
            componentShell.classList.remove('nav-menu-hide');
            componentShell.classList.add('nav-menu-wide');
        }
        this.isMenuWideOpened = !this.isMenuWideOpened;
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    onRouterLinkClick() {
        this.isRoutingBySidebar = true;
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    logout() {
        //this.oidcSecurityService.logoff();
        window.location.href = environment.load_using_stsServer + "/account/logout";
    }
}
