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
    selector: 'app-transactions-report',
    templateUrl: './transactions-report.component.html',
    styleUrls: ['./../reports.component.scss'],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class TransactionsReportComponent implements OnInit, OnDestroy, AfterViewChecked {
    public merchant: any;
    public reportsList: any;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    public filterGroupTransactions: Object;
    public transactionTypeFilter: Array<Object>;

    placementPosition: string;

    reportsStatusFilter: any;
    selectedReportsPeriod: any = 'daily';
    transactionPeriodLabels: any;
    reportsTransactionPeriodFilter: any;
    tableTransactionsReportsListFilter: Object;
    currentOrderBy: Object;

    isColumnsFilterEmpty = true;
    isDataFilterEmpty = true;

    public clearingCompanyFilter: Array<Object>;

    public toggleFilterSectionTransactions: boolean = false;

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
            this.transitionsService.currentLang = event.lang;
            this.initDrops();
        });
    }

    ngOnInit() {
        this.maxSize = (window.innerWidth < 768) ? 4 : 10;
        this.merchant = this.localstorageService.read('merchant') || {};
        this.dictionaryService.getClearingCompanyList((data) => {
            this.clearingCompanyFilter = data;
        });
        this.localstorageService.read('tableTransactionsReportsListFilter') ?
            this.tableTransactionsReportsListFilter = this.localstorageService.read('tableTransactionsReportsListFilter') :
            this.tableTransactionsReportsListFilter = {
                date: {
                    title: "Date",
                    checkbox: true,
                },
                month: {
                    title: "Month",
                    checkbox: true,
                },
                year: {
                    title: "Year",
                    checkbox: true,
                },
                businessArea: {
                    title: "Business Area",
                    checkbox: true,
                },
                phone: {
                    title: "Phone",
                    checkbox: true,
                },
                activityStartDate: {
                    title: "Activity Start Date",
                    checkbox: true,
                },
                businessId: {
                    title: "Business ID",
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
                // creditCardVendor: {
                //     title: "Credit Card Vendor",
                //     checkbox: true,
                // },
                // currency: {
                //     title: "Currency",
                //     checkbox: true,
                // },
                kycApprovalStatus: {
                    title: "KYC Approval Status",
                    checkbox: true,
                },
                merchantAmmount: {
                    title: "Merchant Amount",
                    checkbox: true,
                },
                riskRate: {
                    title: "Risk Rate",
                    checkbox: true,
                },
                // solic: {
                //     title: "Solek",
                //     checkbox: true,
                // },
                // status: {
                //     title: "Status",
                //     checkbox: true,
                // },
                totalAmount: {
                    title: "Total Amount",
                    checkbox: true,
                },
                totalCommission: {
                    title: "Total Commission",
                    checkbox: true,
                },
                // transactionType: {
                //     title: "Transaction Type",
                //     checkbox: true,
                // },
                transactionsCount: {
                    title: "Transactions Count",
                    checkbox: true,
                },

                clearingCompany: {
                    title: "Clearing Company",
                    checkbox: true,
                },
                installmentAmount: {
                    title: "Installment Amount",
                    checkbox: true,
                },
                installmentTransactionsAmount: {
                    title: "Installment Transactions Amount",
                    checkbox: true,
                },
                installmentTransactionsCount: {
                    title: "Installment Transactions Count",
                    checkbox: true,
                },
                refundTransactionsAmount: {
                    title: "Refund Transactions Amount",
                    checkbox: true,
                },
                refundTransactionsCommission: {
                    title: "Refund Transactions Commission",
                    checkbox: true,
                },
                refundTransactionsCount: {
                    title: "Refund Transactions Count",
                    checkbox: true,
                },
                rejectedTransactionsCount: {
                    title: "Average Amount",
                    checkbox: true,
                },
                touristCharges: {
                    title: "Tourist Charges",
                    checkbox: true,
                },
                // averageAmount: {
                //     title: "Average Amount",
                //     checkbox: true,
                // },
                // averageTouristCharges: {
                //     title: "Average Tourist Charges",
                //     checkbox: true,
                // },
                // averageTransactionCount: {
                //     title: "Average Transaction Count",
                //     checkbox: true,
                // },
                forcedTransactionsCount: {
                    title: "Forced Transactions Count",
                    checkbox: true,
                }
            };

        this.initTransactionsFilterGroup();

        if (this.localstorageService.read('reportsFilterGroupTransactions') != null) {
            this.filterGroupTransactions = this.localstorageService.read('reportsFilterGroupTransactions');
            this.toggleFilterSectionTransactions = true;
        }

        this.transitionsService.currentRTLToggle.subscribe((data) => {
            // console.log(window.screen.width);
            if (window.innerWidth >= 768) {
                this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
            }
            else {
                this.placementPosition = 'bottom-right';
            }
        });

        this.dictionaryService.getDictionaries((convertedDTO) => {
            this.transactionTypeFilter = this.dictionaryService.dictionaries['transactionStatuses'];
        });
        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );
        this.transactionPeriodLabels = ['Daily', 'Monthly', 'Last 30 Days'];
        this.reportsTransactionPeriodFilter = [
            {
                code: 'daily',
                description: ''
            },
            {
                code: 'monthly',
                description: ''
            },
            {
                code: 'last30Days',
                description: ''
            }
        ];

        this.initDrops();

        this.transitionsService.currentPageStatus.subscribe((data) => {
            this.onPeriodFilterChange(); // : this.getList(0);
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
        for (let item in this.filterGroupTransactions) {
            if (!!this.filterGroupTransactions[item]) {
                this.isDataFilterEmpty = false;
                break;
            }
        }
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.tableTransactionsReportsListFilter) {
            if (this.tableTransactionsReportsListFilter[item]['checkbox'] === false) {
                this.isColumnsFilterEmpty = false;
                break;
            }
        }
    }

    private initDrops() {
        this.reportsTransactionPeriodFilter.forEach((item, index) => {
            let tmpFilter = this.reportsTransactionPeriodFilter.slice();
            this.translate.get(this.transactionPeriodLabels[index])
                .subscribe(res => {
                    tmpFilter[index].description = res;
                    this.reportsTransactionPeriodFilter = tmpFilter.slice();
                });
        });
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

    public onColumnsChangeTransactions() {
        this.checkColumnsFilterEmpty();
        this.localstorageService.write('tableTransactionsReportsListFilter', this.tableTransactionsReportsListFilter);
    }

    public onTabChange(event: MatTabChangeEvent) {
        this.reportsList = [];
        this.toggleFilterSectionTransactions = false;
        this.page = 1;
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        this.collectionSize = 0;
        this.pageSize = 10;
        this.tablePeriodFrom = null;
        this.tablePeriodTo = null;
        this.pageChange();
    }

    private getTransactionPeriodList(prefix, requestUrl) {
        this.reportsService.getReportsTransactionList(
            prefix,
            requestUrl,
            (data) => {
                // console.log(data);
                this.reportsList = data.data;
                // if (data.data.length > 0) this.advancedScrollService.initAdvancedHorizontalScroll();
                this.collectionSize = data.numberOfRecords;
            });
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
        requestUrl['filterGroup'] = this.filterGroupTransactions;
        this.getTransactionPeriodList(this.selectedReportsPeriod, requestUrl);
    }

    public initTransactionsFilterGroup() {
        this.filterGroupTransactions = {
            clearingCompany: '',
            businessArea: '',
            totalAmountFrom: null,
            totalAmountTo: null,
            transactionCountFrom: null,
            transactionCountTo: null,
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
        switch (this.selectedReportsPeriod) {
            case 'daily':
                // requestUrl['dateFrom'] = this.filtersService.getUTCDate(this.filtersService.setCustomNgbDate(
                //     lastDay.getUTCFullYear(),
                //     lastDay.getUTCMonth() + 1,
                //     lastDay.getUTCDate()));
                // requestUrl['dateTo'] = this.filtersService.getUTCDate(this.filtersService.setCustomNgbDate(
                //     today.getUTCFullYear(),
                //     today.getUTCMonth() + 1,
                //     today.getUTCDate()));
                this.reportsService.getReportsTransactionExcel(
                    'dailyExcel',
                    requestUrl,
                    (data) => {
                        // console.log(data);
                        window.open(data['downloadUrl']);
                    });
                break;
            case 'monthly':
                // requestUrl['dateFrom'] = this.filtersService.getUTCDate(this.filtersService.setCustomNgbDate(
                //     lastMonth.getUTCFullYear(),
                //     lastMonth.getUTCMonth() + 1,
                //     lastMonth.getUTCDate()));
                // requestUrl['dateTo'] = this.filtersService.getUTCDate(this.filtersService.setCustomNgbDate(
                //     today.getUTCFullYear(),
                //     today.getUTCMonth() + 1,
                //     today.getUTCDate()));
                this.reportsService.getReportsTransactionExcel(
                    'monthlyExcel',
                    requestUrl,
                    (data) => {
                        // console.log(data);
                        window.open(data['downloadUrl']);
                    });
                break;
            case 'last30Days':
                this.reportsService.getReportsTransactionExcel(
                    'last30DaysExcel',
                    requestUrl,
                    (data) => {
                        // console.log(data);
                        window.open(data['downloadUrl']);
                    });
                break;
            case 'last12Months':
                this.reportsService.getReportsTransactionExcel(
                    'last12MonthsExcel',
                    requestUrl,
                    (data) => {
                        // console.log(data);
                        window.open(data['downloadUrl']);
                    });
                break;
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

    private setDailyPeriod(today) {
        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
        this.tablePeriodTo = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
    }

    private setMonthlyPeriod(today, tmpDate) {
        const lastMonth = new Date(tmpDate.setDate(tmpDate.getDate() - 30));
        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
            lastMonth.getUTCFullYear(),
            lastMonth.getUTCMonth() + 1,
            lastMonth.getUTCDate());
        this.tablePeriodTo = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
    }

    private set12MonthsPeriod(today, tmpDate) {
        const lastYear = new Date(tmpDate.setDate(tmpDate.getDate() - 365));
        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
            lastYear.getUTCFullYear(),
            lastYear.getUTCMonth() + 1,
            lastYear.getUTCDate());
        this.tablePeriodTo = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
    }

    private setTenDaysPeriod(today, tmpDate) {
        const last30Days = new Date(tmpDate.setDate(tmpDate.getDate() - 10));
        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
            last30Days.getUTCFullYear(),
            last30Days.getUTCMonth() + 1,
            last30Days.getUTCDate());
        this.tablePeriodTo = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
    }

    public onPeriodFilterChange() {
        const today = new Date();
        const tmpDate = new Date();
        switch (this.selectedReportsPeriod) {
            case 'daily':
                // this.setDailyPeriod(today);
                break;
            case 'monthly':
                // this.setMonthlyPeriod(today, tmpDate);
                break;
            case 'last30Days':
                // this.setTenDaysPeriod(today, tmpDate);
                break;
            case 'today':
                this.setDailyPeriod(today);
                break;
            case 'yesterday':
                const yesterday = new Date(tmpDate.setDate(tmpDate.getDate() - 1));
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    yesterday.getUTCFullYear(),
                    yesterday.getUTCMonth() + 1,
                    yesterday.getUTCDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            case 'lastWeek':
                const lastWeek = new Date(tmpDate.setDate(tmpDate.getDate() - 7));
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    lastWeek.getUTCFullYear(),
                    lastWeek.getUTCMonth() + 1,
                    lastWeek.getUTCDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            case 'lastMonth':
                this.setMonthlyPeriod(today, tmpDate);
                break;
            case 'last12Months':
                this.set12MonthsPeriod(today, tmpDate);
                break;
            default:
                this.tablePeriodFrom = undefined;
                this.tablePeriodTo = undefined;
        }
        // console.log('onPeriodFilterChange: ', this.selectedReportsPeriod);
        // console.log(this.tablePeriodFrom, this.tablePeriodTo);
        this.page = 1;
        this.pageChange();
    }

    public onDateRangeChange() {
        this.page = 1;
        this.pageChange();
    }

    public acceptTransactionsFilters() {
        // console.log('acceptTransactionsFilters');
        this.localstorageService.write('toggleFilterSectionTransactions', this.filterGroupTransactions);
        this.page === 1 ? this.pageChange() : this.page = 1;
        this.checkDataFilterEmpty();
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
