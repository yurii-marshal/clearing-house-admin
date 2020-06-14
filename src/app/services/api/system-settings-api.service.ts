import {Injectable} from '@angular/core';
import {RequestsService} from "../http-interceptors/requests.service";

@Injectable()
export class SystemSettingsApiService {

    constructor(private httpService: RequestsService) {
    }

    public getSystemSettings(requestUrl, response) {
        this.httpService.get(
            `/systemSettings`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public saveSystemSettings(requestData, response, error) {
        this.httpService.post(
            `/systemSettings`, requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

    public getCreditCardVendorRates(requestUrl, response) {
        this.httpService.get(
            `/systemSettings/creditCardVendorRates`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public saveCreditCardVendorRates(requestData, response, error) {
        this.httpService.post(
            `/systemSettings/creditCardVendorRates`, requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

    public getClearingCompany(requestUrl, response) {
        this.httpService.get(
            `/systemSettings/clearingCompany`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public saveClearingCompany(requestData, response, error) {
        this.httpService.post(
            `/systemSettings/clearingCompany`, requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

}
