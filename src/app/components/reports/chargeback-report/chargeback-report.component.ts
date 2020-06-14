import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit} from "@angular/core";
import {orderBy} from "../../merchants/merchants.component";
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {DictionariesService} from "../../../services/api/dictionaries-api.service";
import {FiltersService} from "../../../services/filters.service";
import {TransitionsService} from "../../../services/transitions.service";
import {RequestsService} from "../../../services/http-interceptors/requests.service";
import {Router} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material";
import {ReportsApiService} from "../../../services/api/reports-api.service";
import {UserApiService} from "../../../services/api/user-api.service";
import {LocalstorageService} from "../../../services/localstorage.service";
import {ToastrService} from "ngx-toastr";
import {AdvancedYScrollService} from "../../../services/advanced-y-scroll.service";
import {HttpClient} from "@angular/common/http";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {CustomDatepickerI18n, I18n} from "../../../services/ngb-datepicker-i18n.service";

@Component({
    selector: 'app-chargeback-report',
    templateUrl: './chargeback-report.component.html',
    styleUrls: ['./../reports.component.scss'],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class ChargebackReportComponent implements OnInit, OnDestroy, AfterViewChecked {
    public merchant: any;
    public reportsList: any;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    public filterGroupChargebacks: Object;

    placementPosition: string;
    datepickerPosition: string;

    reportsStatusFilter: any;
    tableChargeBacksListFilter: Object;
    currentOrderBy: Object;

    isColumnsFilterEmpty = true;
    isDataFilterEmpty = true;

    public toggleFilterSectionChargebacks: boolean = false;

    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    constructor(config: NgbDropdownConfig,
                public dictionaryService: DictionariesService,
                private localstorageService: LocalstorageService,
                public reportsService: ReportsApiService,
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
            console.log(event.lang);
            this.transitionsService.currentLang = event.lang;
        });
    }

    ngOnInit() {
        this.merchant = this.localstorageService.read('merchant') || {};
        this.initChargebacksFilterGroup();
        this.maxSize = (window.innerWidth < 768) ? 4 : 10;
        if (this.localstorageService.read('reportsFilterGroupChargebacks') != null) {
            this.filterGroupChargebacks = this.localstorageService.read('reportsFilterGroupChargebacks');
            this.toggleFilterSectionChargebacks = true;
        }

        this.transitionsService.currentRTLToggle.subscribe((data) => {
            if (window.innerWidth >= 768) {
                this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
                this.datepickerPosition = data === false ? 'bottom-left' : 'bottom-right';
            }
            else {
                this.placementPosition = 'bottom-right';
            }
        });

        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );

        this.localstorageService.read('tableChargeBacksListFilter') ?
            this.tableChargeBacksListFilter = this.localstorageService.read('tableChargeBacksListFilter') :
            this.tableChargeBacksListFilter = {
                billingReportID: {
                    title: "Billing Report ID",
                    checkbox: true,
                },
                reportDate: {
                    title: "Report Date",
                    checkbox: true,
                },
                merchantID: {
                    title: "Merchant ID",
                    checkbox: true,
                },
                merchantName: {
                    title: "Merchant Name",
                    checkbox: true,
                },
                businessId: {
                    title: "Business Id",
                    checkbox: true,
                },
                currency: {
                    title: "Currency",
                    checkbox: true,
                },
                chargebackTotal: {
                    title: "Chargeback Total",
                    checkbox: true,
                },
                bankAccountNumber: {
                    title: "Account Number",
                    checkbox: true,
                },
                bankNumber: {
                    title: "Bank Number",
                    checkbox: true,
                },
                branchNumber: {
                    title: "Branch Number",
                    checkbox: true,
                },
                payedDate: {
                    title: "Payed Date",
                    checkbox: true,
                },
                isPayed: {
                    title: "Payed",
                    checkbox: true,
                }
            };

        this.transitionsService.currentPageStatus.subscribe((data) => {
            this.getList(0);
        });

        this.checkDataFilterEmpty();
        this.checkColumnsFilterEmpty();
    }

    ngAfterViewChecked() {
        this.setIDForAdvancedScroller();
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    private checkDataFilterEmpty() {
        this.isDataFilterEmpty = true;
        for (let item in this.filterGroupChargebacks) {
            if (!!this.filterGroupChargebacks[item]) {
                this.isDataFilterEmpty = false;
                break;
            }
        }
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.tableChargeBacksListFilter) {
            if (this.tableChargeBacksListFilter[item]['checkbox'] === false) {
                this.isColumnsFilterEmpty = false;
                break;
            }
        }
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

    public onColumnsChangeChargebacks() {
        this.checkColumnsFilterEmpty();
        this.localstorageService.write('tableChargeBacksListFilter', this.tableChargeBacksListFilter);
    }

    public onTabChange(event: MatTabChangeEvent) {
        this.reportsList = [];
        this.toggleFilterSectionChargebacks = false;
        this.page = 1;
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        this.collectionSize = 0;
        this.pageSize = 10;
        this.tablePeriodFrom = null;
        this.tablePeriodTo = null;
        this.pageChange();
    }

    public getList(skip) {
        const requestUrl = {
            merchantID: this.merchant['merchantID'] ? this.merchant['merchantID'] : '',
            take: this.pageSize,
            skip: skip,
            order: this.currentOrderBy,
            dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
            dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
            status: this.getKeysStatusFilter()
        };

        requestUrl['filterGroup'] = this.filterGroupChargebacks;
        requestUrl['date'] = this.filtersService.getUTCDate(this.tablePeriodFrom);
        this.reportsService.getReportsChargebackList(
            requestUrl,
            (data) => {
                console.log(data);
                this.reportsList = data.data;
                // if (data.data.length > 0) this.advancedScrollService.initAdvancedHorizontalScroll();
                this.collectionSize = data.numberOfRecords;
            });
    }

    public initChargebacksFilterGroup() {
        this.filterGroupChargebacks = {
            amountFrom: null,
            amountTo: null,
        };
        this.isDataFilterEmpty = true;
        this.page = 1;
        this.pageChange();
    }

    public pageChange() {
        // console.log(this.page);
        this.getList(this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0);
    }

    public refreshPage() {
        this.reportsList = [];
        this.collectionSize = 0;
        this.pageChange();
    }

    public downloadCurrentReportList(type) {
        const requestUrl = {
            merchantID: this.merchant['merchantID'] ? this.merchant['merchantID'] : '',
            take: this.pageSize,
            dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
            dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
            skip: this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0
        };

        requestUrl['date'] = this.filtersService.getUTCDate(this.tablePeriodFrom);
        if (type === 'xls') {
            this.reportsService.getReportsChargebackExcel(
                requestUrl,
                (data) => {
                    console.log(data);
                    window.open(data['downloadUrl']);
                });
        }
        else if (type === 'bef') {
            this.reportsService.getReportsChargebackBef(
                requestUrl,
                (data) => {
                    console.log(data);
                    window.open(data['downloadUrl']);
                });
        }
    }

    public setPositionIconStatus(icon: string) {
        this.orderBy[icon] = this.orderBy[icon] === 'ASC' ? 'DESC' : 'ASC';
        this.currentOrderBy = {
            prop: icon,
            order: this.orderBy[icon]
        };
        for (let i in this.orderBy) {
            if (i !== icon) {
                this.orderBy[i] = "";
            }
        }
        this.pageChange();
    }

    private getKeysStatusFilter() {
        const newStatusesObj = {};
        for (let prop in this.reportsStatusFilter) {
            if (!this.reportsStatusFilter.hasOwnProperty(prop)) continue;
            newStatusesObj[prop] = this.reportsStatusFilter[prop]['checkbox'];
        }
        return newStatusesObj;
    }

    public onDateRangeChange() {
        this.pageChange();
    }

    public acceptChargebacksFilters() {
        console.log('acceptChargebacksFilters');
        this.localstorageService.write('reportsFilterGroupChargebacks', this.filterGroupChargebacks);
        this.page === 1 ? this.pageChange() : this.page = 1;
        this.checkDataFilterEmpty();
    }

    public reloadConfigSelect($event) {
    }

    public transitionToChargebackDetails(data: Object) {
        this.router.navigate(['/chargeback-reports-details', data['chargebackReportID']]);
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
