import {Component, OnDestroy, OnInit} from '@angular/core';
import {routerTransition} from '../../../router.animations';
import {NgbDatepickerI18n, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {ReportsApiService} from "../../../services/api/reports-api.service";
import {TransitionsService} from "../../../services/transitions.service";
import {RequestsService} from "../../../services/http-interceptors/requests.service";
import {LocalstorageService} from "../../../services/localstorage.service";
import {CustomDatepickerI18n, I18n} from "../../../services/ngb-datepicker-i18n.service";

@Component({
    selector: 'app-activity-reports-details',
    templateUrl: './activity-reports-details.component.html',
    styleUrls: ['./activity-reports-details.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class ActivityReportsDetailsComponent implements OnInit, OnDestroy {
    params: any;
    prevState: string = '';

    public reportProps: Object = {
        merchantID: null,
        merchantName: "",

        correlationId: "",
        ipAddress: null,

        operationCode: "",
        operationDate: "",
        operationDescription: null,
        operationDoneBy: "",
        operationDoneByID: null,

        requestBody: null,
        requestDate: "",
        requestMethod: null,
        requestUrl: null,

        responseBody: null,
        responseStatus: null,

        transactionID: null,
        additionalDetails: null,
    };

    constructor(private currentRouter: ActivatedRoute,
                private requests: RequestsService,
                public reportsService: ReportsApiService,
                public localstorageService: LocalstorageService,
                public router: Router) {
    }

    ngOnInit() {
        const that = this;
        this.prevState = this.localstorageService.read('previousUrl') === '/reports' ? 'reports': 'merchant profile';
        this.currentRouter.params.subscribe(params => {
            this.params = params;
            if (!params['id']) {
                this.router.navigate(['/transactions']);
            }
            else {
                that.reportsService.getReportActivityDetails(params['id'], (data) => {
                    that.reportProps = data;
                    that.reportProps['requestBody'] = JSON.stringify(JSON.parse(that.reportProps['requestBody']),null,2);
                    that.reportProps['responseBody'] = JSON.stringify(JSON.parse(that.reportProps['responseBody']),null,2);
                });
            }
        });
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    public backToActivityReport() {
        console.log(this.prevState);
        if (this.prevState === 'reports') {
            this.router.navigate(['/reports']);
        }
        else {
            this.router.navigate(['/merchants', this.reportProps['merchantID']]);
        }
    }
}
