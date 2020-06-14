import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { AppComponent } from '../../app.component';
import { TransitionsService } from '../../services/transitions.service';
import { UserApiService } from '../../services/api/user-api.service';
import { I18n } from '../../services/ngb-datepicker-i18n.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass: string = 'push-right';
    currentLang: string;
    isRTLToggle: boolean = false;
    user: any;

    constructor(
        private translate: TranslateService,
        public userService: UserApiService,
        private transitionService: TransitionsService,
        public translateService: TranslateService,
        public appCtrl: AppComponent,
        private localstorageService: LocalstorageService,
        public router: Router
    ) {
        //this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        //this.translate.setDefaultLang('he');

        /////////////////////////////////
        // TODO: set default rtl-ltr mode
        /////////////////////////////////
        this.rltAndLtr();

        // const browserLang = this.translate.getBrowserLang();
        // this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');
        this.translate.onTranslationChange.subscribe(
            (event: TranslationChangeEvent) => {
                // console.log(event);
            }
        );
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.currentLang = this.localstorageService.read('lang') || 'he';
        this.user = this.userService.userData;
        this.transitionService.currentRTLToggle.subscribe(
            data => (this.isRTLToggle = data)
        );
        // if (this.currentLang === 'he') {
        //     this.isRTLToggle = true;
        // }
    }

    public setTranslationLanguage(lang: string) {
        this.currentLang = lang;
        this.transitionService.currentLang = lang;
        this.localstorageService.write('lang', lang);
        this.translateService.use(lang);
        location.reload();
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
        this.isRTLToggle = !this.isRTLToggle;
        this.transitionService.transiteRTLToggle(this.isRTLToggle);
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
        this.appCtrl.changeModeScrollBtn();
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
