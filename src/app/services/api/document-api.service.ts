import {Injectable} from "@angular/core";
import {RequestsService} from "../http-interceptors/requests.service";

export type DocumentType = {
    documentID: number,
    documentName: string,
    merchantID: number,
    status: string,
    documentDescription: string
};

@Injectable()
export class DocumentApiService {
    constructor(private httpService: RequestsService) {
    }

    // public removeDocument(merchantID: number, documentID: number) {
    //     return this.http.delete(this.requestPrefix + `/${merchantID}/${documentID}`, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public removeDocument(merchantID, documentID, response) {
        this.httpService.delete(
            `/document/${merchantID}/${documentID}`,
            {},
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    // public getDocumentsList(merchantID: number) {
    //     return this.http.get(this.requestPrefix + `/${merchantID}`, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public getDocumentsList(requestUrl, response) {
        this.httpService.get(
            `/document`,
            {},
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getDocumentsTypes(response) {
        this.httpService.get(
            `/document/documentTypes`,
            {},
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getMerchantKYCDocuments(merchantID, params, response) {
        this.httpService.get(
            `/document/${merchantID}`,
            params,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public rejectKYC(merchantID, documentID, requestData, response) {
        this.httpService.put(
            `/document/${merchantID}/${documentID}`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public approveKYC(merchantID, documentID, requestData, response) {
        this.httpService.put(
            `/document/${merchantID}/${documentID}`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public downloadKYC(merchantID, documentID, requestData, response) {
        this.httpService.get(
            `/document/${merchantID}/${documentID}`,
            {},
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public deleteKYC(merchantID, documentID, requestUrl, response, errorCallback) {
        this.httpService.delete(
            `/document/${merchantID}/${documentID}`,
            requestUrl,
            (data) => {
                response(data);
            },
            () => (null), (error) => (errorCallback(error)));
    }

    // public updateDocumentDetails(merchantID: number, data: DocumentType) {
    //     return this.http.put(this.requestPrefix + `/${merchantID}`, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public updateKYCDetails(merchantID, documentID, requestData, response, errorCallback) {
        this.httpService.put(
            `/document/${merchantID}/${documentID}`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => errorCallback(err));
    }

    // public uploadNewFile(merchantID: number, data: Object) {
    //     return this.http.post(this.requestPrefix + `/${merchantID}`, data, AppSettings.HttpOptions)
    //         .subscribe(response => this.response = JSON.stringify(response));
    // }
    public uploadNewFile(merchantID, requestData, response) {
        this.httpService.post(
            `/document/${merchantID}`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }
}
