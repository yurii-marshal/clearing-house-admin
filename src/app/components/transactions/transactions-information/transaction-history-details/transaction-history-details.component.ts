import {Component, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from "../../../../router.animations";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {TransactionApiService} from "../../../../services/api/transaction-api.service";
import {RequestsService} from "../../../../services/http-interceptors/requests.service";
import {CustomDatepickerI18n, I18n} from "../../../../services/ngb-datepicker-i18n.service";

@Component({
    selector: 'app-transaction-history-details',
    templateUrl: './transaction-history-details.component.html',
    styleUrls: ['./transaction-history-details.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class TransactionHistoryDetailsComponent implements OnInit, OnDestroy {
    params: any;

    public historyProps: Object = {
        transactionID: null,
        merchantID: null,
        merchantName: '',
    };

    constructor(private currentRouter: ActivatedRoute,
                private requests: RequestsService,
                public transactionsService: TransactionApiService,
                public router: Router) {
    }

    ngOnInit() {
        const that = this;
        this.currentRouter.params.subscribe(params => {
            this.params = params;
            if (!params['id']) {
                this.router.navigate(['/transactions']);
            }
            else {
                that.transactionsService.getTransactionHistoryByID(params['id'], (data) => {
                    that.historyProps = data;
                    that.historyProps['requestBody'] = JSON.stringify(JSON.parse(that.historyProps['requestBody']),null,2);
                    that.historyProps['responseBody'] = JSON.stringify(JSON.parse(that.historyProps['responseBody']),null,2);
                    console.log(data);
                });
            }
        });
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    public backToTransactionInformation() {
        this.router.navigate(['/transactions', this.historyProps['transactionID']]);
    }
}