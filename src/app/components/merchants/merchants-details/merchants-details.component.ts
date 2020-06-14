import {Component, OnDestroy, OnInit, ViewChild, KeyValueDiffers} from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct, NgbDropdownConfig, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {routerTransition} from "../../../router.animations";
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from "@angular/material";
import {NewRateDialogComponent} from "./new-rate-dialog.component";
import {MerchantApiService} from "../../../services/api/merchant-api.service";
import {DictionariesService} from "../../../services/api/dictionaries-api.service";
import {ToastrService} from "ngx-toastr";
import {FiltersService} from "../../../services/filters.service";
import {DocumentApiService} from "../../../services/api/document-api.service";
import {HttpClient} from "@angular/common/http";
import {TransitionsService} from "../../../services/transitions.service";
import {AppSettings} from "../../../app-settings";
import {RequestsService} from "../../../services/http-interceptors/requests.service";
import {ReportsApiService} from "../../../services/api/reports-api.service";
import {UserApiService} from "../../../services/api/user-api.service";
import {LocalstorageService} from "../../../services/localstorage.service";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {CustomDatepickerI18n, I18n} from "../../../services/ngb-datepicker-i18n.service";

import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {merge} from "rxjs/observable/merge";
import {NgForm} from '../../../../../node_modules/@angular/forms';


export interface orderBy {
    rateDate: string;
    basicRate: string;
    installmentRate: string;
    currencyToken: string;
    cardBin: string;
    touristRate:string;
    recalculateRates:string;
    operationDate:string;
}

export type MerchantDetails = {
    merchantName: string,
    merchantID: number,
    merchantReference: string,
    activityStartDate: number,
    paymentGateway: string,
    kycApprovalStatus: string,
    kycNotes: string,
    currentCollateralSecurityLimit: number,
    currentCreditCardJ5Blocks: number,
    commissionRates: Array<Object>,
    businessDetails: {
        businessName: string,
        businessId: number,
        businessPhone: string,
        businessType: string,
        webSite: string
    },
    personalDetails: {
        email: string,
        username: string,
        firstName: string,
        lastName: string,
        nationalIdNumber: number,
        nationalIdNumberDate: number,
    },
    paymentGatewayDetails: {
        terminalReference: string,
        creditCardVendor: string,
        additionalClearingHouse: any,
        additionalClearingHouseApprovedByCreditCompany: any
    },
    bankAccount: {
        bankNumber: number,
        branchNumber: number,
        bankAccountNumber: number,
    },
    creditCardAccount: {
        cardNumber: number,
        cardExpiration: {
            month: '',
            year: ''
        },
        cardOwnerName: string,
        cardOwnerNationalId: string
    }
}

