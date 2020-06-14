import {RequestsService} from "../http-interceptors/requests.service";
import {Injectable} from "@angular/core";

@Injectable()
export class ReportsApiService {
    constructor(private httpService: RequestsService) {
    }

    public getReportsTransactionList(prefix, requestUrl, response) {
        this.httpService.get(
            `/transactionsReport/${prefix}`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsTransactionExcel(prefix, requestUrl, response) {
        this.httpService.get(
            `/transactionsReport/${prefix}`,
            requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsActivityList(requestUrl, response) {
        this.httpService.get(
            `/businessActivity`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsActivityExcel(requestUrl, response) {
        this.httpService.get(
            `/businessActivity/excel`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsBillingList(requestUrl, response) {
        this.httpService.get(
            `/billingReport`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsChargebackList(requestUrl, response) {
        this.httpService.get(
            `/chargebackReport`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getChargebackOperationsList(chargebackReportID, requestUrl, response) {
        this.httpService.get(
            `/chargebackReport/${chargebackReportID}/chargebacks`,
            requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public setReportBillingPayed(billingReportID, requestBody, response) {
        this.httpService.post(
            `/billingReport/${billingReportID}/payed`, requestBody,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public setChargebackOperationPayed(chargebackReportID, requestBody, response) {
        this.httpService.post(
            `chargebackReport/${chargebackReportID}/payed`, requestBody,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsBillingExcel(requestUrl, response) {
        this.httpService.get(
            `/billingReport/excel`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsBillingBef(requestUrl, response, errorCallback) {
        this.httpService.get(
            `/billingReport/bankExchange`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), (error) => (errorCallback(error)));
    }

    public getReportsChargebackExcel(requestUrl, response) {
        this.httpService.get(
            `/chargebackReport/excel`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportsChargebackBef(requestUrl, response) {
        this.httpService.get(
            `/chargebackReport/bankExchange`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportBillingDetails(merchantId, requestUrl, response) {
        this.httpService.get(
            `/billingReport/${merchantId}/transactions`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportActivityDetails(merchantHistoryId, response) {
        this.httpService.get(
            `/businessActivity/${merchantHistoryId}`,
            {},
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getReportBillingDetailsExcel(billingReportID, requestUrl, response) {
        this.httpService.get(
            `/billingReport/${billingReportID}/transactionexcel`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }
}