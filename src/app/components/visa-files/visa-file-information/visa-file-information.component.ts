import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {routerTransition} from '../../../router.animations';
import {NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {FiltersService} from "../../../services/filters.service";
import {DictionariesService} from "../../../services/api/dictionaries-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestsService} from "../../../services/http-interceptors/requests.service";
import {LocalstorageService} from "../../../services/localstorage.service";
import {AdvancedYScrollService} from "../../../services/advanced-y-scroll.service";
import {TransitionsService} from "../../../services/transitions.service";
import {ToastrService} from "ngx-toastr";
import {HttpClient} from "@angular/common/http";
import {UserApiService} from "../../../services/api/user-api.service";
import {VisaFileApiService} from "../../../services/api/visafile-api.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MerchantApiService} from "../../../services/api/merchant-api.service";

export interface orderBy {
    date: string;
    transactionID: string;
    customerName: string;
    paymentGateway: string;
    status: string;
    currency: string;
    amount: string;
}

export class visaFilesDetailsFilter {
    processingFailed: boolean;
}

@Component({
    selector: 'app-visa-file-information',
    templateUrl: './visa-file-information.component.html',
    styleUrls: ['./visa-file-information.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig]
})
export class VisaFileInformationComponent implements OnInit, OnDestroy {
    @ViewChild('fileVisa') fileVisa;
    exp: boolean = true;
    public isUploadingInProgress: boolean = false;

    public merchant: any;
    public visaDetailsList: any;
    public processingFailedFilter: Array<Object>;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    public visafileName: string;

    public filterGroup: visaFilesDetailsFilter = {
        processingFailed: null
    };

    chargeBacksStatusFilter: any;
    tableVisaDetailsFilter: any;
    tableVisaDetailsColumns: any;
    currentOrderBy: Object;

    isColumnsFilterEmpty = true;

    params: any;

    placementPosition: string;

    public toggleFilterSection: boolean = false;

    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    public newTransaction: any;
    public merchantsList: any;

    constructor(config: NgbDropdownConfig,
                private http: HttpClient,
                public requests: RequestsService,
                private localstorageService: LocalstorageService,
                public transitions: TransitionsService,
                public dictionaryService: DictionariesService,
                public filtersService: FiltersService,
                public router: Router,
                public userService: UserApiService,
                public toastr: ToastrService,
                private currentRouter: ActivatedRoute,
                public advancedScrollService: AdvancedYScrollService,
                public visaFileApiService: VisaFileApiService,
                private modalService: NgbModal,
                public merchantsService: MerchantApiService,
                private _eref: ElementRef) {
        // this.transactionsDictionary = dictionariesApi.dictionaries['transactionStatuses'];
        config.placement = 'bottom-right';
        config.autoClose = "outside";
        this.selectConfig = config;
    }

    ngOnInit() {
        const that = this;
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        this.currentRouter.params.subscribe(params => {
            this.params = params;
            if (!params['id']) {
                this.router.navigate(['/visa-files']);
            }
            else {
                // this.userService.getVisaDetails(params['id'], (data) => {
                //     console.log(data);
                //     this.visaDetailsList = data.data;
                //     this.collectionSize = data.numberOfRecords;
                // });
            }
        });
        this.processingFailedFilter = [
            {
                code: 'true',
                description: 'Yes'
            },
            {
                code: 'false',
                description: 'No'
            }
        ];
        this.transitions.currentRTLToggle.subscribe((data) => {
            this.placementPosition = data === false ? 'left-top' : 'right-top';
        });
        this.merchant = this.localstorageService.read('merchant') || {};
        if (this.localstorageService.read('tableVisaDetailsFilter') != null) {
            this.filterGroup = this.localstorageService.read('tableVisaDetailsFilter');
            this.toggleFilterSection = true;
        } else this.initFilterGroup();
        this.localstorageService.read('tableVisaDetailsColumns') ?
            this.tableVisaDetailsColumns = this.localstorageService.read('tableVisaDetailsColumns') :
            this.tableVisaDetailsColumns = {
                accountNumber: {
                    title: "Account Number",
                    checkbox: true,
                },
                accountNumber2: {
                    title: "Account Number 2",
                    checkbox: true,
                },
                actionType: {
                    title: "Action type",
                    checkbox: true,
                },
                additionalPaymentAmount: {
                    title: "Additional Payment Amount",
                    checkbox: true,
                },
                bankDate: {
                    title: "Bank Date",
                    checkbox: true,
                },
                cancelAmount: {
                    title: "Cancel Amount",
                    checkbox: true,
                },
                cardDigits: {
                    title: "Card Digits",
                    checkbox: true,
                },
                cashbankAmount: {
                    title: "Cashbank Amount",
                    checkbox: true,
                },
                clearingHouseTransactionType: {
                    title: "Clearing House Transaction Type",
                    checkbox: true,
                },
                commission: {
                    title: "Commission",
                    checkbox: true,
                },
                currentInstallment: {
                    title: "Current Installment",
                    checkbox: true,
                },
                dealNature: {
                    title: "Deal Nature",
                    checkbox: true,
                },
                dealReference: {
                    title: "Deal Reference",
                    checkbox: true,
                },
                dealType: {
                    title: "Deal Type",
                    checkbox: true,
                },
                discountAmount: {
                    title: "Discount Amount",
                    checkbox: true,
                },
                initialPaymentAmount: {
                    title: "Initial Payment Amount",
                    checkbox: true,
                },
                installmentsAmount: {
                    title: "Installments Amount",
                    checkbox: true,
                },
                installmentsAmountRemaining: {
                    title: "Installments Amount Remaining",
                    checkbox: true,
                },
                installmentsCount: {
                    title: "Installments Count",
                    checkbox: true,
                },
                installmentsIndicator: {
                    title: "Installments Indicator",
                    checkbox: true,
                },
                interestAmount: {
                    title: "Interest Amount",
                    checkbox: true,
                },
                isForced: {
                    title: "Is Forced",
                    checkbox: true,
                },
                isFundTransferred: {
                    title: "Is Fund Transferred",
                    checkbox: true,
                },
                isTourist: {
                    title: "Is Tourist",
                    checkbox: true,
                },
                merchantNumber: {
                    title: "Merchant Number",
                    checkbox: true,
                },
                netAmount: {
                    title: "Net Amount",
                    checkbox: true,
                },
                parseError: {
                    title: "Parse Error",
                    checkbox: true,
                },
                processingFailed: {
                    title: "Processing Failed",
                    checkbox: true,
                },
                processingResult: {
                    title: "Processing Result",
                    checkbox: true,
                },
                recordStatus: {
                    title: "Record Status",
                    checkbox: true,
                },
                refundAmount: {
                    title: "Refund Amount",
                    checkbox: true,
                },
                serviceCharge: {
                    title: "Service Charge",
                    checkbox: true,
                },
                shvaDealID: {
                    title: "Shva Deal ID",
                    checkbox: true,
                },
                shvaShovarNumber: {
                    title: "Shva Shovar Number",
                    checkbox: true,
                },
                shvaTransactionType: {
                    title: "Shva Transaction Type",
                    checkbox: true,
                },
                shvaTransmissionNumber: {
                    title: "Shva Transmission Number",
                    checkbox: true,
                },
                statusEnum: {
                    title: "Status Enum",
                    checkbox: true,
                },
                stopAmount: {
                    title: "Stop Amount",
                    checkbox: true,
                },
                terminalNumber: {
                    title: "Terminal Number",
                    checkbox: true,
                },
                tourist: {
                    title: "Tourist",
                    checkbox: true,
                },
                transactionID: {
                    title: "Transaction ID",
                    checkbox: true,
                },
                transactionSource: {
                    title: "Transaction Source",
                    checkbox: true,
                },
                transactionType: {
                    title: "Transaction Type",
                    checkbox: true,
                },
                transmissionDate: {
                    title: "Transmission Date",
                    checkbox: true,
                },
                vat: {
                    title: "VAT",
                    checkbox: true,
                },
                visaConfirmationFileRowID: {
                    title: "Visa Confirmation File Row ID",
                    checkbox: true,
                },
                visaTransactionDate: {
                    title: "Visa Transaction Date",
                    checkbox: true,
                },
                visaTransactionID: {
                    title: "Visa Transaction ID",
                    checkbox: true,
                },
                visaTransactionID2: {
                    title: "Visa Transaction ID 2",
                    checkbox: true,
                },

            };
        this.getList(0);
        this.dictionaryService.getDictionaries(function (convertedDTO) {
            that.chargeBacksStatusFilter = convertedDTO['kycStatuses'];
        });
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
        this.localstorageService.write('tableVisaDetailsColumns', this.tableVisaDetailsColumns);
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.tableVisaDetailsColumns) {
            if (this.tableVisaDetailsColumns[item]['checkbox'] === false) {
                this.isColumnsFilterEmpty = false;
                break;
            }
        }
    }

    public getList(skip) {
        this.visaFileApiService.getVisaDetails(this.params['id'],
            {
                take: this.pageSize,
                skip: skip,
                order: this.currentOrderBy,
                filterGroup: this.filterGroup
            },
            (data) => {
                console.log(data);
                this.visafileName = data.fileName;
                this.visaDetailsList = data.data;
                this.collectionSize = data.numberOfRecords;
            });
    }

    public initFilterGroup() {
        this.filterGroup = {
            processingFailed: null
        };
        this.acceptFilters();
    }

    public pageChange() {
        this.getList(this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0);
    }

    public refreshPage() {
        this.visaDetailsList = [];
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
        this.localstorageService.write('tableVisaDetailsFilter', this.filterGroup);
        if (this.page === 1) {
            console.log("page: " + this.page);
            this.pageChange(); 
        }
        else
        {
            this.page = 1;
            this.pageChange(); 
        }
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


    private createNewTransaction(createTransactionModalContent, visaConfirmationFileID, visaConfirmationFileRowID){
        const that = this;
        this.modalService.open(createTransactionModalContent, {windowClass: 'clean-house-modals', backdrop: 'static'})
        .result.then((result) => {
            if (result !== null) {
                this.visaFileApiService.createTransaction(visaConfirmationFileID, visaConfirmationFileRowID,
                    {
                        merchantID: this.newTransaction.merchantID
                    },
                    function (data) {
                        that.toastr.success('New transaction created successfully', 'Create Transaction');
                        that.transitionToTransaction(data.entityID);
                    },
                    function (err) {
                        if (err.error.message) {
                            that.toastr.error(err.error.message, 'Create Transaction', {
                                disableTimeOut: true,
                                closeButton: true
                            });
                        }
                    }
                );
            }
            else {
                
            }
        }, (reason) => {
            
        });
    }

    public openNewTransactionModal(createTransactionModalContent, visaConfirmationFileID, visaConfirmationFileRowID) {
        const that = this;
        this.newTransaction = {
            merchantID: null,
        };
        this.merchantsService.getMerchantsLookup(
            {
                
            },
            (data) => {
                that.merchantsList = data;

                that.visaFileApiService.getNewTransaction(visaConfirmationFileID, visaConfirmationFileRowID, {},
                    function (data) {
                        that.newTransaction = data;
                        that.createNewTransaction(createTransactionModalContent, visaConfirmationFileID, visaConfirmationFileRowID);
                    },
                    function (err) {
                        if (err.error.message) {
                            that.toastr.error(err.error.message, 'Create Transaction', {
                                disableTimeOut: true,
                                closeButton: true
                            });
                        }
                    }
                );

                

            });

        
    }

    public transitionToTransaction(transactionID: number) {
        if(transactionID){
            this.router.navigate(['/transactions', transactionID]);
        }
    }
}
