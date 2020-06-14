import {Component, OnInit} from '@angular/core';
import {routerTransition} from "../../../router.animations";
import {ActivatedRoute, Router} from "@angular/router";
import {TransactionApiService} from "../../../services/api/transaction-api.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from 'ngx-toastr';
import {DictionariesService} from "../../../services/api/dictionaries-api.service";
import {RequestsService} from "../../../services/http-interceptors/requests.service";
import {ChargebackApiService} from "../../../services/api/chargeback-api.service";
import {UserApiService} from "../../../services/api/user-api.service";
import {AdvancedYScrollService} from "../../../services/advanced-y-scroll.service";

@Component({
    selector: 'app-transactions-information',
    templateUrl: './transactions-information.component.html',
    styleUrls: ['./transactions-information.component.scss'],
    animations: [routerTransition()]
})
export class TransactionsInformationComponent implements OnInit {
    params: any;
    closeResult: string;
    chargeBackOperationList: any;
    currentTransactionStatus: string;
    public isAdminRoleBilling: boolean = false;
    public rejectionReason: string = '';
    newChargeback: Object = {
        selectedChargeBackOperation: '',
        chargebackAmount: '',
        chargebackDescription: '',
    };

    newReject: Object = {
        rejectionReason: null,
    };

    public transaction: Object = {
        additionalPaymentsAmount: null,
        basicCommission: null,
        concurrencyToken: "",
        currency: "",
        history: [],
        initialPaymentAmount: null,
        installmentCommission: null,
        merchant: {
            activityStartDate: "",
            businessArea: null,
            businessId: "",
            kycApprovalStatus: "",
            merchantID: null,
            merchantName: "",
            merchantReference: "",
            phone: "",
            riskRate: 5
        },
        merchantAmmount: null,
        paymentGateway: null,
        paymentGatewayAdditionalDetails: {
            shvaShovarNumber: null,
            shvaShovarData: null
        },
        paymentGatewayTransactionDetails: {
            consumerEmail: "",
            consumerPhone: "",
            creditCardVendor: "",
            dealDescription: "",
            dealReference: "",
            merchantReference: "",
            terminalReference: "",
            transactionDate: ""
        },
        payments: null,
        status: "",
        totalAmount: null,
        totalCommission: null,
        transactionDate: "",
        transactionID: null
    };

    constructor(private currentRouter: ActivatedRoute,
                private toastr: ToastrService,
                private requests: RequestsService,
                private modalService: NgbModal,
                private dictionaryService: DictionariesService,
                public chargebackService: ChargebackApiService,
                public transactionsApi: TransactionApiService,
                public userService: UserApiService,
                public advancedScrollService: AdvancedYScrollService,
                public router: Router) {
    }

