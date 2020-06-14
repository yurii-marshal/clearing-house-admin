import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../../router.animations';
import {orderBy} from "../../merchants/merchants.component";
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {DictionariesService} from "../../../services/api/dictionaries-api.service";
import {FiltersService} from "../../../services/filters.service";
import {TransitionsService} from "../../../services/transitions.service";
import {RequestsService} from "../../../services/http-interceptors/requests.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ReportsApiService} from "../../../services/api/reports-api.service";
import {LocalstorageService} from "../../../services/localstorage.service";
import {AdvancedYScrollService} from "../../../services/advanced-y-scroll.service";
import {CustomDatepickerI18n, I18n} from "../../../services/ngb-datepicker-i18n.service";

@Component({
    selector: 'app-billing-reports-details',
    templateUrl: './billing-reports-details.component.html',
    styleUrls: ['./billing-reports-details.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class BillingReportsDetailsComponent implements OnInit, OnDestroy {
    public params: any;

    public reportsList: any;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    public filterGroup: Object = {
        businessArea: '',
        riskRate: '',
        phone: '',
        merchantReference: '',
        businessID: ''
    };

    reportsStatusFilter: any;
    selectedReportsPeriod: any;
    reportsPeriodFilter: any;
    tableBillingReportsListFilter: Object;
    currentOrderBy: Object;

    placementPosition: string;

    isColumnsFilterEmpty = true;

    public toggleFilterSection: boolean = false;

    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    constructor(config: NgbDropdownConfig,
                public dictionaryService: DictionariesService,
                private localstorageService: LocalstorageService,
                public reportsService: ReportsApiService,
                public requests: RequestsService,
                public transitions: TransitionsService,
                private _eref: ElementRef,
                private filtersService: FiltersService,
                private currentRouter: ActivatedRoute,
                public advancedScrollService: AdvancedYScrollService,
                public router: Router) {
        config.placement = 'bottom-right';
        config.autoClose = "outside";
        this.selectConfig = config;
    }

    ngOnInit() {
        if (this.localstorageService.read('billingReportFilterGroup') != null) {
            this.filterGroup = this.localstorageService.read('billingReportFilterGroup');
            this.toggleFilterSection = true;
        } else this.initFilterGroup();
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        this.transitions.currentRTLToggle.subscribe((data) => {
            this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
        });

        this.localstorageService.read('tableBillingReportsListFilter') ?
            this.tableBillingReportsListFilter = this.localstorageService.read('tableBillingReportsListFilter') :
            this.tableBillingReportsListFilter = {
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
                totalAmount: {
                    title: "Total Amount",
                    checkbox: true,
                },
                merchantAmmount: {
                    title: "Merchant Amount",
                    checkbox: true,
                },
                basicCommission: {
                    title: "Basic Commission",
                    checkbox: true,
                },
                // billingReportID: {
                //     title: "Billing Report ID",
                //     checkbox: true,
                // },
                confirmedDate: {
                    title: "Confirmed Date",
                    checkbox: true,
                },
                // currency: {
                //     title: "Currency",
                //     checkbox: true,
                // },
                initialPaymentAmount: {
                    title: "Initial Payment Amount",
                    checkbox: true,
                },
                installmentCommission: {
                    title: "Installment Commission",
                    checkbox: true,
                },
                installmentPaymentAmount: {
                    title: "Installment Payment Amount",
                    checkbox: true,
                },
                payments: {
                    title: "Payments",
                    checkbox: true,
                },
                totalCommission: {
                    title: "Total Commission",
                    checkbox: true,
                }
            };

        const that = this;
        this.transitions.merchant = null;
        this.dictionaryService.getDictionaries(function (convertedDTO) {
            that.reportsStatusFilter = convertedDTO['kycStatuses'];
        });
        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );
        this.reportsPeriodFilter = [
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

        this.currentRouter.params.subscribe(params => {
            this.params = params;
        });
        this.getList(0);

        this.checkColumnsFilterEmpty();
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.tableBillingReportsListFilter) {
            if (this.tableBillingReportsListFilter[item]['checkbox'] === false) {
                this.isColumnsFilterEmpty = false;
                break;
            }
        }
    }

    public onColumnsChange() {
        this.checkColumnsFilterEmpty();
        this.localstorageService.write('tableBillingReportsListFilter', this.tableBillingReportsListFilter);
    }

    public initFilterGroup() {
        this.filterGroup = {
            businessArea: '',
            riskRate: '',
            phone: '',
            merchantReference: '',
            businessID: ''
        };
        this.acceptFilters();
    }

    public downloadCurrentReportList() {
        this.reportsService.getReportBillingDetailsExcel(
            this.params['id'],
            {},
            (data) => {
                // console.log(data);
                window.open(data['downloadUrl']);
            });
    }

    public backToReports() {
        this.router.navigate(['/reports']);
    }

    public getList(skip) {
        this.reportsService.getReportBillingDetails(
            this.params['id'],
            {
                take: this.pageSize,
                skip: skip,
                order: this.currentOrderBy,
                dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
                dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
                status: this.getKeysStatusFilter(),
                filterGroup: this.filterGroup
            },
            (data) => {
                // console.log(data);
                this.reportsList = data.data;
                // if (data.data.length > 0) this.advancedScrollService.initAdvancedHorizontalScroll();
                this.collectionSize = data.numberOfRecords;
            });
    }

    public pageChange() {
        this.getList(this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0);
    }

    public refreshPage() {
        this.reportsList = [];
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

    private setTenDaysPeriod(today, tmpDate) {
        const lastTenDays = new Date(tmpDate.setDate(tmpDate.getDate() - 10));
        this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
            lastTenDays.getUTCFullYear(),
            lastTenDays.getUTCMonth() + 1,
            lastTenDays.getUTCDate());
        this.tablePeriodTo = this.filtersService.setCustomNgbDate(
            today.getUTCFullYear(),
            today.getUTCMonth() + 1,
            today.getUTCDate());
    }

    public onPeriodFilterChange() {
        const today = new Date();
        const tmpDate = new Date();
        switch (this.selectedReportsPeriod) {
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
            default:
                this.tablePeriodFrom = undefined;
                this.tablePeriodTo = undefined;
        }
        // console.log('onPeriodFilterChange: ', this.selectedReportsPeriod);
        // console.log(this.tablePeriodFrom, this.tablePeriodTo);
        this.pageChange();
    }

    public acceptFilters() {
        this.localstorageService.write('billingReportFilterGroup', this.filterGroup);
        this.page === 1 ? this.pageChange() : this.page = 1;
    }

    public onDateRangeChange() {
        this.selectedReportsPeriod = null;
        this.pageChange();
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
