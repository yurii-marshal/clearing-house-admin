import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {routerTransition} from "../../router.animations";
import {Router} from '@angular/router';
import {MerchantApiService} from "../../services/api/merchant-api.service";
import {TransitionsService} from "../../services/transitions.service";
import {RequestsService} from "../../services/http-interceptors/requests.service";
import {FiltersService} from "../../services/filters.service";
import {DictionariesService} from "../../services/api/dictionaries-api.service";
import {LocalstorageService} from "../../services/localstorage.service";
import {AdvancedYScrollService} from "../../services/advanced-y-scroll.service";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {CustomDatepickerI18n, I18n} from "../../services/ngb-datepicker-i18n.service";

export interface orderBy {
    activityStartDate: string;
    merchantID: string;
    riskRate: string;
    kycApprovalStatus: string;
    businessArea: string;
    phone: string;
}

@Component({
    selector: 'app-merchants',
    templateUrl: './merchants.component.html',
    styleUrls: ['./merchants.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class MerchantsComponent implements OnInit, OnDestroy {
    @ViewChild('d') d;
    @ViewChild('d2') d2;
    public merchantsList: any;
    public isMobileMediaScreen: boolean;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize;
    public collectionSize = 0;
    public pageSize = 10;

    public filterGroup: Object = {
        businessArea: '',
        riskRate: '',
        email: '',
        merchantReference: '',
        clearingCompany: ''
    };

    public outterFilterGroup: Object = {
        merchantName: '',
        businessID: '',
        phone: ''
    };

    isColumnsFilterEmpty = true;
    isDataFilterEmpty = true;

    merchantRiskFilter: any;
    merchantStatusFilter: any;
    selectedMerchantsPeriod: any;
    merchantPeriodFilter: any;
    merchantPeriodLabels: any;
    tableMerchantsListFilter: Object;
    currentOrderBy: Object;

    public placementPosition: string;

    public advanceScrollerState: string;

    public toggleFilterSection: boolean = false;

    public clearingCompanyFilter: Array<Object>;

    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    constructor(config: NgbDropdownConfig,
                private localstorageService: LocalstorageService,
                public dictionaryService: DictionariesService,
                public merchantsService: MerchantApiService,
                public requests: RequestsService,
                public transitionsService: TransitionsService,
                public translate: TranslateService,
                private _eref: ElementRef,
                private filtersService: FiltersService,
                public advancedScrollService: AdvancedYScrollService,
                public router: Router) {
        config.placement = 'bottom-right';
        config.autoClose = "outside";
        this.selectConfig = config;
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            // console.log(event.lang);
            this.transitionsService.currentLang = event.lang;
            this.initDrops();
        });
    }

    ngOnInit() {
        this.dictionaryService.getClearingCompanyList((data) => {
            this.clearingCompanyFilter = data;
        });
        this.dictionaryService.getDictionaries((convertedDTO) => {
            this.merchantStatusFilter = convertedDTO['kycStatuses'];
            this.merchantRiskFilter = this.dictionaryService.dictionaries['riskRates'];
        });
        this.transitionsService.currentRTLToggle.subscribe((data) => {
            this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
        });
        this.isMobileMediaScreen = (window.screen.width < 768);
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        this.merchantPeriodLabels = ['Today', 'Yesterday', 'Last Week', 'Last Month'];
        this.merchantPeriodFilter = [
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
        this.localstorageService.read('tableMerchantsListFilter') ?
            this.tableMerchantsListFilter = this.localstorageService.read('tableMerchantsListFilter') :
            this.tableMerchantsListFilter = {
                activityStartDate: {
                    title: "Creating Date",
                    checkbox: true,
                },
                merchantID: {
                    title: "Merchant ID",
                    checkbox: true,
                },
                merchantName: {
                    title: "Merchant",
                    checkbox: true,
                },
                businessId: {
                    title: "Business ID",
                    checkbox: true,
                },
                email: {
                    title: "E-Mail",
                    checkbox: true,
                },
                riskRate: {
                    title: "Risk Rate",
                    checkbox: true,
                },
                kycApprovalStatus: {
                    title: "KYC Approval Status",
                    checkbox: true,
                },
                businessArea: {
                    title: "Business Sector",
                    checkbox: true,
                },
                phone: {
                    title: "Phone Number",
                    checkbox: true,
                }
            };

        if (this.localstorageService.read('merchantsFilterGroup') != null) {
            this.filterGroup = this.localstorageService.read('merchantsFilterGroup');
            this.toggleFilterSection = true;
        }
        else this.initFilterGroup();

        this.localstorageService.remove('merchant');

        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );

        this.initDrops();

        this.checkDataFilterEmpty();
        this.checkColumnsFilterEmpty();

        this.getList(0);
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    private checkDataFilterEmpty() {
        this.isDataFilterEmpty = true;
        for (let item in this.merchantStatusFilter) {
            if (this.merchantStatusFilter[item]['checkbox'] === true) {
                this.isDataFilterEmpty = false;
                return;
            }
        }
        for (let item in this.filterGroup) {
            if (!!this.filterGroup[item]) {
                this.isDataFilterEmpty = false;
                break;
            }
        }
        if (this.tablePeriodFrom || this.tablePeriodTo) {
            this.isDataFilterEmpty = false;
        }
        console.log(this.tablePeriodFrom, this.tablePeriodTo, this.filterGroup);
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.tableMerchantsListFilter) {
            if (this.tableMerchantsListFilter[item]['checkbox'] === false) {
                this.isColumnsFilterEmpty = false;
                break;
            }
        }
    }

    private initDrops() {
        this.merchantPeriodFilter.forEach((item, index) => {
            let tmpFilter = this.merchantPeriodFilter.slice();
            this.translate.get(this.merchantPeriodLabels[index])
                .subscribe(res => {
                    tmpFilter[index].description = res;
                    this.merchantPeriodFilter = tmpFilter.slice();
                });
        });
    }

    public onColumnsChange() {
        this.checkColumnsFilterEmpty();
        this.localstorageService.write('tableMerchantsListFilter', this.tableMerchantsListFilter);
    }

    public acceptFilters() {
        this.localstorageService.write('merchantsFilterGroup', this.filterGroup);

        // if (this.page === 1) {
        //     this.pageChange();
        // } else {
        //     this.page = 1;
        // }
        this.page = 1;
        this.pageChange();

        this.checkDataFilterEmpty();
    }

    public acceptOutterFilters() {
        this.page = 1;
        this.pageChange();
    }

    public getList(skip) {
        // this.merchantsList = [];
        // filterGroup: Object.assign(this.filterGroup, this.outterFilterGroup)
        this.merchantsService.getMerchantsList(
            {
                take: this.pageSize,
                skip: skip,
                order: this.currentOrderBy,
                dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
                dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
                status: this.getKeysStatusFilter(),
                filterGroup: {...this.filterGroup, ...this.outterFilterGroup}
            },
            (data) => {
                // console.log(data);
                this.merchantsList = data.data;
                this.collectionSize = data.numberOfRecords;
                // if (data.data.length > 0) this.advancedScrollService.initAdvancedHorizontalScroll();
            });
    }

    public initFilterGroup() {
        this.filterGroup = {
            businessArea: '',
            riskRate: '',
            email: '',
            merchantReference: '',
        };
        for (let item in this.merchantStatusFilter) {
            this.merchantStatusFilter[item]['checkbox'] = false;
        }
        this.tablePeriodFrom = null;
        this.tablePeriodTo = null;
        this.selectedMerchantsPeriod = null;
        this.acceptFilters();
    }

    public pageChange() {
        // console.log("pageChange: ", this.page);
        this.getList(this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0);
    }

    public refreshPage() {
        this.merchantsList = [];
        this.collectionSize = 0;
        // console.log("refreshPage()");
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
        // console.log("setPositionIconStatus()");
        this.pageChange();
    }

    private getKeysStatusFilter() {
        const newStatusesObj = {};
        for (let prop in this.merchantStatusFilter) {
            if (!this.merchantStatusFilter.hasOwnProperty(prop)) continue;
            newStatusesObj[prop] = this.merchantStatusFilter[prop]['checkbox'];
        }
        return newStatusesObj;
    }

    public onPeriodFilterChange() {
        const today = new Date();
        const tmpDate = new Date();
        this.selectedMerchantsPeriod != null ? this.isDataFilterEmpty = false : this.checkDataFilterEmpty();
        switch (this.selectedMerchantsPeriod) {
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
        // console.log('onPeriodFilterChange: ', this.selectedMerchantsPeriod);
        // console.log(this.tablePeriodFrom, this.tablePeriodTo);
        // console.log("onPeriodFilterChange()");
        this.pageChange();
    }

    public onDateRangeChange() {
        // console.log("onDateRangeChange()");
        this.selectedMerchantsPeriod = null;
        this.checkDataFilterEmpty();
        this.pageChange();
    }

    public addNewMerchant() {
        this.router.navigate(['/merchants', 'new']);
    }

    public reloadConfigSelect($event) {
    }

    public transitionToProfile(data: Object) {
        this.localstorageService.write('merchant', data);
        this.router.navigate(['/merchants', data['merchantID']]);
    }

    public closeOutsideDatePicker(ev, el) {
        // const inputs = document.getElementsByTagName('input');
        // console.log(inputs);
        // for (let prop in inputs) {
        //     if (!inputs.hasOwnProperty(prop)) continue;
        //     if (inputs[prop].hasAttributes()) {
        //         const attributes = inputs[prop].attributes;
        //         for (let i = attributes.length - 1; i >= 0; i--) {
        //             if (attributes[i].name === 'ngbdatepicker') {
        //                 console.log('It is => ', inputs[prop]);
        //             }
        //         }
        //     }
        //     const inputProps = inputs[prop].attributes;

        // console.log(inputProps);
        // for (let attr in prop['attributes']) {
        //     if (attr['ngbdatepicker']) {
        //         console.log(attr['ngbdatepicker']);
        //     }
        // }
        // }
        // console.log(ev.target.id, el);
        if (!el.isOpen() ||
            ev.target.id == el ||
            (ev.target.offsetParent && ev.target.offsetParent.localName.includes('ngb-datepicker')) ||
            !(ev.target.parentElement && ev.target.parentElement.parentElement &&
            !ev.target.parentElement.parentElement.localName.includes('ngb-datepicker'))) {
            return;
        }
        if (el.isOpen() && ev.target.id != el) {
            el.close();
        }
    }
}
