import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {routerTransition} from "../../../router.animations";
import {orderBy} from "../../merchants/merchants.component";
import {DictionariesService} from "../../../services/api/dictionaries-api.service";
import {LocalstorageService} from "../../../services/localstorage.service";
import {ReportsApiService} from "../../../services/api/reports-api.service";
import {RequestsService} from "../../../services/http-interceptors/requests.service";
import {TransitionsService} from "../../../services/transitions.service";
import {FiltersService} from "../../../services/filters.service";
import {UserApiService} from "../../../services/api/user-api.service";
import {AdvancedYScrollService} from "../../../services/advanced-y-scroll.service";
import {CustomDatepickerI18n, I18n} from "../../../services/ngb-datepicker-i18n.service";

@Component({
    selector: 'app-chargeback-reports-details',
    templateUrl: './chargeback-reports-details.component.html',
    styleUrls: ['./chargeback-reports-details.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class ChargebackReportsDetailsComponent implements OnInit, OnDestroy {
    public areOperationsPayed: boolean = false;
    public params: Object;

    public operationsList: any;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    isRTLToggle: boolean = false;

    tableBusinessReportsListFilter: Object;
    tableChargeBacksListFilter: Object;
    currentOrderBy: Object;

    isColumnsFilterEmpty = true;

    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    constructor(config: NgbDropdownConfig,
                public dictionaryService: DictionariesService,
                private storageService: LocalstorageService,
                public reportsService: ReportsApiService,
                public requests: RequestsService,
                public transitions: TransitionsService,
                private _eref: ElementRef,
                private toastr: ToastrService,
                private filtersService: FiltersService,
                public userService: UserApiService,
                private currentRouter: ActivatedRoute,
                public advancedScrollService: AdvancedYScrollService,
                public router: Router) {
        config.placement = 'bottom-right';
        config.autoClose = "outside";
        this.selectConfig = config;
    }

    ngOnInit() {
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        this.dictionaryService.getDictionaries(function (convertedDTO) {
        });
        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );
        this.storageService.read('tableChargeBacksListFilter') ?
            this.tableChargeBacksListFilter = this.storageService.read('tableChargeBacksListFilter') :
            this.tableChargeBacksListFilter = {
                chargebackReportChargebackID: {
                    title: "Chargeback Report ID",
                    checkbox: true,
                },
                chargebackReportID: {
                    title: "Report ID",
                    checkbox: true,
                },
                paymentGatewayID: {
                    title: "Payment Gateway ID",
                    checkbox: true,
                },
                transactionID: {
                    title: "Transaction ID",
                    checkbox: true,
                },
                chargebackID: {
                    title: "Chargeback ID",
                    checkbox: true,
                },
                transactionDate: {
                    title: "Transaction Date",
                    checkbox: true,
                },
                confirmedDate: {
                    title: "Confirmed Date",
                    checkbox: true,
                },
                chargedBackDate: {
                    title: "Chargeback Date",
                    checkbox: true,
                },
                chargedBackDoneDate: {
                    title: "Chargeback Done Date",
                    checkbox: true,
                },
                transactionTotalAmount: {
                    title: "Transaction Total Amount",
                    checkbox: true,
                },
                chargebackAmount: {
                    title: "Chargeback Amount",
                    checkbox: true,
                },
                isPayed: {
                    title: "Payed",
                    checkbox: true,
                }
            };
        this.currentRouter.params.subscribe(params => {
            this.params = params;
        });
        this.getList(0);
        this.checkColumnsFilterEmpty();
    }

    ngOnDestroy() {
        this.storageService.remove('tableChargeBacksListFilter');
        this.requests.unsubscribeRequests();
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

    public getList(skip) {
        this.operationsList = [];
        this.collectionSize = 0;
        this.reportsService.getChargebackOperationsList(
            this.params['id'],
            {
                take: this.pageSize,
                skip: skip,
                order: this.currentOrderBy,
                date: this.filtersService.getUTCDate(this.tablePeriodFrom)
            },
            (data) => {
                // console.log(data);
                this.operationsList = data.data;
                // if (data.data.length > 0) this.advancedScrollService.initAdvancedHorizontalScroll();
                this.areOperationsPayed = true;
                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i]['payed'] === null) {
                        this.areOperationsPayed = false;
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
        this.pageChange();
    }

    public downloadCurrentReportList(type) {
        const requestUrl = {
            take: this.pageSize,
            skip: this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0,
            date: this.filtersService.getUTCDate(this.tablePeriodFrom)
        };
        if (type === 'xls') {
            this.reportsService.getReportsBillingExcel(
                requestUrl,
                (data) => {
                    // console.log(data);
                    window.open(data['downloadUrl']);
                });
        }
        else if (type === 'bef') {
            this.reportsService.getReportsBillingBef(
                requestUrl,
                (data) => {
                    // console.log(data);
                    window.open(data['downloadUrl']);
                }, (error) => {

                });
        }
    }

    public setOperationsPayed(marker, report) {
        const that = this;
        if (marker !== null) {
            this.reportsService.setChargebackOperationPayed(
                report.billingReportID,
                {
                    reference: report['paymentReference'],
                    concurrencyToken: report['concurrencyToken'],
                    payed: marker
                },
                function () {
                    that.toastr.success(marker ?
                        'Operation is checked as Payed' :
                        'Operation is checked as Failed',
                        'Operation Pay Status');
                    that.pageChange();
                });
        }
        else {
            for (let i = 0; i < this.operationsList.length; i++) {
                if (this.operationsList[i]['payed'] === null) {
                    this.reportsService.setReportBillingPayed(
                        this.operationsList[i]['billingReportID'],
                        {
                            reference: this.operationsList[i]['paymentReference'],
                            concurrencyToken: this.operationsList[i]['concurrencyToken'],
                            payed: true
                        },
                        function () {
                            if (i + 1 === that.operationsList.length) {
                                that.toastr.success('Operations are checked as Payed on this page',
                                    'Operation Pay Status');
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

    public onDateRangeChange() {
        this.pageChange();
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