    ngOnInit() {
        const that = this;
        this.userService.getUserData(function () {
            console.log(that.userService.userData);
            that.isAdminRoleBilling = that.userService.userData['isBillingAdmin'];
        }, () => {
        });
        this.currentRouter.params.subscribe(params => {
            this.params = params;
            if (!params['id']) {
                this.router.navigate(['/transactions']);
            }
            else {
                that.getData();
            }
        });
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    public getData() {
        const that = this;
        // console.log(this.params['id']);
        // this.transactionsApi.getTransactionByID(this.params['id'], (data) => {
        //     console.log('getTransactionByID', data);
        //     that.transaction = data;
            // if (data.data.length > 0) this.advancedScrollService.initAdvancedHorizontalScroll();
        // });
        that.transactionsApi.getTransactionByID(this.params['id'], (data) => {
            that.transaction = data;
            that.dictionaryService.getDictionaries(function () {
                that.chargeBackOperationList = that.dictionaryService.dictionaries['chargebackTypes'];
                const statuses = that.dictionaryService.dictionaries['transactionStatuses'];
                const reasons = that.dictionaryService.dictionaries['rejectionReasons'];
                for (let i = 0; i < statuses.length; i++) {
                    if (statuses[i].code === data.status) {
                        that.currentTransactionStatus = statuses[i].description;
                    }
                }
                for (let i = 0; i < reasons.length; i++) {
                    if (reasons[i].code === data.rejectionReason) {
                        that.rejectionReason = reasons[i].description;
                    }
                }
            });
        });
    }

    public transitionToHistoryDetails(data) {
        this.router.navigate(['/transaction-history-details', data['transactionHistoryID']]);
    }

    public openChargeBackModal(ChargeBackModalContent) {
        const that = this;
        this.newChargeback = {
            selectedChargeBackOperation: null,
            chargebackAmount: this.transaction['totalAmount'],
            chargebackDescription: '',
        };
        this.modalService.open(ChargeBackModalContent, {windowClass: 'clean-house-modals', backdrop: 'static'})
            .result.then((result) => {
            if (result !== null) {
                this.chargebackService.createChargeback(
                    {
                        transactionID: this.transaction['transactionID'],
                        chargebackType: this.newChargeback['selectedChargeBackOperation'],
                        chargebackAmount: Number(this.newChargeback['chargebackAmount']),
                        chargebackDescription: this.newChargeback['chargebackDescription'],
                        concurrencyToken: this.transaction['concurrencyToken']
                    },
                    function () {
                        that.toastr.success('New chargeback is created successfully', 'Create Chargeback');
                    },
                    function (err) {
                        if (err.error.message) {
                            that.toastr.error(err.error.message, 'Create Chargeback', {
                                disableTimeOut: true,
                                closeButton: true
                            });
                        }
                    }
                );
            }
            else {
                // this.toastr.error('Canceled', '', {
                //     disableTimeOut: true,
                //     closeButton: true
                // });
            }
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult);
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    public transitionToTransaction(transactionID: number) {
        this.router.navigate(['/transactions', transactionID]);
    }

    public openRejectModal(RejectModalContent) {
        const that = this;
        this.newReject = {
            rejectionReason: null,
            concurrencyToken: this.transaction['concurrencyToken']
        };
        this.modalService.open(RejectModalContent, {windowClass: 'clean-house-modals', backdrop: 'static'})
            .result.then((result) => {
            if (result !== null) {
                this.transactionsApi.rejectTransaction(
                    
                        this.transaction['transactionID'],
                        this.newReject
                    ,
                    function () {
                        that.toastr.success('Transaction rejected successfully', 'Reject Transaction');
                        that.getData();
                    },
                    function (err) {
                        if (err.error.message) {
                            that.toastr.error(err.error.message, 'Reject Transaction', {
                                disableTimeOut: true,
                                closeButton: true
                            });
                        }
                    }
                );
            }
            else {
                // this.toastr.error('Canceled', '', {
                //     disableTimeOut: true,
                //     closeButton: true
                // });
            }
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult);
        });
    }

    public openUndoRejectModal(RejectModalContent) {
        const that = this;
        this.newReject = {
            undoRejectionReason: null,
            concurrencyToken: this.transaction['concurrencyToken']
        };
        this.modalService.open(RejectModalContent, {windowClass: 'clean-house-modals', backdrop: 'static'})
            .result.then((result) => {
            if (result !== null) {
                this.transactionsApi.undoRejectTransaction(
                    
                        this.transaction['transactionID'],
                        this.newReject
                    ,
                    function () {
                        that.toastr.success('Transaction reject undone successfully', 'Undo Reject Transaction');
                        that.getData();
                    },
                    function (err) {
                        if (err.error.message) {
                            that.toastr.error(err.error.message, 'Undo Reject Transaction', {
                                disableTimeOut: true,
                                closeButton: true
                            });
                        }
                    }
                );
            }
            else {
                // this.toastr.error('Canceled', '', {
                //     disableTimeOut: true,
                //     closeButton: true
                // });
            }
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log(this.closeResult);
        });
    }

    public hold(){
        const that = this;
        this.transactionsApi.holdTransaction(
                    
            this.transaction['transactionID'],
            {concurrencyToken: this.transaction['concurrencyToken']}
        ,
        function () {
            that.toastr.success('Transaction holded successfully', 'Hold Transaction');
            that.getData();
        },
        function (err) {
            if (err.error.message) {
                that.toastr.error(err.error.message, 'Hold Transaction', {
                    disableTimeOut: true,
                    closeButton: true
                });
            }
        }
        );
    }

    public unhold(){
        const that = this;
        this.transactionsApi.unHoldTransaction(
                    
            this.transaction['transactionID'],
            {concurrencyToken: this.transaction['concurrencyToken']}
        ,
        function () {
            that.toastr.success('Transaction unholded successfully', 'Unhold Transaction');
            that.getData();
        },
        function (err) {
            if (err.error.message) {
                that.toastr.error(err.error.message, 'Unhold Transaction', {
                    disableTimeOut: true,
                    closeButton: true
                });
            }
        }
        );
    }
}