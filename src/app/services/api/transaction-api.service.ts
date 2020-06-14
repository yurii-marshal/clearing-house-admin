import {Injectable} from "@angular/core";
import {RequestsService} from "../http-interceptors/requests.service";

export type TransactionType = {
    paymentGatewayID: number,
    paymentGatewayTransactionDetails: {
        transactionDate: string,
        dealReference: string,
        terminalReference: string,
        merchantReference: string,
        dealDescription: string,
        creditCardVendor: string,
        consumerEmail: string,
        consumerPhone: string
    },
    paymentGatewayAdditionalDetails: {
        shvaShovarNumber: string,
        shvaShovarData: string
    },
    currency: string,
    additionalPaymentsAmount: number,
    initialPaymentAmount: number,
    payments: number,
    totalAmount: number,
    concurrencyToken: string
};

@Injectable()
export class TransactionApiService {
    constructor(public httpService: RequestsService) {
    }

    // public getTransactionByID(transactionID: number) {
    //     return this.http.get(this.requestPrefix + `/${transactionID}`, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public getTransactionByID(transactionID, response) {
        this.httpService.get(
            `/transaction/${transactionID}`,
            {},
            (data) => {response(data)},
            () => (null), () => (null));
    }
    public getTransactionHistoryByID(transactionHistoryID, response) {
        this.httpService.get(
            `/transaction/history/${transactionHistoryID}`,
            {},
            (data) => {response(data)},
            () => (null), () => (null));
    }

    // public commitTransaction(transactionID: number, data: TransactionType) {
    //     return this.http.put(this.requestPrefix + `/${transactionID}`, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public commitTransaction(transactionID, requestData, response) {
        this.httpService.put(
            `/transaction/${transactionID}`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    // public removeDocument(transactionID: number) {
    //     return this.http.delete(this.requestPrefix + `/${transactionID}`, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public removeDocument(transactionID, response) {
        this.httpService.delete(
            `/transaction/${transactionID}`,
            {},
            (data) => {response(data)},
            () => (null), () => (null));
    }


    // public getTransactionsList() {
    //     return this.http.get(this.requestPrefix, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public getTransactionsList(requestUrl, response) {
        this.httpService.get(
            `/transaction`, requestUrl,
            (data) => {response(data)},
            () => (null), () => (null));
    }

    public getTransactionsExcel(requestUrl, response) {
        this.httpService.get(
            `/transaction/excel`, requestUrl,
            (data) => {response(data)},
            () => (null), () => (null));
    }


    // public createTransaction(data: TransactionType) {
    //     return this.http.post(this.requestPrefix, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public createTransaction(requestData, response) {
        this.httpService.post(
            `/transaction`, requestData,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public rejectTransaction(transactionID, requestData, response, error) {
        this.httpService.post(
            `/transaction/${transactionID}/reject`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

    public undoRejectTransaction(transactionID, requestData, response, error) {
        this.httpService.post(
            `/transaction/${transactionID}/undoreject`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

    public holdTransaction(transactionID, requestData, response, error) {
        this.httpService.post(
            `/transaction/${transactionID}/hold`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

    public unHoldTransaction(transactionID, requestData, response, error) {
        this.httpService.post(
            `/transaction/${transactionID}/unhold`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

    public holdTransactions(requestData, response, error) {
        this.httpService.post(
            `/transaction/hold`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

    public unHoldTransactions(requestData, response, error) {
        this.httpService.post(
            `/transaction/unhold`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

}
