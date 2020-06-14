import {Component, KeyValueDiffers, OnInit, ViewChild} from '@angular/core';
import {CustomDatepickerI18n, I18n} from '../../services/ngb-datepicker-i18n.service';
import {NgbDatepickerI18n, NgbDateStruct, NgbDropdownConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {routerTransition} from '../../router.animations';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {RequestsService} from '../../services/http-interceptors/requests.service';
import {MerchantApiService} from '../../services/api/merchant-api.service';
import {UserApiService} from '../../services/api/user-api.service';
import {ReportsApiService} from '../../services/api/reports-api.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {FiltersService} from '../../services/filters.service';
import {LocalstorageService} from '../../services/localstorage.service';
import {TransitionsService} from '../../services/transitions.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {DictionariesService} from '../../services/api/dictionaries-api.service';
import {DocumentApiService} from '../../services/api/document-api.service';
import {SystemSettingsApiService} from '../../services/api/system-settings-api.service';
// import {Observable} from 'rxjs/Observable';
// import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {NewRateDialogComponent} from './new-rate-dialog.component';
import {FormControl, Validators} from '@angular/forms';

export interface orderBy {
    defaultBasicComissionRate?: string;
    defaultInstallmentComissionRate?: string;
    defaultTouristComissionRate?: string;
    creditCardVendor?: string;
    currencyToken?: string;
}

@Component({
    selector: 'app-system-settings',
    templateUrl: './system-settings.component.html',
    styleUrls: ['./system-settings.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class SystemSettingsComponent implements OnInit {


    @ViewChild('financialForm') financialForm;


    public isAdminRoleBilling: boolean = false;
    public businessTable: Array<Object>;
    public defaultBillingCycleItems: Array<Object>;
    public cardBins: Array<Object>

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
    public selectedTransferCycle: any;
    public date: { year: number, month: number };

    changeRateData: Object = {
        basicRate: null,
        installmentRate: null,
    };

    changeClearingCompanyData: Object = {
        clearingCompanyID: null,
        clearingCompanyName: null,
        isCardOwnerNationalIdRequired: null,
        vatRate: null,
        commissionRate: null
    }

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


    merchantPeriodFilter: any;
    merchantStatusFilter: any;
    businessTableFilters: any;
    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    public placementPosition: string;


    genderList: any;

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


    isColumnsFilterEmpty = true;

    params: any;

    clearingCompanies: Array<Object>;
    isClearingCompanyNew: boolean = false;
    public validators = [this.ValidEmail];

    constructor(public dialog: MatDialog,
                public router: Router,
                public requests: RequestsService,
                public userService: UserApiService,
                private modalService: NgbModal,
                private filtersService: FiltersService,
                private toastr: ToastrService,
                private transitionsService: TransitionsService,
                private translate: TranslateService,
                config: NgbDropdownConfig,
                public dictionaryService: DictionariesService,
                public systemSettingsApiService: SystemSettingsApiService) {
        this.initMerchantData();
        config.placement = 'bottom-right';
        config.autoClose = "outside";
        this.selectConfig = config;
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.transitionsService.currentLang = event.lang;
        });

    }

    ngOnInit() {
        const that = this;
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        const tmpDate = new Date();
        this.expirationDateFrom = this.filtersService.setNgbDate(new Date(tmpDate.setDate(1)));
        this.expirationDateTo = this.filtersService.setNgbDate(new Date(tmpDate.setFullYear(tmpDate.getUTCFullYear() + 10)));
        this.transitionsService.currentRTLToggle.subscribe((data) => {
            this.placementPosition = data === false ? 'bottom-right' : 'bottom-left';
        });
        this.transitionsService.currentRTLToggle.subscribe(() => {
            that.isRTLToggle = true;
        });
        this.userService.getUserData(() => {
            this.isAdminRoleBilling = this.userService.userData['isBillingAdmin'];
        }, () => {
        });

        this.dictionaryService.getClearingCompanyList(function (data) {
            that.cardVendorItems = data;
        });

        this.dictionaryService.getDictionaries(function () {
            that.genderList = that.dictionaryService.dictionaries['genders'];
            that.businessTypes = that.dictionaryService.dictionaries['businessTypes'];
            that.riskLevelItems = that.dictionaryService.dictionaries['riskRates'];
            that.transferCycleItems = that.dictionaryService.dictionaries['schedulePeriodTypes'];
            that.defaultBillingCycleItems = that.dictionaryService.dictionaries['clearingCompanyConfirmationTypes'];
            that.cardBins = that.dictionaryService.dictionaries['solek'];
            that.dictionaryService.getPaymentGatewayList(function (data) {
                that.marketedByItems = data;
            });
        });
        this.additionalCHLabels = ['Upay'];
        this.additionalCHList = [{
            code: 'Upay',
            description: ''
        }];

        this.getSystemSettings();
        this.getClearingCompany();
        this.getCreditCardVendorRates();
    }

    private ValidEmail(control: FormControl) {
        console.log(1);
        control.setValidators(Validators.email);
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
    }

    public newRateDialog(): void {
        let dialogRef = this.dialog.open(NewRateDialogComponent, {
            width: '500px',
            data: {items: '[]'}
        });
    }


    public refreshPage() {
        this.getSystemSettings();
        this.getClearingCompany();
        this.getCreditCardVendorRates();
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
    }


    getCreditCardVendorRates() {
        const that = this;
        this.systemSettingsApiService.getCreditCardVendorRates({},
            function (data) {
                that.merchantData.commissionRates = data;
            });
    }


    public saveSystemSettings(isFormValid) {
        if (isFormValid) {
            const that = this;
            this.merchantData['defaultBillingCycle'] = {
                periodType: this.selectedTransferCycle,
                days: []
            };
            switch (this.selectedTransferCycle) {
                case 'week':
                    for (let i = 0; i < this.transferCycleWeekly.length; i++) {
                        if (this.transferCycleWeekly[i]['code']) this.merchantData['defaultBillingCycle']['days'].push(i);
                    }
                    break;
                case 'month':
                    for (let i = 0; i < this.transferCycleMonthly.length; i++) {
                        if (this.transferCycleMonthly[i]['code']) this.merchantData['defaultBillingCycle']['days'].push(i + 1);
                    }
                    break;
            }
            this.systemSettingsApiService.saveSystemSettings(that.merchantData,
                function (data) {
                    that.getSystemSettings();
                    that.toastr.success(data.message, 'Saved');
                }, function (error) {
                    if (error.error.errors && error.error.errors.length > 0) {
                        error.error.errors.forEach(function (item) {
                            if (item.description !== '')
                                that.toastr.error(item.description, 'Validation Error', {
                                    disableTimeOut: true,
                                    closeButton: true
                                });
                        });
                    } else {
                        that.toastr.error(error.error.message, 'Validation Error', {
                            disableTimeOut: true,
                            closeButton: true
                        });
                    }
                });

        }
    }

    public initMerchantData() {
        this.initTransferCycleItems();

        this.merchantData = {
            defaultCollateralSecurityLimit: null,
            defaultCreditCardJ5Blocks: null,
            poalimFileBankDetails: {
                institueName: null,
                instituteNumber: null,
                sendingInstitute: null,
            }
        };

    }


    public getSystemSettings() {
        const that = this;
        this.systemSettingsApiService.getSystemSettings(
            {},
            function (data) {
                let commissionRates;
                if (that.merchantData && that.merchantData.commissionRates) {
                    commissionRates = that.merchantData.commissionRates;
                }
                that.merchantData = data;
                if (commissionRates) {
                    that.merchantData.commissionRates = commissionRates;
                }


                if (that.merchantData['defaultBillingCycle']) {
                    that.selectedTransferCycle = that.merchantData['defaultBillingCycle']['periodType'];
                }
                if (that.merchantData.defaultBillingCycle) {
                    switch (that.selectedTransferCycle) {
                        case 'week':
                            for (let i = 0; i < that.merchantData['defaultBillingCycle']['days'].length; i++) {
                                that.transferCycleWeekly[that.merchantData['defaultBillingCycle']['days'][i]]['code'] = true;
                            }
                            break;
                        case 'month':
                            for (let i = 0; i < that.merchantData['defaultBillingCycle']['days'].length; i++) {
                                that.transferCycleMonthly[that.merchantData['defaultBillingCycle']['days'][i] - 1]['code'] = true;
                            }
                            break;
                    }
                }
            });
    }


    openChangeRateDialog(ChangeRateModalContent) {
        const that = this;
        this.changeRateData = {};
        this.modalService.open(
            ChangeRateModalContent,
            {windowClass: 'clean-house-modals', backdrop: 'static'})
            .result.then((result) => {
            if (Object.prototype.toString.call(result) === '[object Object]' && Object.keys(result).length > 0) {
                this.systemSettingsApiService.saveCreditCardVendorRates(
                    this.changeRateData, function () {
                        that.getCreditCardVendorRates();
                        that.toastr.success('Rate is changed successfully', 'Change Rate');
                    }, function (error) {
                        if (error.error.errors && error.error.errors.length > 0) {
                            error.error.errors.forEach(function (item) {
                                if (item.description !== '')
                                    that.toastr.error(item.description, 'Validation Error', {
                                        disableTimeOut: true,
                                        closeButton: true
                                    });
                            });
                        } else {
                            that.toastr.error(error.error.message, 'Validation Error', {
                                disableTimeOut: true,
                                closeButton: true
                            });
                        }
                    }
                );

            }
        }, (reason) => {
            // console.log(`Dismissed ${reason}`);
        });
    }


    public getClearingCompany() {
        const that = this;
        this.systemSettingsApiService.getClearingCompany({},
            function (res) {
                that.clearingCompanies = res;
            });
    }


    openClearingCompanyDialog(ClearingCompanyModalContent, model = null) {
        const that = this;
        if (model) {
            that.isClearingCompanyNew = false;
            this.changeClearingCompanyData = {...model};
            this.changeClearingCompanyData['vatRate'] = !isNaN(this.changeClearingCompanyData['vatRate']) ?
                this.changeClearingCompanyData['vatRate'] * 100 : this.changeClearingCompanyData['vatRate'];
            this.changeClearingCompanyData['commissionRate'] = !isNaN(this.changeClearingCompanyData['commissionRate']) ?
                this.changeClearingCompanyData['commissionRate'] * 100 : this.changeClearingCompanyData['commissionRate'];
        } else {
            that.isClearingCompanyNew = true;
            this.changeClearingCompanyData = {};
        }

        this.modalService.open(
            ClearingCompanyModalContent,
            {windowClass: 'clean-house-modals', backdrop: 'static'})
            .result.then((result) => {
            if (Object.prototype.toString.call(result) === '[object Object]' && Object.keys(result).length > 0) {
                this.systemSettingsApiService.saveClearingCompany(
                    this.changeClearingCompanyData, function () {
                        that.getClearingCompany();
                        if (that.isClearingCompanyNew) {
                            that.toastr.success('Clearing Company is created successfully', 'Created Clearing Company');
                        } else {
                            that.toastr.success('Clearing Company is changed successfully', 'Change Clearing Company');
                        }
                    }, function (error) {
                        if (error.error.errors && error.error.errors.length > 0) {
                            error.error.errors.forEach(function (item) {
                                if (item.description !== '')
                                    that.toastr.error(item.description, 'Validation Error', {
                                        disableTimeOut: true,
                                        closeButton: true
                                    });
                            });
                        } else {
                            that.toastr.error(error.error.message, 'Validation Error', {
                                disableTimeOut: true,
                                closeButton: true
                            });
                        }
                    }
                );
            }
        }, (reason) => {
            // console.log(`Dismissed ${reason}`);
        });
    }


}
