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
    selector: 'app-billing-cycle-report',
    templateUrl: './billing-cycle-report.component.html',
    styleUrls: ['./../reports.component.scss'],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class BillingCycleReportComponent implements OnInit, OnDestroy, AfterViewChecked {
    public merchant: any;
    public areBillingReportsPayed: boolean = false;

    public reportsList: any;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    placementPosition: string;
    datepickerPosition: string;

    reportsStatusFilter: any;

    isColumnsFilterEmpty = true;

    tableBusinessReportsListFilter: Object;
    currentOrderBy: Object;

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
        this.maxSize = (window.innerWidth < 768) ? 4 : 10;
        this.transitionsService.currentRTLToggle.subscribe((data) => {
            if (window.innerWidth >= 768) {
                this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
                this.datepickerPosition = data === false ? 'bottom-left' : 'bottom-right';
            }
            else {
                this.placementPosition = 'bottom-left';
            }
        });

        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );

        this.tableBusinessReportsListFilter = {
            reportDate: {
                title: "Date",
                checkbox: true,
            },
            billableTransactionsTotal: {
                title: "Billable Transactions Total",
                checkbox: true,
            },
            comissionTotal: {
                title: "Comission Total",
                checkbox: true,
            },
            merchantName: {
                title: "Merchant Name",
                checkbox: true,
            },
            merchantTotal: {
                title: "Merchant Total",
                checkbox: true,
            },
            chargebackTotal: {
                title: "Chargeback Total",
                checkbox: true,
            },
            refundTotal: {
                title: "Refund Total",
                checkbox: true,
            },
            collateral: {
                title: "Collateral",
                checkbox: true,
            },
            toBeDeliveredTotal: {
                title: "Delivered Total",
                checkbox: true,
            },
            securityCycle: {
                title: "Security Cycle",
                checkbox: true,
            },
            currency: {
                title: "Currency",
                checkbox: true,
            },
            balanceBefore: {
                title: "Balance Before",
                checkbox: true,
            },
            balanceAfter: {
                title: "Balance After",
                checkbox: true,
            },
            isPayed: {
                title: "Payed",
                checkbox: true,
            },
            clearingCompanyCommission: {
                title: "CC Commission",
                checkbox: true,
            },
            clearingHouseAmount: {
                title: "CH Amount",
                checkbox: true,
            },
        };

        this.transitionsService.currentPageStatus.subscribe((data) => {
            this.getList(0);
        });
        this.checkColumnsFilterEmpty();
    }

    ngAfterViewChecked() {
        this.setIDForAdvancedScroller();
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.tableBusinessReportsListFilter) {
            if (this.tableBusinessReportsListFilter[item]['checkbox'] === false) {
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

    public onTabChange(event: MatTabChangeEvent) {
        this.reportsList = [];
        this.page = 1;
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        this.collectionSize = 0;
        this.pageSize = 10;
        this.tablePeriodFrom = null;
        this.tablePeriodTo = null;
        let tmpDate = new Date();

        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date(tmpDate.setDate(tmpDate.getDate() - 1)).getUTCDate() + 1
        );
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

        requestUrl['date'] = this.filtersService.getUTCDate(this.tablePeriodFrom);
        this.reportsService.getReportsBillingList(
            requestUrl,
            (data) => {
                console.log(data);
                this.reportsList = data.data;
                // if (data.data.length > 0) this.advancedScrollService.initAdvancedHorizontalScroll();
                this.areBillingReportsPayed = true;
                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i]['payed'] === null) {
                        this.areBillingReportsPayed = false;
                        break;
                    }
                }

                this.collectionSize = data.numberOfRecords;
            });

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
            this.reportsService.getReportsBillingExcel(
                requestUrl,
                (data) => {
                    console.log(data);
                    window.open(data['downloadUrl']);
                });
        }
        else if (type === 'bef') {
            this.reportsService.getReportsBillingBef(
                requestUrl,
                (data) => {
                    console.log(data);
                    window.open(data['downloadUrl']);
                }, (error) => {
                    this.toastr.error(error.error, 'Download failed', {
                        disableTimeOut: true,
                        closeButton: true
                    });
                });
        }
    }

    public setBillingsPayed(marker, report) {
        const that = this;
        if (marker !== null) {
            this.reportsService.setReportBillingPayed(
                report.billingReportID,
                {
                    reference: report['paymentReference'],
                    concurrencyToken: report['concurrencyToken'],
                    payed: marker
                },
                function () {
                    that.toastr.success(marker ?
                        'Billing Report is checked as Payed' :
                        'Billing Report is checked as Failed',
                        'Billing Pay Status');
                    that.pageChange();
                });
        }
        else {
            for (let i = 0; i < this.reportsList.length; i++) {
                if (this.reportsList[i]['payed'] === null) {
                    this.reportsService.setReportBillingPayed(
                        this.reportsList[i]['billingReportID'],
                        {
                            reference: this.reportsList[i]['paymentReference'],
                            concurrencyToken: this.reportsList[i]['concurrencyToken'],
                            payed: true
                        },
                        function () {
                            if (i + 1 === that.reportsList.length) {
                                that.toastr.success('Billing Reports are checked as Payed on this page',
                                    'Billing Pay Status');
                                that.pageChange();
                            }
                        });
                }
            }
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

    public reloadConfigSelect($event) {
    }

    public transitionToBillingDetails(data: Object) {
        this.router.navigate(['/billing-reports-details', data['billingReportID']]);
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