@Component({
    selector: 'app-merchants-details',
    templateUrl: './merchants-details.component.html',
    styleUrls: ['./merchants-details.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})

export class MerchantsDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('fileKYC') fileKYC;
    @ViewChild('instance') instance: NgbTypeahead;
    @ViewChild('merchantForm') merchantForm;
    @ViewChild('financialForm') financialForm;

    focus$ = new Subject<string>();
    click$ = new Subject<string>();

    public exp = true;
    public areFieldsDirty: boolean = false;
    public isDeleteDocumentInProgress: boolean = false;
    public isAdminRoleBilling: boolean = false;
    public businessTable: Array<Object>;
    public billingCycleItems: Array<Object>;
    public cardBins: Array<Object>;

    public merchantData: any;
    public isNewMerchant: boolean = false;
    public businessTypes: Object;

    public page = 1;
    public maxSize;
    public collectionSize = 0;
    public pageSize = 10;

    public thisYear = new Date().getUTCFullYear();

    isRTLToggle: boolean = false;
    matGroupSelectedIndex: number = 0;

    public creditCard = {
        cardNumber: null,
        cardOwnerName: '',
        cardOwnerNationalId: '',
        cvv: '',
        cardExpiration: {
            month: '',
            year: this.thisYear
        },
        concurrencyToken: ''
    };

    merchantDatesMinRestrict: any;
    merchantDatesMaxRestrict: any;
    merchantEstablishedDateMaxRestrict: any;
    merchantBirthDate: NgbDateStruct;
    nationalIdNumberDate: NgbDateStruct;
    activityStartDate: any;
    businessRangeFrom: NgbDateStruct;
    businessRangeTo: NgbDateStruct;
    selectedBusinessActivityPeriod: string;
    businessEstablishedDate: NgbDateStruct;
    creditCardExpirationDate: NgbDateStruct;
    public selectedTransferCycle: any;
    public date: { year: number, month: number };

    changeRateData: Object = {
        basicRate: null,
        installmentRate: null,
        startDate: {
            year: '',
            month: '',
            day: ''
        },
        touristRate: null,
        recalculateRates: true,
        cardBin: null
    };

    expirationDateFrom: Object = {
        year: '',
        month: '',
        day: ''
    };

    expirationDateTo: Object = {
        year: '',
        month: '',
        day: ''
    };

    securityEntity: number = 5;
    securityHeader: string = '';

    merchantPeriodLabels: any;
    merchantPeriodFilter: any;
    merchantStatusFilter: any;
    businessTableFilters: any;
    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    public placementPosition: string;

    genderLabels: any;
    genderList: any;
    businessAreas: any;
    businessAreasList: Array<String>;
    riskLevelItems: Array<Object>;
    cardVendorItems: Array<Object>;
    transferCycleItems: Array<Object>;
    transferCycleWeekly: Array<Object>;
    transferCycleMonthly: Array<Object>;
    marketedByItems: Array<Object>;
    additionalCHLabels: any;
    additionalCHList: any;
    currentOrderBy: Object;
    documentDescription: Object = {
        type: '',
        name: '',
        description: ''
    };
    isUploadingInProgress: boolean = false;
    documentTypesList: Array<Object>;
    KYCStatus: number;
    KYCNotes: string;
    KYCTable: any;

    isColumnsFilterEmpty = true;

    params: any;

    differ: any;

    public showArchiveRates:boolean = false;

    constructor(public dialog: MatDialog,
                public router: Router,
                public requests: RequestsService,
                public merchantsService: MerchantApiService,
                public documentsService: DocumentApiService,
                public userService: UserApiService,
                private reportsService: ReportsApiService,
                private http: HttpClient,
                private modalService: NgbModal,
                private filtersService: FiltersService,
                private toastr: ToastrService,
                private currentRouter: ActivatedRoute,
                private localstorageService: LocalstorageService,
                private transitionsService: TransitionsService,
                private translate: TranslateService,
                config: NgbDropdownConfig,
                public dictionaryService: DictionariesService,
                private differs: KeyValueDiffers) {
        this.initMerchantData();
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
        const that = this;
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        const tmpDate = new Date();
        this.expirationDateFrom = this.filtersService.setNgbDate(new Date(tmpDate.setDate(1)));
        this.expirationDateTo = this.filtersService.setNgbDate(new Date(tmpDate.setFullYear(tmpDate.getUTCFullYear() + 10)));
        const prevUrl = this.localstorageService.read('previousUrl') || '';
        if (prevUrl.match(/\/(.*)\//)) {
            if (prevUrl.match(/\/(.*)\//)[1] === 'activity-reports-details') {
                this.matGroupSelectedIndex = 3;
            }
        }
        this.transitionsService.currentRTLToggle.subscribe((data) => {
            this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
        });
        this.transitionsService.currentRTLToggle.subscribe(() => {
            that.isRTLToggle = true;
            that.reloadMatTabGroup();
        });
        this.currentRouter.params.subscribe(params => {
            // console.log(params);
            that.params = params;
            if (!params['id']) {
                that.router.navigate(['/merchants']);
            }
            else if (params['id'] !== 'new') {
                that.isNewMerchant = false;
                this.KYCStatus = 1;
                this.KYCNotes = '';
                this.KYCTable = [
                    {
                        id: 0,
                        format: 'jpg',
                        date: new Date(),
                        type: 'Personal ID Card',
                        description: 'Lorem ipsum Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
                        status: 1
                    },
                    {
                        id: 1,
                        format: 'pdf',
                        date: new Date(),
                        type: 'Form No.1 of the Company Registrar ',
                        description: '',
                        status: 0
                    },
                    {
                        id: 2,
                        format: 'pdf',
                        date: new Date(),
                        type: 'Memorandum of Association',
                        description: '',
                        status: 2
                    },
                    {
                        id: 3,
                        format: 'jpg',
                        date: new Date(),
                        type: '2,244 NIS.',
                        description: '',
                        status: 0
                    },
                    {
                        id: 4,
                        format: 'jpg',
                        date: new Date(),
                        type: '2,244 NIS.',
                        description: '',
                        status: 0
                    }
                ];
                this.getKYCList(() => {
                });
                that.reloadMerchantData(true);
            }
            else if (params['id'] === 'new') {
                that.isNewMerchant = true;
                that.initDiffer();
                that.getChangedInit(); // default state
            }

            


        });
        this.userService.getUserData(() => {
            this.isAdminRoleBilling = this.userService.userData['isBillingAdmin'];
            this.dictionaryService.getBusinessAreas((data) => {
                this.businessAreas = data;
                this.businessAreasList = data.map(a => a['businessSectorName']);
            }, () => {
            });
        }, () => {
            // console.log('userService.getUserData');
        });

        this.dictionaryService.getClearingCompanyList(function (data) {
            that.cardVendorItems = data;
        });

        this.dictionaryService.getDictionaries(function () {
            // console.log(that.dictionaryService.dictionaries);
            that.genderList = that.dictionaryService.dictionaries['genders'];
            that.businessTypes = that.dictionaryService.dictionaries['businessTypes'];
            that.riskLevelItems = that.dictionaryService.dictionaries['riskRates'];
            that.transferCycleItems = that.dictionaryService.dictionaries['schedulePeriodTypes'];
            that.billingCycleItems = that.dictionaryService.dictionaries['clearingCompanyConfirmationTypes'];
            that.cardBins = that.dictionaryService.dictionaries['solek'];
            that.dictionaryService.getPaymentGatewayList(function (data) {
                that.marketedByItems = data;
            });
        });
        let today = new Date(),
            minToday = new Date(),
            maxToday = new Date(),
            fromYear = minToday.getFullYear() - 100,
            toYear = maxToday.getFullYear() - 18;
        // console.log(today.setFullYear(fromYear));
        // console.log(today.setFullYear(toYear));
        this.merchantDatesMinRestrict = this.filtersService.setNgbDate(new Date(today.setFullYear(fromYear)));
        this.merchantDatesMaxRestrict = this.filtersService.setNgbDate(new Date(today.setFullYear(toYear)));
        this.merchantEstablishedDateMaxRestrict = this.filtersService.setNgbDate(new Date());
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
        this.merchantStatusFilter = {
            today: {
                title: "",
                checkbox: false,
            },
            yesterday: {
                title: "",
                checkbox: false,
            },
            lastWeek: {
                title: "",
                checkbox: false,
            },
            lastMonth: {
                title: "",
                checkbox: false,
            }
        };
        this.businessTableFilters = {
            operationDate: {
                title: "Date",
                checkbox: true,
            },
            operationCode: {
                title: "Operation Code",
                checkbox: true,
            },
            operationDoneBy: {
                title: "Done By",
                checkbox: true,
            },
            operationDescription: {
                title: "Description",
                checkbox: true,
            }
        };
        this.genderLabels = ['Male', 'Female'];
        // this.genderList = [
        //     {
        //         code: 1,
        //         description: ''
        //     },
        //     {
        //         code: 2,
        //         description: ''
        //     }
        // ];
        this.additionalCHLabels = ['Upay'];
        this.additionalCHList = [{
            code: 'Upay',
            description: ''
        }];

        this.initDrops();

        this.checkColumnsFilterEmpty();

        // this.transferCycleItems = [
        //     {
        //         code: 1,
        //         description: 'Daily'
        //     },
        //     {
        //         code: 2,
        //         description: 'Week'
        //     },
        //     {
        //         code: 3,
        //         description: 'Month'
        //     }
        // ];
        // this.marketedByItems = [
        //     {
        //         code: 1,
        //         description: 'Test Payment Gateway'
        //     },
        //     {
        //         code: 2,
        //         description: 'Easy Card'
        //     }
        // ];
        //***********************//
        // KYC tab
        //***********************//
    }

    search = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
        const inputFocus$ = this.focus$;

        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
            map(term =>
                (term === '' ?
                    this.businessAreasList :
                    this.businessAreasList.filter(v =>
                        v.toLowerCase().indexOf((term as any).toLowerCase()) > -1)).slice(0, 10))
        );
    };

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.businessTableFilters) {
            if (this.businessTableFilters[item]['checkbox'] === false) {
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
        this.additionalCHList.forEach((item, index) => {
            let tmpFilter = this.additionalCHList.slice();
            this.translate.get(this.additionalCHLabels[index])
                .subscribe(res => {
                    tmpFilter[index].description = res;
                    this.additionalCHList = tmpFilter.slice();
                });
        });
    }

    reloadMatTabGroup() {
        const that = this;
        setTimeout(function () {
            that.isRTLToggle = false;
        }, 100);
    }

    public transitionToActiveDetails(data: Object) {
        this.router.navigate(['/activity-reports-details', data['merchantHistoryID']]);
    }

    tabChanged(event) {
        // console.log(event);
        // this.matGroupSelectedIndex = 0;
    }

    getChanged() {
        if (this.areFieldsDirty) return true;

        //return this.merchantForm.touched || this.financialForm.touched;
        let customerChanges = this.differ.general.diff(this.merchantData); // note - after each diff differ state reseted - so it is temporary solution
        if (customerChanges && customerChanges.isDirty) this.areFieldsDirty = true;

        customerChanges = this.differ.businessDetails.diff(this.merchantData.businessDetails);
        if (customerChanges && customerChanges.isDirty) this.areFieldsDirty = true;

        customerChanges = this.differ.personalDetails.diff(this.merchantData.personalDetails);
        if (customerChanges && customerChanges.isDirty) this.areFieldsDirty = true;

        customerChanges = this.differ.paymentGatewayDetails.diff(this.merchantData.paymentGatewayDetails);
        if (customerChanges && customerChanges.isDirty) this.areFieldsDirty = true;

        customerChanges = this.differ.bankAccount.diff(this.merchantData.bankAccount);
        if (customerChanges && customerChanges.isDirty) this.areFieldsDirty = true;

        customerChanges = this.differ.creditCardAccount.diff(this.merchantData.creditCardAccount);
        if (customerChanges && customerChanges.isDirty) this.areFieldsDirty = true;

        customerChanges = this.differ.address.diff(this.merchantData.address);
        if (customerChanges && customerChanges.isDirty) this.areFieldsDirty = true;
        

        if (this.areFieldsDirty) return true;

        return false;
    }

    getChangedInit() {
        let customerChanges = this.differ.general.diff(this.merchantData); //reset differences
        this.differ.businessDetails.diff(this.merchantData.businessDetails);
        this.differ.personalDetails.diff(this.merchantData.personalDetails);
        this.differ.paymentGatewayDetails.diff(this.merchantData.paymentGatewayDetails);
        this.differ.bankAccount.diff(this.merchantData.bankAccount);
        this.differ.creditCardAccount.diff(this.merchantData.creditCardAccount);
        this.differ.address.diff(this.merchantData.address);
    }

    initDiffer() {
        this.differ = {};

        this.differ.general = this.differs.find(this.merchantData).create();
        this.differ.businessDetails = this.differs.find(this.merchantData.businessDetails).create();
        this.differ.personalDetails = this.differs.find(this.merchantData.personalDetails).create();
        this.differ.paymentGatewayDetails = this.differs.find(this.merchantData.paymentGatewayDetails).create();
        this.differ.bankAccount = this.differs.find(this.merchantData.bankAccount).create();
        this.differ.creditCardAccount = this.differs.find(this.merchantData.creditCardAccount).create();
        this.differ.address = this.differs.find(this.merchantData.address).create();
    }

    onMerchantObjectChanged(event) {
        // console.log(event);
        this.areFieldsDirty = true;
    }

    getKYCList(callback) {
        const that = this;
        this.documentsService.getDocumentsTypes(function (list) {
            that.documentTypesList = list;
            that.documentsService.getMerchantKYCDocuments(
                that.params['id'],
                {
                    showDeleted: false
                },
                function (data) {
                    // console.log(data);
                    for (let i = 0; i < data.data.length; i++) {
                        for (let j = 0; j < list.length; j++) {
                            if (data.data[i]['documentTypeID'] === list[j]['documentTypeID']) {
                                data.data[i]['documentType'] = list[j]['documentTypeName'];
                            }
                        }
                    }
                    that.KYCTable = data.data;
                    callback();
                }
            );
        });
    }

    initTransferCycleItems() {
        this.transferCycleWeekly = [
            {code: false, description: 'Sun'},
            {code: false, description: 'Mon'},
            {code: false, description: 'Thu'},
            {code: false, description: 'Wed'},
            {code: false, description: 'Tue'},
            {code: false, description: 'Fri'},
            {code: false, description: 'Sat'}
        ];
        this.transferCycleMonthly = [];
        for (let i = 0; i < 31; i++) {
            this.transferCycleMonthly.push({
                code: false,
                description: i + 1
            });
        }
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    public newRateDialog(): void {
        let dialogRef = this.dialog.open(NewRateDialogComponent, {
            width: '500px',
            data: {items: '[]'}
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed: ', result);
        });
    }

    // public approveKYCDialog(): void {
    //     let dialogRef = this.dialog.open(NewRateDialogComponent, {
    //         width: '500px',
    //         data: {items: '[]'}
    //     });
    //
    //     dialogRef.afterClosed().subscribe(result => {
    //         console.log('The dialog was closed: ', result);
    //     });
    // }

    public pageChange() {
        debugger
        this.getList(this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0);
    }

    public refreshPage() {
        this.businessTable = [];
        this.collectionSize = 0;
        this.pageChange();
    }

    public onPeriodFilterChange() {
        const today = new Date();
        const tmpDate = new Date();
        switch (this.selectedBusinessActivityPeriod) {
            case 'today':
                this.businessRangeFrom = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                this.businessRangeTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            case 'yesterday':
                const yesterday = new Date(tmpDate.setDate(tmpDate.getDate() - 1));
                this.businessRangeFrom = this.filtersService.setCustomNgbDate(
                    yesterday.getUTCFullYear(),
                    yesterday.getUTCMonth() + 1,
                    yesterday.getUTCDate());
                this.businessRangeTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            case 'lastWeek':
                const lastWeek = new Date(tmpDate.setDate(tmpDate.getDate() - 7));
                this.businessRangeFrom = this.filtersService.setCustomNgbDate(
                    lastWeek.getUTCFullYear(),
                    lastWeek.getUTCMonth() + 1,
                    lastWeek.getUTCDate());
                this.businessRangeTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            case 'lastMonth':
                const lastMonth = new Date(tmpDate.setDate(tmpDate.getDate() - 30));
                this.businessRangeFrom = this.filtersService.setCustomNgbDate(
                    lastMonth.getUTCFullYear(),
                    lastMonth.getUTCMonth() + 1,
                    lastMonth.getUTCDate());
                this.businessRangeTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            default:
                this.businessRangeFrom = undefined;
                this.businessRangeTo = undefined;
        }
        // console.log('onPeriodFilterChange: ', this.selectedBusinessActivityPeriod);
        this.pageChange();
    }

    public getList(skip) {
        const that = this;
        this.merchantsService.getMerchantBusinessInfo(this.params['id'], {
            take: this.pageSize,
            skip: skip,
            order: this.currentOrderBy,
            dateFrom: this.filtersService.getUTCDate(this.businessRangeFrom),
            dateTo: this.filtersService.getUTCDate(this.businessRangeTo)
        }, function (data) {
            // console.log('businessTable: ', data);
            that.businessTable = data.data;
            that.collectionSize = data.numberOfRecords;
        });
    }

    public reloadConfigSelect($event) {
    }

    public setPositionIconStatus(icon: string) {
        this.currentOrderBy = {
            prop: icon,
            order: this.orderBy[icon]
        };
        if (this.orderBy[icon] === 'ASC') {
            this.orderBy[icon] = 'DESC';
        } else {
            this.orderBy[icon] = 'ASC';
        }
        for (let i in this.orderBy) {
            if (i !== icon) {
                this.orderBy[i] = "";
            }
        }
        this.pageChange();
    }

    public setPositionIconStatus2(icon: string) {
       
    }

    public openApplyLimitsDialog(SecurityLimitsModalContent) {
        const that = this;
        this.modalService.open(
            SecurityLimitsModalContent,
            {windowClass: 'clean-house-modals', backdrop: 'static'})
            .result.then((result) => {
            if (typeof result === 'string') {
                this.merchantsService.applySecurityLimits(
                    this.params['id'],
                    {
                        collateral: Number(result),
                        concurrencyToken: that.merchantData['concurrencyToken']
                    },
                    function (data) {
                        that.reloadMerchantData();
                        that.toastr.success(data.message, 'Set Security Limits');
                    });
            }
        }, (reason) => {
            // console.log(`Dismissed ${reason}`);
        });
    }

    public openApplyJ5BlockDialog(SecurityLimitsModalContent) {
        const that = this;

        if (this.getChanged()) {
            if (!window.confirm('You have unsaved data. Do you really want to cancel?')) return;
        }

        this.modalService.open(
            SecurityLimitsModalContent,
            {windowClass: 'clean-house-modals', backdrop: 'static'})
            .result.then((result) => {
            if (typeof result === 'number') {
                this.merchantsService.applyCreditCardJ5Blocks(
                    this.params['id'],
                    {
                        creditCardJ5Blocks: result,
                        concurrencyToken: that.merchantData['concurrencyToken']
                    },
                    function (data) {
                        that.reloadMerchantData();
                        that.toastr.success(data.message, 'Set Security Limits');
                    },
                    function (error) {
                        that.reloadMerchantData();
                        if (error.status === 400) {
                            that.toastr.error(error.error.message, 'Set Security Limits');
                        }
                    });
            }
        }, (reason) => {
            // console.log(`Dismissed ${reason}`);
        });
    }

    public transitionToChargebacks() {
        this.localstorageService.write('merchant', this.merchantData);
        this.localstorageService.write('idUserForTransitions', this.params['id']);
        this.router.navigate(['/chargebacks']);
    }

    public transitionToTransactions() {
        this.localstorageService.write('merchant', this.merchantData);
        this.localstorageService.write('idUserForTransitions', this.params['id']);
        this.router.navigate(['/transactions']);
    }

    public transitionToReports(tab) {
        this.localstorageService.write('merchant', this.merchantData);
        this.localstorageService.write('idUserForTransitions', this.params['id']);
        this.localstorageService.write('tabForReport', tab);
        this.router.navigate(['/reports']);
    }

    public lockAccount() {
        const that = this;

        if (this.getChanged()) {
            if (!window.confirm('You have unsaved data. Do you really want to cancel?')) return;
        }

        this.merchantsService.lockMerchantAccount(
            this.params['id'],
            {},
            function (data) {
                // console.log(data);
                that.merchantData.isAccountLocked = true;
                that.toastr.success(data.message, 'Lock Merchant');
                that.reloadMerchantData();
            });
    }

    public unlockAccount() {
        const that = this;

        if (this.getChanged()) {
            if (!window.confirm('You have unsaved data. Do you really want to cancel?')) return;
        }

        this.merchantsService.unlockMerchantAccount(
            this.params['id'],
            {},
            function (data) {
                // console.log(data);
                that.merchantData.isAccountLocked = false;
                that.toastr.success(data.message, 'Unlock Merchant');
                that.reloadMerchantData();
            });
    }

    public resendInvitation() {
        const that = this;
        this.merchantsService.resendInvitation(
            this.params['id'],
            {},
            function (data) {
                that.toastr.success(data.message, 'Resend Invitation');
            });
    }

    public downloadBusinessActivityReport() {
        this.reportsService.getReportsActivityExcel({
                merchantID: this.params['id'],
                dateFrom: this.filtersService.getUTCDate(this.businessRangeFrom),
                dateTo: this.filtersService.getUTCDate(this.businessRangeTo)
            },
            function (data) {
                window.open(data['downloadUrl']);
            });
    }

    public saveMerchant(isFormValid) {
        if (isFormValid) {
            let that = this;
            // console.log(this.merchantBirthDate, this.merchantData);
            this.merchantData.currentCollateralSecurityLimit = Number(this.merchantData.currentCollateralSecurityLimit);
            this.merchantData.personalDetails.birthDate = this.filtersService.getUTCDate(this.merchantBirthDate);
            this.merchantData.personalDetails.nationalIdNumberDate = this.filtersService.getUTCDate(this.nationalIdNumberDate);
            if (this.merchantData.businessDetails['businessArea'] !== '') {
                this.businessAreas.forEach((item) => {
                    if (item['businessSectorName'] === this.merchantData.businessDetails['businessArea']) {
                        this.merchantData.businessDetails['businessAreaID'] = item['businessSectorID'];
                    }
                });
            }
            this.merchantData.businessDetails.businessEstablishedDate =
                this.businessEstablishedDate ? this.filtersService.getUTCDate(this.businessEstablishedDate) : null;
            this.merchantData.creditCardAccount.cardExpiration = this.creditCardExpirationDate;
            this.merchantData['billingCycle'] = {
                periodType: this.selectedTransferCycle,
                days: []
            };
            switch (this.selectedTransferCycle) {
                case 'week':
                    for (let i = 0; i < this.transferCycleWeekly.length; i++) {
                        if (this.transferCycleWeekly[i]['code']) this.merchantData['billingCycle']['days'].push(i);
                    }
                    break;
                case 'month':
                    for (let i = 0; i < this.transferCycleMonthly.length; i++) {
                        if (this.transferCycleMonthly[i]['code']) this.merchantData['billingCycle']['days'].push(i + 1);
                    }
                    break;
            }
            if (this.isNewMerchant) {
                this.merchantsService.createMerchant(this.merchantData, function (data) {
                    // console.log('createMerchant, ', data);
                    that.areFieldsDirty = false;
                    that.getChangedInit();
                    that.toastr.success(data.message, 'New Merchant');
                    that.router.navigate(['/merchants', data.entityID]);
                    
                }, function (error) {
                    if (error.error.errors.length > 0) {
                        error.error.errors.forEach(function (item) {
                            if (item.description !== '')
                                that.toastr.error(item.description, 'Validation Error', {
                                    disableTimeOut: true,
                                    closeButton: true
                                });
                        });
                    }
                    else {
                        that.toastr.error(error.error.message, 'Validation Error', {
                            disableTimeOut: true,
                            closeButton: true
                        });
                    }
                });
            }
            else {
                this.merchantsService.updateMerchant(
                    this.params['id'],
                    this.merchantData,
                    function (data) {
                        // console.log('updateMerchant, ', data);
                        that.areFieldsDirty = false;
                        //that.getChangedInit();
                        that.toastr.success(data.message, 'Update Merchant');
                        that.reloadMerchantData();
                        //that.router.navigate(['/merchants']);
                    }, function (error) {
                        if (error.error.errors && error.error.errors.length > 0) {
                            error.error.errors.forEach(function (item) {
                                if (item.description !== '')
                                    that.toastr.error(item.description, 'Validation Error', {
                                        disableTimeOut: true,
                                        closeButton: true
                                    });
                            });
                        }
                        else {
                            that.toastr.error(error.error.message, 'Validation Error', {
                                disableTimeOut: true,
                                closeButton: true
                            });
                        }
                    });
            }
        }
        else {
            this.toastr.error('Please, fill all required fields correctly', '', {
                disableTimeOut: true,
                closeButton: true
            });
        }
    }

    public exportFile(type: string) {
        // console.log(type);
    }

    public resetPassword() {
        const that = this;
        this.merchantsService.resetMerchantPassword(
            this.params['id'],
            {},
            function (data) {
                that.toastr.success(data.message, 'Reset Password');
            });
    }

    public loginAsMerchant() {

    }

    public initMerchantData() {
        this.initTransferCycleItems();

            this.merchantData = {
                isJ5RenewalFailed: false,
                merchantName: '',
                merchantID: null,
                merchantReference: '',
                activityStartDate: null,
                paymentGatewayID: 2,
                kycApprovalStatus: '',
                kycNotes: '',
                currentCollateralSecurityLimit: null,
                currentCreditCardJ5Blocks: null,
                commissionRates: [],
                businessDetails: {
                    businessEstablishedDate: null,
                    businessName: '',
                    businessId: null,
                    businessPhone: '',
                    businessType: '',
                    webSite: ''
                },
                personalDetails: {
                    email: '',
                    gender: '',
                    firstName: '',
                    lastName: '',
                    cellPhone: '',
                    birthDate: '',
                    nationalIdNumber: null,
                    nationalIdNumberDate: null,
                },
                paymentGatewayDetails: {
                    terminalReference: '',
                    creditCardVendor: '',
                    additionalClearingHouse: '',
                    additionalClearingHouseApprovedByCreditCompany: ''
                },
                bankAccount: {
                    bankNumber: null,
                    branchNumber: null,
                    bankAccountNumber: null,
                },
                creditCardAccount: {
                    cardNumber: null,
                    cardExpiration: {
                        month: '',
                        year: ''
                    },
                    cardOwnerName: '',
                    cardOwnerNationalId: ''
                },
                address: {
                    street: '',
                    city: '',
                    zip: ''
                }
            };

    }

    public reloadMerchantData(firstTime: boolean = false) {
        const that = this;
        this.merchantsService.getMerchantByID(
            this.params['id'],
            function (data) {
                // console.log('merchantData, ', data);
                that.localstorageService.write('merchant', data);
                // data['riskRate'] = data['riskRate'].toString();
                that.merchantData = data;
                // console.log(that.merchantData['currentCreditCardJ5Blocks']);
                // if (that.merchantData.currentCreditCardJ5Blocks === null) that.merchantData.currentCreditCardJ5Blocks = 5;
                let activityDate = that.merchantData.activityStartDate;

                if (that.merchantData.personalDetails.birthDate)
                    that.merchantBirthDate = that.filtersService.setNgbDate(new Date(that.merchantData.personalDetails.birthDate));
                if (that.merchantData.personalDetails.nationalIdNumberDate)
                    that.nationalIdNumberDate = that.filtersService.setNgbDate(new Date(that.merchantData.personalDetails.nationalIdNumberDate));
                if (that.merchantData.businessDetails.businessEstablishedDate)
                    that.businessEstablishedDate = that.filtersService.setNgbDate(new Date(that.merchantData.businessDetails.businessEstablishedDate));

                if (that.merchantData['billingCycle']) {
                    that.selectedTransferCycle = that.merchantData['billingCycle']['periodType'];
                }
                if (that.merchantData.billingCycle) {
                    switch (that.selectedTransferCycle) {
                        case 'week':
                            for (let i = 0; i < that.merchantData['billingCycle']['days'].length; i++) {
                                that.transferCycleWeekly[that.merchantData['billingCycle']['days'][i]]['code'] = true;
                            }
                            break;
                        case 'month':
                            for (let i = 0; i < that.merchantData['billingCycle']['days'].length; i++) {
                                that.transferCycleMonthly[that.merchantData['billingCycle']['days'][i] - 1]['code'] = true;
                            }
                            break;
                    }
                }

                if (that.merchantData.creditCardAccount.cardExpiration) {
                    that.creditCardExpirationDate = that.filtersService.setCustomNgbDate(
                        that.merchantData.creditCardAccount.cardExpiration.year,
                        that.merchantData.creditCardAccount.cardExpiration.month
                    );
                }

                // that.merchantData.transactionsMaxDailyAmount = that.merchantData.transactionsMaxDailyAmount || 2500;
                // that.merchantData.singleTransactionMaxAmount = that.merchantData.singleTransactionMaxAmount || 2500;

                if(firstTime)
                    that.initDiffer();
                that.getChangedInit(); // default state
            });
        this.refreshPage();
    }

    //***********************//
    // KYC tab
    //***********************//
    public approveUserKYCStatus() {
        const that = this;
        this.merchantsService.approveKYC(
            this.params['id'],
            {
                concurrencyToken: this.merchantData['concurrencyToken'],
                kycNotes: this.KYCNotes,
            },
            function () {
                that.reloadMerchantData();
                that.toastr.success('KYC will be approved', 'KYC Approve');
            }, (error) => {
                console.log(error);
                that.KYCNotes = that.merchantData['KYCNotes'];
                that.toastr.error(error.error.message, 'KYC Approve', {
                    disableTimeOut: true,
                    closeButton: true
                });
            }
        );
    }

    public recallUserKYCStatus() {
        const that = this;
        this.merchantsService.recallKYC(
            this.params['id'],
            {
                concurrencyToken: this.merchantData['concurrencyToken']
            },
            function () {
                that.reloadMerchantData();
                that.toastr.success('KYC will be recalled', 'KYC Recall');
            }
        );
    }

    public uploadNewKYCDocument(event, EditCurrentKYCDocumentModalContent) {
        const that = this;
        let fileList: FileList = event.target.files;
        // console.log(event.target.files);
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            // console.log(file);
            let ext = file.name.match(/\.([^\.]+)$/)[1];
            if (file.size > 20000000) {
                that.toastr.error('File must have maximum size to 20MB', 'Uploading failed', {
                    disableTimeOut: true,
                    closeButton: true
                });
            }
            else if (ext.toLowerCase() === 'jpg' || ext === 'pdf') {
                // let headers = new Headers();
                /** In Angular 5, including the header Content-Type can invalidate your request */
                // headers.append('Content-Type', 'multipart/form-data');
                // headers.append('Enctype', 'multipart/form-data');
                // headers.append('Accept', 'application/json');
                this.isUploadingInProgress = true;

                this.documentDescription = {
                    type: '',
                    name: '',
                    description: ''
                };
                this.modalService.open(
                    EditCurrentKYCDocumentModalContent,
                    {windowClass: 'clean-house-modals', backdrop: 'static'})
                    .result.then((result) => {
                    if (result) {
                        this.http.post(AppSettings.BASE_URL + `/document/${that.params['id']}`, formData)
                            .subscribe(
                                (data) => {
                                    that.getKYCList(() => {
                                        that.KYCTable[that.KYCTable.length - 1]['documentTypeID'] = this.documentDescription['type'];
                                        that.KYCTable[that.KYCTable.length - 1]['documentDescription'] = this.documentDescription['description'];
                                        this.documentsService.updateKYCDetails(
                                            that.params['id'],
                                            that.KYCTable[that.KYCTable.length - 1]['documentID'],
                                            that.KYCTable[that.KYCTable.length - 1],
                                            function () {
                                                that.getKYCList(() => {
                                                    that.reloadMerchantData();
                                                    that.toastr.success('File is uploaded', 'Successful uploading');
                                                    that.fileKYC.nativeElement.value = '';
                                                    that.isUploadingInProgress = false;
                                                });
                                            }, function (error) {
                                                that.fileKYC.nativeElement.value = '';
                                                that.isUploadingInProgress = false;
                                                that.toastr.error(error, 'Uploading failed', {
                                                    disableTimeOut: true,
                                                    closeButton: true
                                                });
                                            });
                                    });
                                },
                                (error) => {
                                    that.toastr.error(error, 'Uploading failed', {
                                        disableTimeOut: true,
                                        closeButton: true
                                    });
                                    that.fileKYC.nativeElement.value = '';
                                    that.isUploadingInProgress = false;
                                }
                            )
                    }
                    else {
                        that.fileKYC.nativeElement.value = '';
                        that.isUploadingInProgress = false;
                    }
                }, (reason) => {
                    // console.log(`Dismissed ${reason}`);
                    that.fileKYC.nativeElement.value = '';
                    that.isUploadingInProgress = false;
                });
            }
            else {
                that.toastr.error('Available only JPG or PDF formats', 'Uploading failed', {
                    disableTimeOut: true,
                    closeButton: true
                });
            }
        }
    }

    private openChooseKYCDocType(formData, ChangeKYCDocTypeModalContent) {
        const that = this;
    }

    public rejectCurrentKYCDocument(document) {
        const that = this;
        let currentDocument = {...document};
        currentDocument['status'] = 'rejected';
        this.documentsService.rejectKYC(
            that.params['id'],
            document.documentID,
            currentDocument,
            function () {
                that.reloadMerchantData();
                that.getKYCList(() => {
                });
                that.toastr.success('Document is rejected', 'Document reject');
            }
        );
    }

    public approveCurrentKYCDocument(document) {
        const that = this;
        let currentDocument = {...document};
        currentDocument['status'] = 'approved';
        this.documentsService.approveKYC(
            that.params['id'],
            document.documentID,
            currentDocument,
            function () {
                that.reloadMerchantData();
                that.getKYCList(() => {
                });
                that.toastr.success('Document is approved', 'Document approve');
            }
        );
    }

    public openAddCreditCardDialog(CreditCardModalContent) {
        const that = this;

        if (this.getChanged()) {
            if (!window.confirm('You have unsaved data. Do you really want to cancel?')) return;
        }

        if (that.creditCard){
            that.creditCard = {
                cardNumber: null,
                cardOwnerName: '',
                cardOwnerNationalId: '',
                cvv: '',
                cardExpiration: {
                    month: '',
                    year: this.thisYear
                },
                concurrencyToken: ''
            };
        }

        this.modalService.open(
            CreditCardModalContent,
            {windowClass: 'clean-house-modals', backdrop: 'static'})
            .result.then((result) => {
            if (result !== null) {
                that.creditCard['concurrencyToken'] = that.merchantData['concurrencyToken'];
                that.merchantsService.addCreditCard(
                    that.params['id'],
                    that.creditCard,
                    function () {
                        that.reloadMerchantData();
                        that.toastr.success('New Credit Card added successfully', 'Add Credit Card');
                    },
                    function (error) {
                        if (error.status === 400) {
                            that.toastr.error(error.error.message, 'Add Credit Card');
                        }
                    }
                );
            }
        }, (reason) => {
            // console.log(`Dismissed ${reason}`);
        });
    }

    public openChangeRateDialog(ChangeRateModalContent) {
        const that = this;

        if (this.getChanged()) {
            if (!window.confirm('You have unsaved data. Do you really want to cancel?')) return;
        }

        this.modalService.open(
            ChangeRateModalContent,
            {windowClass: 'clean-house-modals rates-modal', backdrop: 'static'})
            .result.then((result) => {
            if (result !== {}) {
                this.merchantsService.applyCommisionRates(
                    this.params['id'],
                    {
                        rateDate: `${result.startDate.year}-${result.startDate.month}-${result.startDate.day}`,
                        concurrencyToken: that.merchantData['concurrencyToken'],
                        installmentRate: Number(result['installmentRate']),
                        basicRate: Number(result['basicRate']),
                        touristRate: result.touristRate,
                        recalculateRates: result.recalculateRates,
                        cardBin: result.cardBin
                    },
                    function (result) {
                        that.reloadMerchantData();
                        that.toastr.success(result.message, 'Change Rate');
                    }
                );
            }
        }, (reason) => {
            // console.log(`Dismissed ${reason}`);
        });
    }

    public openApproveKYCDialog(ApproveKYCDocumentModalContent) {
        const that = this;
        this.modalService.open(
            ApproveKYCDocumentModalContent,
            {windowClass: 'clean-house-modals', backdrop: 'static'})
            .result.then((result) => {
            if (typeof result === 'string') {
                // console.log(result);
                that.approveUserKYCStatus();
            }
        }, (reason) => {
            // console.log(`Dismissed ${reason}`);
        });
    }

    public openEditKYCDocumentModal(EditCurrentKYCDocumentModalContent, document, index) {
        const that = this;
        this.documentDescription = {
            type: document.documentTypeID,
            name: document.documentType,
            description: document.documentDescription
        };
        this.modalService.open(
            EditCurrentKYCDocumentModalContent,
            {windowClass: 'clean-house-modals', backdrop: 'static'})
            .result.then((result) => {
            if (result) {
                // console.log(result);
                that.editCurrentKYCDocument(document, index);
            }
            else {
                // this.toastr.error('Canceled', '', , {
                // disableTimeOut: true,
                //     closeButton: true
                // });
            }
        }, (reason) => {
            // console.log(`Dismissed ${reason}`);
        });
    }

    public editCurrentKYCDocument(document, index) {
        const that = this;
        // console.log(document);
        // let currentDocument = {...document};
        document['documentTypeID'] = this.documentDescription['type'];
        document['documentDescription'] = this.documentDescription['description'];
        this.documentsService.updateKYCDetails(
            that.params['id'],
            document.documentID,
            document,
            function (data) {
                // console.log(that.KYCTable[index], that.documentDescription);
                // for (let j = 0; j < that.documentTypesList.length; j++) {
                //     if (that.documentDescription['type'] === that.documentTypesList[j]['documentTypeID']) {
                //         that.KYCTable[index]['documentType'] = that.documentTypesList[j]['documentTypeName'];
                //     }
                // }
                // that.KYCTable[index]['documentTypeID'] = that.documentDescription['type'];
                // that.KYCTable[index]['documentDescription'] = that.documentDescription['description'];
                switch (data.status) {
                    case 'warning':
                        that.toastr.warning(data.message, "Document update");
                        break;
                    case 'success':
                        that.toastr.success(data.message, "Document update");
                        break;
                }
                that.reloadMerchantData();
                that.getKYCList(() => {
                });
            },
            function (error) {
                that.toastr.error(error.message, 'Document don\'t saved', {
                    disableTimeOut: true,
                    closeButton: true
                });
            }
        );
    }

    public downloadCurrentKYCDocument(document) {
        const that = this;
        this.documentsService.downloadKYC(
            that.params['id'],
            document.documentID,
            {},
            function (url) {
                window.open(url['downloadUrl']);
            }
        );
    }

    public deleteCurrentKYCDocument(document) {
        if (!this.isDeleteDocumentInProgress) {
            const that = this;
            this.isDeleteDocumentInProgress = true;
            this.documentsService.deleteKYC(
                that.params['id'],
                document.documentID,
                {
                    concurrencyToken: document.concurrencyToken,
                    merchantID: that.params['id'],
                    documentID: document.documentID
                },
                function () {
                    that.reloadMerchantData();
                    that.getKYCList(() => {
                        that.isDeleteDocumentInProgress = false;
                    });
                    that.toastr.warning('Document is deleted', 'Delete document');
                },
                function (error) {
                    that.isDeleteDocumentInProgress = false;
                    if (error.error.errors) {
                        that.toastr.error(error.error.errors[0]['description'], 'Delete document', {
                            disableTimeOut: true,
                            closeButton: true
                        });
                    }
                    else {
                        that.toastr.error(error.message, 'Delete document', {
                            disableTimeOut: true,
                            closeButton: true
                        });
                    }
                }
            );
        }
    }

    public updateKYCNote() {
        this.toastr.error('Not implemented yet', 'KYC NOTE', {
            disableTimeOut: true,
            closeButton: true
        });
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
