import {Component, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from "../../../router.animations";
import {ActivatedRoute, Router} from "@angular/router";
import {ChargebackApiService} from "../../../services/api/chargeback-api.service";
import {RequestsService} from "../../../services/http-interceptors/requests.service";
import {orderBy} from "../../merchants/merchants-details/merchants-details.component";
import {AdvancedYScrollService} from "../../../services/advanced-y-scroll.service";
import {DictionariesService} from "../../../services/api/dictionaries-api.service";

@Component({
    selector: 'app-transactions-information',
    templateUrl: './chargebacks-information.component.html',
    styleUrls: ['./chargebacks-information.component.scss'],
    animations: [routerTransition()]
})
export class ChargebacksInformationComponent implements OnInit, OnDestroy {
    params: any;
    currentOrderBy: Object;
    public orderBy: orderBy = {} as any;
    public chargeback: Object = {
        chargebackID: 0,
        transactionID: 0,
        paymentGateway: "string",
        chargebackType: "fromNextBillingCycle",
        transactionDate: "2018-05-09T12:28:15.156Z",
        confirmedDate: "2018-05-09T12:28:15.157Z",
        chargedBackDate: "2018-05-09T12:28:15.157Z",
        chargedBackDoneDate: "2018-05-09T12:28:15.157Z",
        transactionTotalAmount: 0,
        chargebackAmount: 0,
        currency: "string",
        merchant: {
            merchantID: 0,
            merchantName: "string",
            merchantReference: "string",
            riskRate: 0,
            kycApprovalStatus: "initial",
            businessArea: "string",
            phone: "string",
            email: "string",
            businessId: "string",
            activityStartDate: "2018-05-09T12:28:15.157Z"
        },
        paymentGatewayTransactionDetails: {
            transactionDate: "2018-05-09T12:28:15.157Z",
            dealReference: "string",
            terminalReference: "string",
            merchantReference: "string",
            dealDescription: "string",
            creditCardVendor: "string",
            consumerEmail: "string",
            consumerPhone: "string",
            cardOwnerName: "string",
            cardDigits: "string",
            cardExpiration: "string",
            solic: "string",
            transactionType: "regular"
        },
        paymentGatewayAdditionalDetails: {
            shvaShovarNumber: "string",
            shvaShovarData: "string"
        },
        billingReportChargebackID: 0,
        billingReportID: 0,
        chargebackDescription: "string",
        installmentPaymentAmount: 0,
        initialPaymentAmount: 0,
        payments: 0,
        totalCommission: 0,
        installmentCommission: 0,
        basicCommission: 0,
        merchantAmmount: 0,
        history: [
            {
                transactionHistoryID: 0,
                transactionID: 0,
                operationDate: "2018-05-09T12:28:15.157Z",
                operationDoneBy: "string",
                operationDoneByID: "string",
                operationCode: "string",
                operationDescription: "string",
                additionalDetails: "string",
                correlationId: "string"
            }
        ]
    };

    constructor(currentRouter: ActivatedRoute,
                public chargebackService: ChargebackApiService,
                private requests: RequestsService,
                public advancedScrollService: AdvancedYScrollService,
                private dictionaryService: DictionariesService,
                public router: Router) {
        currentRouter.params.subscribe(params => {
            this.params = params;
            if (!params['id']) {
                this.router.navigate(['/transactions']);
            }
            else {
                this.chargebackService.getChargeBackByID(params['id'], (data) => {
                    // console.log('getTransactionByID', data);
                    this.chargeback = data;
                    // if (data.data.length > 0) this.advancedScrollService.initAdvancedHorizontalScroll();
                });
            }
        });
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
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
        // this.pageChange();
    }

    public transitionToTransaction(transactionID: number) {
        this.router.navigate(['/transactions', transactionID]);
    }
}
