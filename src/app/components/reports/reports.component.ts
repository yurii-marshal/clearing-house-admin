import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit} from "@angular/core";
import {routerTransition} from "../../router.animations";
import {orderBy} from "../merchants/merchants.component";
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {DictionariesService} from "../../services/api/dictionaries-api.service";
import {FiltersService} from "../../services/filters.service";
import {TransitionsService} from "../../services/transitions.service";
import {RequestsService} from "../../services/http-interceptors/requests.service";
import {Router} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material";
import {UserApiService} from "../../services/api/user-api.service";
import {LocalstorageService} from "../../services/localstorage.service";
import {ToastrService} from "ngx-toastr";
import {AdvancedYScrollService} from "../../services/advanced-y-scroll.service";
import {HttpClient} from "@angular/common/http";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {CustomDatepickerI18n, I18n} from "../../services/ngb-datepicker-i18n.service";

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class ReportsComponent implements OnInit, OnDestroy, AfterViewChecked {
    public merchant: any;
    public tabIndex: number = 0;
    public isAdminRoleBilling: boolean = false;

    public reportsList: any;
    public activityReportsList: any;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    isRTLToggle: boolean = false;
    placementPosition: string;

    selectedReportsPeriod: any = 'daily';
    reportsTransactionPeriodFilter: any;
    tableTransactionsReportsListFilter: Object;
    tableBusinessReportsListFilter: Object;
    currentOrderBy: Object;

    public toggleFilterSectionActivity: boolean = false;
    public toggleFilterSectionTransactions: boolean = false;
    public toggleFilterSectionChargebacks: boolean = false;

    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    constructor(config: NgbDropdownConfig,
                public dictionaryService: DictionariesService,
                private localstorageService: LocalstorageService,
                public requests: RequestsService,
                public transitionsService: TransitionsService,
                public translate: TranslateService,
                private http: HttpClient,
                private _eref: ElementRef,
                private toastr: ToastrService,
                private filtersService: FiltersService,
                public userService: UserApiService,
                public advancedScrollService: AdvancedYScrollService,
                public router: Router) {
        config.placement = 'bottom-right';
        config.autoClose = "outside";
        this.selectConfig = config;
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            // console.log(event.lang);
            this.transitionsService.currentLang = event.lang;
        });
    }

    ngOnInit() {
        this.merchant = this.localstorageService.read('merchant') || {};
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        let tmpDate = new Date();

        this.isAdminRoleBilling = this.userService.userData ?
            this.userService.userData['isBillingAdmin'] :
            (this.localstorageService.read('userData') ?
                this.localstorageService.read('userData')['isBillingAdmin'] :
                false);
        // console.log(this.isAdminRoleBilling);

        // this.userService.getUserData((data) => {
            const prevUrl = this.localstorageService.read('previousUrl') || '';
            if (this.isAdminRoleBilling &&
                this.merchant['merchantID'] &&
                this.localstorageService.read('tabForReport')) {
                this.tabIndex = Number(this.localstorageService.read('tabForReport'));
            }
            else if (prevUrl.match(/\/(.*)\//)) {
                switch (prevUrl.match(/\/(.*)\//)[1]) {
                    case 'activity-reports-details':
                        this.tabIndex = 1;
                        break;
                    case 'billing-reports-details':
                        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                            new Date().getUTCFullYear(),
                            new Date().getUTCMonth() + 1,
                            new Date(tmpDate.setDate(tmpDate.getDate() - 1)).getUTCDate()
                        );
                        this.tabIndex = 2;
                        break;
                    case 'chargeback-reports-details':
                        this.tabIndex = 3;
                        break;
                }
            }
        // }, () => {
        // });

        this.transitionsService.transitePageChange(this.tabIndex);

        this.transitionsService.currentRTLToggle.subscribe((data) => {
            this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
            this.isRTLToggle = true;
            this.reloadMatTabGroup();
        });
    }

    ngAfterViewChecked() {
        this.setIDForAdvancedScroller();
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    private setIDForAdvancedScroller() {
        // if (document.getElementById('pnProductNav'))
        //     document.getElementById('pnProductNav').setAttribute('id', '');
        // if (document.getElementById('pnProductNavContent'))
        //     document.getElementById('pnProductNavContent').setAttribute('id', '');
        // if (document.getElementById('pnAdvancerLeft'))
        //     document.getElementById('pnAdvancerLeft').setAttribute('id', '');
        // if (document.getElementById('pnAdvancerRight'))
        //     document.getElementById('pnAdvancerRight').setAttribute('id', '');
        // if (document.getElementsByClassName('pnProductNav-' + this.tabIndex)) {
        //     let pnProductNav = document.getElementsByClassName('pnProductNav-' + this.tabIndex)[0];
        //     pnProductNav.setAttribute('id', 'pnProductNav');
        // }
        // if (document.getElementsByClassName('pnProductNavContent-' + this.tabIndex))
        //     document.getElementsByClassName('pnProductNavContent-' + this.tabIndex)[0].setAttribute('id', 'pnProductNavContent');
        // if (document.getElementsByClassName('pnAdvancerLeft-' + this.tabIndex))
        //     document.getElementsByClassName('pnAdvancerLeft-' + this.tabIndex)[0].setAttribute('id', 'pnAdvancerLeft');
        // if (document.getElementsByClassName('pnAdvancerRight-' + this.tabIndex))
        //     document.getElementsByClassName('pnAdvancerRight-' + this.tabIndex)[0].setAttribute('id', 'pnAdvancerRight');
    }

    reloadMatTabGroup() {
        setTimeout(() => {
            this.isRTLToggle = false;
        }, 100);
    }

    public onTabChange(event: MatTabChangeEvent) {
        this.reportsList = [];
        this.activityReportsList = [];
        this.toggleFilterSectionActivity = false;
        this.toggleFilterSectionTransactions = false;
        this.toggleFilterSectionChargebacks = false;
        this.tabIndex = event['index'];
        this.page = 1;
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        this.collectionSize = 0;
        this.pageSize = 10;
        this.tablePeriodFrom = null;
        this.tablePeriodTo = null;
        let tmpDate = new Date();
        switch (event['index']) {
            case 0:
                this.selectedReportsPeriod = 'daily';
                break;
            case 1:
                break;
            case 2:
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    new Date().getUTCFullYear(),
                    new Date().getUTCMonth() + 1,
                    new Date(tmpDate.setDate(tmpDate.getDate() - 1)).getUTCDate() + 1
                );
                break;
            case 3:
                break;
            default:
                console.log('tab?');
        }
        // this.pageChange();
    }

    public reloadConfigSelect($event) {
    }

    closeOutsideDatePicker(ev, el) {
        if (!el.isOpen() || ev.target.id == el
            || (ev.target.offsetParent && ev.target.offsetParent.localName.includes('ngb-datepicker'))
            || !(ev.target.parentElement && ev.target.parentElement.parentElement
                && !ev.target.parentElement.parentElement.localName.includes('ngb-datepicker'))) {
            return;
        }
        if (el.isOpen() && ev.target.id != el) {
            el.close();
        }
    }
}
