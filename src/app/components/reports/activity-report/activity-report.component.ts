import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit} from "@angular/core";
import {orderBy} from "../../merchants/merchants.component";
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
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
import {DictionariesService} from "../../../services/api/dictionaries-api.service";
import {RequestsService} from "../../../services/http-interceptors/requests.service";
import {TransitionsService} from "../../../services/transitions.service";
import {FiltersService} from "../../../services/filters.service";

@Component({
    selector: 'app-activity-report',
    templateUrl: './activity-report.component.html',
    styleUrls: ['./../reports.component.scss'],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class ActivityReportComponent implements OnInit, OnDestroy, AfterViewChecked {
    public merchant: any;
    public reportsList: any;
    public activityReportsList: any;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    public filterGroupActivity: Object;

    placementPosition: string;

    reportsStatusFilter: any;
    reportsPeriodFilter: any;
    tableActivityReportsListFilter: Object;
    currentOrderBy: Object;

    isColumnsFilterEmpty = true;
    isDataFilterEmpty = true;

    public reportsActionTypeFilter: Array<Object>;
    public clearingCompanyFilter: Array<Object>;

    public toggleFilterSectionActivity: boolean = false;

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
            // console.log(event.lang);
            this.transitionsService.currentLang = event.lang;
        });
    }

    ngOnInit() {
        // console.log(window.innerWidth);
        this.transitionsService.currentRTLToggle.subscribe((data) => {
            if (window.innerWidth >= 768) {
                this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
            }
            else {
                this.placementPosition = 'bottom-left';
            }
        });
        this.maxSize = (window.innerWidth < 768) ? 4 : 10;
        this.merchant = this.localstorageService.read('merchant') || {};
        this.dictionaryService.getClearingCompanyList((data) => {
            this.clearingCompanyFilter = data;
        });

        this.localstorageService.read('tableActivityReportsListFilter') ?
            this.tableActivityReportsListFilter = this.localstorageService.read('tableActivityReportsListFilter') :
            this.tableActivityReportsListFilter = {
                operationDate: {
                    title: "Operation Date",
                    checkbox: true,
                },
                merchantName: {
                    title: "Merchant Name",
                    checkbox: true,
                },
                operationDoneBy: {
                    title: "User",
                    checkbox: true,
                },
                operationDescription: {
                    title: "Operation Description",
                    checkbox: true,
                },
                additionalDetails: {
                    title: "Additional Details",
                    checkbox: true,
                },
                correlationId: {
                    title: "Correlation ID",
                    checkbox: true,
                }
            };

        if (this.localstorageService.read('reportsFilterGroupActivity') != null) {
            this.filterGroupActivity = this.localstorageService.read('reportsFilterGroupActivity');
            this.toggleFilterSectionActivity = true;
        }
        else {
            this.initActivityFilterGroup();
        }

        this.transitionsService.currentRTLToggle.subscribe((data) => {
            this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
            // this.reloadMatTabGroup();
        });

        this.dictionaryService.getDictionaries((convertedDTO) => {
            this.reportsStatusFilter = convertedDTO['kycStatuses'];
            this.reportsActionTypeFilter = this.dictionaryService.dictionaries['operationCodes'];
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
        for (let item in this.filterGroupActivity) {
            console.log(this.filterGroupActivity[item]);
            if (typeof this.filterGroupActivity[item] === 'string' &&
                !!this.filterGroupActivity[item]) {
                this.isDataFilterEmpty = false;
                break;
            }
            if (this.filterGroupActivity[item].length &&
                this.filterGroupActivity[item].length !== 0) {
                this.isDataFilterEmpty = false;
            }
        }
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.tableActivityReportsListFilter) {
            if (this.tableActivityReportsListFilter[item]['checkbox'] === false) {
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

    public onColumnsChangeActivity() {
        this.checkColumnsFilterEmpty();
        this.localstorageService.write('tableActivityReportsListFilter', this.tableActivityReportsListFilter);
    }

    public onTabChange(event: MatTabChangeEvent) {
        this.reportsList = [];
        this.activityReportsList = [];
        this.toggleFilterSectionActivity = false;
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

        requestUrl['filterGroup'] = this.filterGroupActivity;
        this.reportsService.getReportsActivityList(
            requestUrl,
            (data) => {
                console.log(data);
                this.activityReportsList = data.data;
                // if (data.data.length > 0) this.advancedScrollService.initAdvancedHorizontalScroll();
                this.collectionSize = data.numberOfRecords;
            });

    }

    public initActivityFilterGroup() {
        this.filterGroupActivity = {
            actionTypes: [],
            doneBy: '',
            correlationId: ''
        };
        this.acceptActivityFilters();
        // this.toggleFilterSectionActivity = false;
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

    public downloadCurrentReportList() {
        const requestUrl = {
            merchantID: this.merchant['merchantID'] ? this.merchant['merchantID'] : '',
            take: this.pageSize,
            dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
            dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
            skip: this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0
        };

        this.reportsService.getReportsActivityExcel(requestUrl,
            (data) => {
                console.log(data);
                window.open(data['downloadUrl']);
            });
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

    public acceptActivityFilters() {
        // console.log('acceptActivityFilters');
        this.localstorageService.write('reportsFilterGroupActivity', this.filterGroupActivity);
        this.page === 1 ? this.pageChange() : this.page = 1;
        // this.toggleFilterSectionActivity = false;
        this.checkDataFilterEmpty();
    }

    public reloadConfigSelect($event) {
    }

    public transitionToActiveDetails(data: Object) {
        this.router.navigate(['/activity-reports-details', data['merchantHistoryID']]);
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
