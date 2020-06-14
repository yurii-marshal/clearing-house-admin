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
export class UserApiService {
    public userData: Object;

    constructor(public httpService: RequestsService,
                private httpClient: HttpClient) {
    }

    public getUserData(response, completeCallback) {
        if(this.userData)
            return response(this.userData);

        const that = this;
        this.httpService.get(
            `/profile`,
            {},
            (data) => {
                that.userData = data;
                response(data);
            },
            () => (completeCallback), () => (null));
    }


    



    // public getUserData() {
    //     const params = {};
    //     return this.get('/profile', new HttpParams({fromObject: params}))
    //         .pipe(map(data => {
    //             // this.userData = data;
    //             return data;
    //         }));
    // }
    //
    // get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    //     return this.httpClient.get(`${AppSettings.BASE_URL}${path}`, {params})
    //         .pipe(map((data) => {
    //             this.errorCatcher(data);
    //             return data;
    //         }))
    //         .pipe(catchError(this.formatErrors));
    // }
    //
    // errorCatcher(data) {
    //     if (data['error'] && data['error']['code']) {
    // const findError = this.errorCodes.find(errorCode => data['error']['code'] === errorCode);
    // if (findError) {
    // this.router.navigateByUrl('/login');
    // return true;
    // } else {
    // this._toastr.error(data['error']['message'], null, { dismiss: 'auto', showCloseButton: true });
    // }
    //     }
    // }
    //
    // private formatErrors(error: any) {
    //     console.log(error, 'error!!!')
    //     return new ErrorObservable(error.error);
    // }
}
