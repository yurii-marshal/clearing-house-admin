import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {FiltersService} from "../../services/filters.service";
import {DictionariesService} from "../../services/api/dictionaries-api.service";
import {Router} from "@angular/router";
import {RequestsService} from "../../services/http-interceptors/requests.service";
import {ChargebackApiService} from "../../services/api/chargeback-api.service";
import {LocalstorageService} from "../../services/localstorage.service";
import {AdvancedYScrollService} from "../../services/advanced-y-scroll.service";
import {TransitionsService} from "../../services/transitions.service";
import {CustomDatepickerI18n, I18n} from "../../services/ngb-datepicker-i18n.service";

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
    selector: 'app-chargebacks',
    templateUrl: './chargebacks.component.html',
    styleUrls: ['./chargebacks.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class ChargebacksComponent implements OnInit, OnDestroy {
    public merchant: any;
    public chargebacksList: any;
    public selectedChargeBackStatus: any;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    public filterGroup: Object = {
        // merchantName: '',
        amountFrom: null,
        amountTo: null,
    };

    selectedChargeBacksPeriod: any;
    chargeBacksPeriodFilter: any;
    chargeBacksStatusList: any;
    chargeBacksStatusFilter: any;
    tableChargeBacksListFilter: any;
    currentOrderBy: Object;

    isColumnsFilterEmpty = true;
    isDataFilterEmpty = true;

    isInvalidNumber: boolean;

    placementPosition: string;

    public toggleFilterSection: boolean = false;

    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    constructor(config: NgbDropdownConfig,
                public requests: RequestsService,
                private localstorageService: LocalstorageService,
                public chargebacksService: ChargebackApiService,
                public transitions: TransitionsService,
                public dictionaryService: DictionariesService,
                public filtersService: FiltersService,
                public router: Router,
                public advancedScrollService: AdvancedYScrollService,
                private _eref: ElementRef) {
        // this.transactionsDictionary = dictionariesApi.dictionaries['transactionStatuses'];
        config.placement = 'bottom-right';
        config.autoClose = "outside";
        this.selectConfig = config;
        // console.log(this.merchant);
    }

    ngOnInit() {
        const that = this;
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        this.transitions.currentRTLToggle.subscribe((data) => {
            this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
        });
        this.merchant = this.localstorageService.read('merchant') || {};
        if (this.localstorageService.read('chargebacksFilterGroup') != null) {
            this.filterGroup = this.localstorageService.read('chargebacksFilterGroup');
            this.toggleFilterSection = true;
        } else this.initFilterGroup();
        this.chargeBacksPeriodFilter = [
            {
                code: 'today',
                description: 'Today'
            },
            {
                code: 'yesterday',
                description: 'Yesterday'
            },
            {
                code: 'lastWeek',
                description: 'Last Week'
            },
            {
                code: 'lastMonth',
                description: 'Last Month'
            }
        ];
        this.chargeBacksStatusList = [
            {
                code: '1',
                description: 'Init'
            },
            {
                code: '2',
                description: 'In-Process'
            },
            {
                code: '3',
                description: 'Approved'
            }
        ];
        this.localstorageService.read('tableChargeBacksListFilter') ?
            this.tableChargeBacksListFilter = this.localstorageService.read('tableChargeBacksListFilter') :
            this.tableChargeBacksListFilter = {
                chargedBackDate: {
                    title: "Chargeback Date",
                    checkbox: true,
                },
                confirmedDate: {
                    title: "Confirmed Date",
                    checkbox: true,
                },
                chargedBackDoneDate: {
                    title: "Chargeback Done Date",
                    checkbox: true,
                },
                chargebackID: {
                    title: "Chargeback ID",
                    checkbox: true,
                },
                chargebackType: {
                    title: "Chargeback Type",
                    checkbox: true,
                },
                chargebackAmount: {
                    title: "Chargeback Amount",
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
                currency: {
                    title: "Currency",
                    checkbox: true,
                },
                transactionID: {
                    title: "Transaction ID",
                    checkbox: true,
                },
                transactionDate: {
                    title: "Transaction Date",
                    checkbox: true,
                },
                transactionType: {
                    title: "Transaction Type",
                    checkbox: true,
                },
                transactionTotalAmount: {
                    title: "Transaction Total Amount",
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
                chargebackDoneBy: {
                    title: "Done By",
                    checkbox: true,
                }
            };
        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );
        this.getList(0);
        this.dictionaryService.getDictionaries(function (convertedDTO) {
            that.chargeBacksStatusFilter = convertedDTO['kycStatuses'];
        });
        this.checkDataFilterEmpty();
        this.checkColumnsFilterEmpty();
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    public onDateRangeChange() {
        this.pageChange();
    }

    public onColumnsChange() {
        this.checkColumnsFilterEmpty();
        this.localstorageService.write('tableChargeBacksListFilter', this.tableChargeBacksListFilter);
    }

    public transitionToChargeback(data: Object) {
        this.router.navigate(['/chargebacks', data['chargebackID']]);
    }

    public getList(skip) {
        // console.log(
        //     {
        //         take: this.pageSize,
        //         skip: skip,
        //         order: this.currentOrderBy,
        //         dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
        //         dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
        //         status: this.getKeysStatusFilter(),
        //         filterGroup: this.filterGroup
        //     }
        // );
        this.chargebacksService.getChargeBackList(
            {
                merchantID: this.merchant['merchantID'] ? this.merchant['merchantID'] : '',
                take: this.pageSize,
                skip: skip,
                order: this.currentOrderBy,
                dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
                dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
                status: this.getKeysStatusFilter(),
                filterGroup: this.filterGroup
            },
            (data) => {
                console.log(data);
                this.chargebacksList = data.data;
                // if (data.data.length > 0) this.advancedScrollService.initAdvancedHorizontalScroll();
                this.collectionSize = data.numberOfRecords;
            });
    }

    public initFilterGroup() {
        this.filterGroup = {
            merchantName: '',
            chargebackAmountFrom: null,
            chargebackAmountTo: null,
        };
        this.acceptFilters();
    }

    private getKeysStatusFilter() {
        const newStatusesObj = {};
        for (let prop in this.chargeBacksStatusFilter) {
            if (!this.chargeBacksStatusFilter.hasOwnProperty(prop)) continue;
            newStatusesObj[prop] = this.chargeBacksStatusFilter[prop]['checkbox'];
        }
        return newStatusesObj;
    }

    public onPeriodFilterChange() {
        const today = new Date();
        const tmpDate = new Date();
        switch (this.selectedChargeBacksPeriod) {
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
                const lastMonth = new Date(tmpDate.setDate(tmpDate.getDate() - 30));
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    lastMonth.getUTCFullYear(),
                    lastMonth.getUTCMonth() + 1,
                    lastMonth.getUTCDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            default:
                this.tablePeriodFrom = undefined;
                this.tablePeriodTo = undefined;
        }
        console.log('onPeriodFilterChange: ', this.selectedChargeBacksPeriod);
        console.log(this.tablePeriodFrom, this.tablePeriodTo);
        this.pageChange();
    }

    public pageChange() {
        this.getList(this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0);
    }

    public refreshPage() {
        this.isInvalidNumber = false;
        this.chargebacksList = [];
        this.collectionSize = 0;
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
        this.localstorageService.write('chargebacksFilterGroup', this.filterGroup);
        this.page === 1 ? this.pageChange() : this.page = 1;
        this.checkDataFilterEmpty();
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
        for (let item in this.tableChargeBacksListFilter) {
            if (this.tableChargeBacksListFilter[item]['checkbox'] === false) {
                this.isColumnsFilterEmpty = false;
                break;
            }
        }
    }

    public reloadConfigSelect($event) {
    }

    public handleNumberRestrict(event) {
        // console.log(event.target.value);
        // if (!event.target.valueAsNumber) {
        //     if (Number(this.filterGroup['amountFrom']) > Number(this.filterGroup['amountTo'])) {
        //         event.preventDefault();
        //     }
        // }
        this.isInvalidNumber = Number(this.filterGroup['amountFrom']) > Number(this.filterGroup['amountTo']);
        console.log(this.isInvalidNumber, this.filterGroup['amountFrom'], this.filterGroup['amountTo']);
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
