import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {TransactionApiService} from "../../services/api/transaction-api.service";
import {FiltersService} from "../../services/filters.service";
import {DictionariesService} from "../../services/api/dictionaries-api.service";
import {Router} from "@angular/router";
import {RequestsService} from "../../services/http-interceptors/requests.service";
import {TransitionsService} from "../../services/transitions.service";
import {LocalstorageService} from "../../services/localstorage.service";
import {AdvancedYScrollService} from "../../services/advanced-y-scroll.service";
import {LangChangeEvent, TranslateService, TranslationChangeEvent} from "@ngx-translate/core";
import {CustomDatepickerI18n, I18n} from "../../services/ngb-datepicker-i18n.service";
import {ToastrService} from 'ngx-toastr';
import {UserApiService} from "../../services/api/user-api.service";

export interface orderBy {
    date: string;
    transactionID: string;
    customerName: string;
    paymentGateway: string;
    status: string;
    currency: string;
    amount: string;
}

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class TransactionsComponent implements OnInit, OnDestroy {
    public merchant: any;
    public transactionsList: any;
    public idUserForTransitions: number = null;
    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;
    public isAdminRoleBilling: boolean = false;
    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    public filterGroup: Object;

    selectedTransactionsPeriod: any;
    periodFilterLabels: any;
    transactionsPeriodFilter: any;
    forcedStatusFilter: any;
    transactionsTableFilters: Object;
    currentOrderBy: Object;

    isColumnsFilterEmpty = true;
    isDataFilterEmpty = true;

    public toggleFilterSection: boolean = false;
    public placementPosition: string;

    public clearingCompanyFilter: Array<Object>;

    public transactionStatusFilter: Array<Object>;
    public transactionTypeFilter: Array<Object>;
    public paymentGatewayFilter: Array<Object>;

    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    public holdTransactionFilter: string;

    constructor(config: NgbDropdownConfig,
                public localstorageService: LocalstorageService,
                private requests: RequestsService,
                public transactionsApi: TransactionApiService,
                public dictionaryService: DictionariesService,
                public filtersService: FiltersService,
                public router: Router,
                public transitionsService: TransitionsService,
                private translate: TranslateService,
                public advancedScrollService: AdvancedYScrollService,
                private toastr: ToastrService,
                public userService: UserApiService,
                private _eref: ElementRef) {
        config.placement = 'bottom-right';
        config.autoClose = "outside";
        this.selectConfig = config;
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            // console.log(event.lang);
            this.transitionsService.currentLang = event.lang;
            this.initDrops();
        });
        this.holdTransactionFilter = "all";
    }

    ngOnInit() {
        const that = this;
        this.userService.getUserData(function () {
            console.log(that.userService.userData);
            that.isAdminRoleBilling = that.userService.userData['isBillingAdmin'];
        }, () => {
        });
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        this.transitionsService.currentRTLToggle.subscribe((data) => {
            this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
        });

        this.merchant = this.localstorageService.read('merchant');
        this.dictionaryService.getClearingCompanyList(function (data) {
            that.clearingCompanyFilter = data;
        });

        this.localstorageService.read('transactionsTableFilters') ?
            this.transactionsTableFilters = this.localstorageService.read('transactionsTableFilters') :
            this.transactionsTableFilters = {
                transactionDate: {
                    title: "Date",
                    checkbox: true,
                },
                transactionID: {
                    title: "Transaction ID",
                    checkbox: true,
                },
                transactionType: {
                    title: "Transaction Type",
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
                paymentGateway: {
                    title: "Payment Gateway",
                    checkbox: true,
                },
                status: {
                    title: "Status",
                    checkbox: true,
                },
                currency: {
                    title: "Currency",
                    checkbox: true,
                },
                currentInstallment: {
                    title: "Current Installment",
                    checkbox: true,
                },
                transactionAmount: {
                    title: "Transaction Amount",
                    checkbox: true,
                },
                transactionCommission: {
                    title: "Transaction Commission",
                    checkbox: true,
                },
                installmentsAmountRemaining: {
                    title: "Remaining Installments",
                    checkbox: true,
                },
                totalAmount: {
                    title: "Total Amount",
                    checkbox: true,
                },
                rejectionReason: {
                    title: "Rejection Reason",
                    checkbox: true,
                },
                isForced: {
                    title: "Forced Deal",
                    checkbox: true
                },
                shvaShovarNumber: {
                    title: "Shva Shovar Number",
                    checkbox: true,
                },
                initialTransactionID: {
                    title: "Initial ID",
                    checkbox: true
                },
                cardDigits: {
                    title: "Card",
                    checkbox: true
                },
                isTourist: {
                    title: "Tourist",
                    checkbox: true
                },
                bankDate: {
                    title: "Bank Date",
                    checkbox: true
                },
                payments:{
                    title: "Payments",
                    checkbox: true
                },
                merchantAmount:{
                    title:"Merchant Amount",
                    checkbox:true
                },
                holdTransaction:{
                    title:"Hold",
                    checkbox:true
                }
            };

        if (this.localstorageService.read('transactionsFilterGroup') != null) {
            this.filterGroup = this.localstorageService.read('transactionsFilterGroup');
            this.toggleFilterSection = true;
        } else this.initFilterGroup();
        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );
        this.idUserForTransitions = Number(this.localstorageService.read('idUserForTransitions'));
        this.dictionaryService.getDictionaries(function () {
            that.transactionStatusFilter = that.dictionaryService.dictionaries['transactionStatuses'];
            that.transactionTypeFilter = that.dictionaryService.dictionaries['transactionTypes'];
            that.dictionaryService.getPaymentGatewayList(function (data) {
                that.paymentGatewayFilter = data;
            });
            that.getList(0);
        });
        this.periodFilterLabels = ['Today', 'Yesterday', 'Last Week', 'Last Month'];
        this.forcedStatusFilter = [
            {
                code: 'true',
                description: 'forced'
            },
            {
                code: 'false',
                description: 'not forced'
            }
        ];
        this.periodFilterLabels = ['Today', 'Yesterday', 'Last Week', 'Last Month'];
        this.transactionsPeriodFilter = [
            {
                code: 'today',
                description: ''
            },
            {
                code: 'yesterday',
                description: ''
            },
            {
                code: 'lastWeek',
                description: ''
            },
            {
                code: 'lastMonth',
                description: ''
            }
        ];

        

        this.initDrops();

        this.checkDataFilterEmpty();
        this.checkColumnsFilterEmpty();
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    private initDrops() {
        this.transactionsPeriodFilter.forEach((item, index) => {
            let tmpFilter = this.transactionsPeriodFilter.slice();
            this.translate.get(this.periodFilterLabels[index])
                .subscribe(res => {
                    tmpFilter[index].description = res;
                    this.transactionsPeriodFilter = tmpFilter.slice();
                });
        });
    }

    private checkDataFilterEmpty() {
        this.isDataFilterEmpty = true;
        for (let item in this.filterGroup) {
            if (!!this.filterGroup[item]) {
                this.isDataFilterEmpty = false;
                break;
            }
        }
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.transactionsTableFilters) {
            if (this.transactionsTableFilters[item]['checkbox'] === false) {
                this.isColumnsFilterEmpty = false;
                break;
            }
        }
    }

    public onColumnsChange() {
        this.checkColumnsFilterEmpty();
        this.localstorageService.write('transactionsTableFilters', this.transactionsTableFilters);
    }

    public initFilterGroup() {
        this.filterGroup = {
            paymentGatewayID: null,
            paymentAmountFrom: null,
            paymentAmountTo: null,
            solic: '',
            creditCardVendor: '',
            consumerEmail: '',
            consumerPhone: '',
            merchantID: '',
            merchantName: '',
            dealDescription: '',
            dealReference: '',
            terminalReference: '',
            status: null,
            transactionType: null,
            clearingCompany: '',
            isForced: null,
            holdTransactionFilter: 'all'
        };
        this.acceptFilters();
    }

    public transitionToTransaction(data: Object) {
        this.router.navigate(['/transactions', data['transactionID']]);
    }

    public getList(skip) {
        let that = this;
        this.transactionsApi.getTransactionsList(
            {
                take: this.pageSize,
                skip: skip,
                order: this.currentOrderBy,
                dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
                dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
                merchantID: this.idUserForTransitions ? this.idUserForTransitions : '',
                filterGroup: this.filterGroup
            },
            (data) => {
                // console.log(data);
                that.transactionsList = data.data;
                // if (data.data.length > 0) this.advancedScrollService.initAdvancedHorizontalScroll();
                that.collectionSize = data.numberOfRecords;
            });
    }

    public pageChange() {
        this.getList(this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0);
    }

    public refreshPage() {
        this.transactionsList = [];
        this.collectionSize = 0;
        this.pageChange();
    }

    public onPeriodFilterChange() {
        const today = new Date();
        const tmpDate = new Date();
        switch (this.selectedTransactionsPeriod) {
            case 'today':
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
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
                // const lastMonth = new Date(tmpDate.setDate(tmpDate.getDate() - 30));
                const date = new Date(),
                    y = date.getFullYear(),
                    m = date.getUTCMonth(),
                    firstDay = new Date(y, m - 1, 1),
                    lastDay = new Date(y, m, 0);
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    firstDay.getFullYear(),
                    firstDay.getMonth() + 1,
                    firstDay.getDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    lastDay.getFullYear(),
                    lastDay.getMonth() + 1,
                    lastDay.getDate());
                break;
            default:
                this.tablePeriodFrom = undefined;
                this.tablePeriodTo = undefined;
        }
        // console.log('onPeriodFilterChange: ', this.selectedTransactionsPeriod);
        // console.log(this.tablePeriodFrom, this.tablePeriodTo);
        this.pageChange();
    }

    public onDateRangeChange() {
        // console.log('onDateRangeChange: ', this.tablePeriodFrom, this.tablePeriodTo);
        this.selectedTransactionsPeriod = null;
        this.pageChange();
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

    public acceptFilters() {
        this.localstorageService.write('transactionsFilterGroup', this.filterGroup);
        this.page === 1 ? this.pageChange() : this.page = 1;
        this.checkDataFilterEmpty();
    }

    public reloadConfigSelect($event) {
        // console.log($event);
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

    public downloadCurrentReportList() {
        const requestUrl = {
            dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
            dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
            merchantID: this.idUserForTransitions ? this.idUserForTransitions : '',
            filterGroup: this.filterGroup
        };

        this.transactionsApi.getTransactionsExcel(
            requestUrl,
            (data) => {
                window.open(data['downloadUrl']);
            });
    }

    public holdSelected() {
        const that = this;

        let selected = [];

        this.transactionsList.forEach((item, index) => { 
            if(item.selected && !item.holdTransaction){
                selected.push({transactionID: item.transactionID, concurrencyToken:item.concurrencyToken });
            }
        });

        this.transactionsApi.holdTransactions(
            selected
        ,
        function (data) {
            that.toastr.success(data.message, 'Hold Transactions');
            that.acceptFilters();
        },
        function (err) {
            if (err.error.message) {
                that.toastr.error(err.error.message, 'Hold Transactions', {
                    disableTimeOut: true,
                    closeButton: true
                });
            }
        }
        );
    }

    public unholdSelected() {
        const that = this;

        let selected = [];

        this.transactionsList.forEach((item, index) => { 
            if(item.selected && item.holdTransaction){
                selected.push({transactionID: item.transactionID, concurrencyToken:item.concurrencyToken });
            }
        });

        this.transactionsApi.unHoldTransactions(
            selected
        ,
        function (data) {
            that.toastr.success(data.message, 'Unhold Transactions');
            that.acceptFilters();
        },
        function (err) {
            if (err.error.message) {
                that.toastr.error(err.error.message, 'Unhold Transactions', {
                    disableTimeOut: true,
                    closeButton: true
                });
            }
        }
        );
    }

    public selectAll(selected){
        this.transactionsList.forEach((transaction, index) => { 
            if((transaction.status == 'expectedDeal' || transaction.status == 'committed') && this.filterGroup['holdTransactionFilter'] != 'all' && !transaction.billingReportDate)
                transaction.selected = selected;
        });
    }
    
}
