import {Injectable} from "@angular/core";
import {RequestsService} from "../http-interceptors/requests.service";

export type SecurityLimitsType = {
    limitDate: string,
    collateral: number,
    creditCardJ5Blocks: number,
    concurrencyToken: string
};

export type ComissionRatesType = {
    rateDate: string,
    basicRate: number,
    installmentRate: number,
    concurrencyToken: string
};

export type KYCdetailsType = {
    kycNotes: string,
    concurrencyToken: string
};

export type MerchantType = {
    paymentGatewayID: number,
    businessDetails: {
        businessName: string,
        businessId: string,
        businessArea: string,
        businessPhone: string,
        webSite: string,
        businessType: string
    },
    personalDetails: {
        email: string,
        firstName: string,
        lastName: string,
        gender: string,
        cellPhone: string,
        nationalIdNumber: string,
        nationalIdNumberDate: string,
        birthDate: string
    },
    bankAccount: {
        bankNumber: string,
        branchNumber: string,
        bankAccountNumber: string
    },
    creditCardAccount: {
        cardNumber: string,
        cardExpiration: string,
        cardOwnerName: string,
        cardOwnerNationalId: string
    }
};

@Injectable()
export class MerchantApiService {
    constructor(private httpService: RequestsService) {
    }

    // public applySecurityLimits(merchantID: number, data: SecurityLimitsType) {
    //     return this.http.post(this.requestPrefix + `/${merchantID}/applySecurityLimits`, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public applySecurityLimits(merchantID, requestData, response) {
        this.httpService.post(
            `/merchant/${merchantID}/applySecurityLimits`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public applyCreditCardJ5Blocks(merchantID, requestData, response, onerror) {
        this.httpService.post(
            `/merchant/${merchantID}/applyCreditCardJ5Blocks`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (error) => {onerror(error)});
    }

    // public applyCommisionRates(merchantID: number, data: ComissionRatesType) {
    //     return this.http.post(this.requestPrefix + `/${merchantID}/applyCommissionRates`, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public applyCommisionRates(merchantID, requestData, response) {
        this.httpService.post(
            `/merchant/${merchantID}/applyCommissionRates`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (error) => {onerror(error)});
    }

    public addCreditCard(merchantID, requestData, response, onerror) {
        this.httpService.post(
            `/merchant/${merchantID}/addCreditCard`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (error) => {onerror(error)});
    }

    // public applyMerchant(merchantID: number, data: Object) {
    //     return this.http.post(this.requestPrefix + `/${merchantID}/resendinvitation`, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public resendInvitation(merchantID, requestData, response) {
        this.httpService.post(
            `/merchant/${merchantID}/resendinvitation`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }


    // public getMerchantsList() {
    //     return this.http.get(this.requestPrefix, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public getMerchantsList(requestUrl, response) {
        this.httpService.get(
            `/merchant`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }


    // public createMerchant(data: MerchantType) {
    //     return this.http.post(this.requestPrefix, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    // public createMerchant(data: Object): Observable<any> {
    //     return this.http.post(this.requestPrefix, data).pipe(
    //         map((data: any) => {
    //             return data;
    //         })
    //     );
    // }
    public createMerchant(requestData, response, error) {
        this.httpService.post(
            `/merchant`, requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

    // public updateMerchant(merchantID: number, data: MerchantType) {
    //     return this.http.put(this.requestPrefix + `/${merchantID}`, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    // public updateMerchant(merchantID, data: Object): Observable<any> {
    //     return this.http.put(this.requestPrefix + `/${merchantID}`, data).pipe(
    //         map((data: any) => {
    //             return data;
    //         })
    //     );
    // }
    public updateMerchant(merchantID, requestData, response, error) {
        this.httpService.put(
            `/merchant/${merchantID}`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

    public getMerchantByID(merchantID, response) {
        this.httpService.get(
            `/merchant/${merchantID}`,
            {},
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    // public getMerchantBusinessInfo(merchantID: number, take, skip): Observable<any> {
    //     return this.http.get(this.requestPrefix + `/${merchantID}/businessActivity?take=${take}&skip=${skip}`).pipe(
    //         map((data: any) => {
    //             return data;
    //         })
    //     );
    // }
    public getMerchantBusinessInfo(merchantID, requestUrl, response) {
        this.httpService.get(
            `/merchant/${merchantID}/businessActivity`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }


    // public lockMerchantAccount(merchantID: number, data: Object) {
    //     return this.http.post(this.requestPrefix + `/${merchantID}/lock`, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public lockMerchantAccount(merchantID, requestData, response) {
        this.httpService.post(
            `/merchant/${merchantID}/lock`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public unlockMerchantAccount(merchantID, requestData, response) {
        this.httpService.post(
            `/merchant/${merchantID}/unlock`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    // public approveKYCdetails(merchantID: number, data: KYCdetailsType) {
    //     return this.http.post(this.requestPrefix + `/${merchantID}/approveKYC`, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public approveKYC(merchantID, requestData, response, errorCallback) {
        this.httpService.post(
            `/merchant/${merchantID}/approveKyc`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (errorCallback(err)));
    }

    public recallKYC(merchantID, requestData, response) {
        this.httpService.post(
            `/merchant/${merchantID}/rejectKYC`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    // public resetMerchantPassword(merchantID: number, data: Object) {
    //     return this.http.post(this.requestPrefix + `/${merchantID}/resetPassword`, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public resetMerchantPassword(merchantID, requestData, response) {
        this.httpService.post(
            `/merchant/${merchantID}/resetPassword`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getMerchantsLookup(requestUrl, response) {
        this.httpService.get(
            `/merchant/merchantLookup`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }
}
