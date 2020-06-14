import {Injectable} from "@angular/core";
import {RequestsService} from "../http-interceptors/requests.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators/map";
import {Observable} from "rxjs/Observable";
import {environment} from "../../../environments/environment.uat";
import {AppSettings} from "../../app-settings";
import {ErrorObservable} from "rxjs/observable/ErrorObservable";
import {catchError} from "rxjs/operators";
import {pipe} from "rxjs/Rx";

@Injectable()
export class VisaFileApiService {
    public userData: Object;

    constructor(public httpService: RequestsService,
                private httpClient: HttpClient) {
    }

    public getVisaList(params, response) {
        this.httpService.get(
            `/visafile`,
            params,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getVisaDetails(visaID, params, response) {
        this.httpService.get(
            `/visaFile/${visaID}`,
            params,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public getNewTransaction(visaID, rowId, params, response, error) {
        this.httpService.get(
            `/visaFile/${visaID}/${rowId}/getNewTransactionPreview`,
            params,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
        }

    public createTransaction(visaID, rowId, requestData, response, error) {
        this.httpService.post(
            `/visaFile/${visaID}/${rowId}/createNewTransaction`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }


}
