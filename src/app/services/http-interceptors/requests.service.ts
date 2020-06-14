import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../app-settings";
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {TransitionsService} from "../transitions.service";

@Injectable()
export class RequestsService {
    currentRequests: Array<any> = [];
    requestLoadProgressCounter = 0;

    constructor(private http: HttpClient,
                private toastr: ToastrService,
                public oidcSecurityService: OidcSecurityService,
                public router: Router,
                public transitionService: TransitionsService) {
    }

    public get(suffix, params, responseCallback, completeCallback, errorCallback) {
        this.requestLoadProgressCounter++;
        setTimeout( () => {
            this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
        }, 500);
        
        this.http.get(
            AppSettings.BASE_URL + suffix + this.handleRequestUrlProps(params)
        ).subscribe(
            (data) => {
                // console.log(data);
                this.requestLoadProgressCounter--;
                setTimeout( () => {
                    this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
                }, 500);
                // console.log(this.requestLoadProgressCounter);
                responseCallback(data);
            },
            err => {
                this.requestLoadProgressCounter--;
                setTimeout( () => {
                    this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
                }, 500);
                // console.log(this.requestLoadProgressCounter);
                this.errorHandler(err);
                errorCallback(err);
            },
            () => {
                completeCallback();
            }
        );
    }

    public post(suffix, requestBody, responseCallback, completeCallback, errorCallback) {
        this.requestLoadProgressCounter++;
        setTimeout( () => {
            this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
        }, 500);

        this.http.post(AppSettings.BASE_URL + suffix, requestBody)
            .subscribe(
                (data) => {
                    this.requestLoadProgressCounter--;
                    setTimeout( () => {
                        this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
                    }, 500);
                    // console.log(this.requestLoadProgressCounter);
                    responseCallback(data);
                },
                err => {
                    this.requestLoadProgressCounter--;
                    setTimeout( () => {
                        this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
                    }, 500);
                    // console.log(this.requestLoadProgressCounter);
                    this.errorHandler(err);
                    errorCallback(err)
                },
                () => {
                    completeCallback();
                }
            );
    }

    public put(suffix, requestBody, responseCallback, completeCallback, errorCallback) {
        this.requestLoadProgressCounter++;
        setTimeout( () => {
            this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
        }, 500);

        this.http.put(AppSettings.BASE_URL + suffix, requestBody)
            .subscribe(
                (data) => {
                    this.requestLoadProgressCounter--;
                    setTimeout( () => {
                        this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
                    }, 500);
                    // console.log(this.requestLoadProgressCounter);
                    responseCallback(data);
                },
                err => {
                    this.requestLoadProgressCounter--;
                    setTimeout( () => {
                        this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
                    }, 500);
                    // console.log(this.requestLoadProgressCounter);
                    this.errorHandler(err);
                    errorCallback(err)
                },
                () => {
                    completeCallback();
                }
            );
    }

    public patch(suffix, requestBody, responseCallback, completeCallback, errorCallback) {
        this.requestLoadProgressCounter++;
        setTimeout( () => {
            this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
        }, 500);

        this.http.patch(AppSettings.BASE_URL + suffix, requestBody)
            .subscribe(
                (data) => {
                    this.requestLoadProgressCounter--;
                    setTimeout( () => {
                        this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
                    }, 500);
                    // console.log(this.requestLoadProgressCounter);
                    responseCallback(data);
                },
                err => {
                    this.requestLoadProgressCounter--;
                    setTimeout( () => {
                        this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
                    }, 500);
                    // console.log(this.requestLoadProgressCounter);
                    this.errorHandler(err);
                    errorCallback(err)
                },
                () => {
                    completeCallback();
                }
            );
    }

    public delete(suffix, params, responseCallback, completeCallback, errorCallback) {
        this.requestLoadProgressCounter++;
        setTimeout( () => {
            this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
        }, 500);

        this.http.delete(
            AppSettings.BASE_URL + suffix + this.handleRequestUrlProps(params)
        ).subscribe(
            (data) => {
                this.requestLoadProgressCounter--;
                setTimeout( () => {
                    this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
                }, 500);
                // console.log(this.requestLoadProgressCounter);
                responseCallback(data);
            },
            err => {
                this.requestLoadProgressCounter--;
                setTimeout( () => {
                    this.transitionService.transiteLoadingProgress(this.requestLoadProgressCounter > 0);
                }, 500);
                // console.log(this.requestLoadProgressCounter);
                this.errorHandler(err);
                errorCallback(err)
            },
            () => {
                completeCallback();
            }
        );
    }

    public unsubscribeRequests() {
        // const that = this;
        // setTimeout(function () {
        //     that.currentRequests.forEach(function (item) {
        //         item.unsubscribe();
        //     });
        //     that.currentRequests = [];
        // }, 1000);

    }

    private errorHandler(error) {
        console.log('ERROR: ', error.status, error.statusText, error);
        // this.transitionService.transiteLoadingProgress(false);
        if (error.status === 403) {
            this.oidcSecurityService.logoff();
            this.router.navigateByUrl('/login');
        }
        if (error.status === 401) {
            window.location.reload();
        }
        if (error.status === 500) {
            this.toastr.error(error.status + ' ' + error.statusText,
                'System Error', {
                    disableTimeOut: true,
                    closeButton: true
                });
        }
        // if (error.status === 400) {
        //     this.toastr.error(error.status + ' ' + error.statusText,
        //         'Data Error', {
        //             disableTimeOut: true,
        //             closeButton: true
        //         });
        // }
    }

    private handleRequestUrlProps(obj: Object): string {
        let str = '';
        for (let prop in obj) {
            if (!obj.hasOwnProperty(prop)) continue;
            if (obj[prop] === '') continue;
            if (prop === 'order') {
                if (obj[prop] !== undefined) {
                    str += '&' + (obj[prop]['order'] === 'ASC' ? 'orderBy' : 'orderByDesc') + "=" + obj[prop]['prop'];
                }
                continue;
            }
            if (prop === 'status') {
                for (let status in obj[prop]) {
                    if (!obj[prop].hasOwnProperty(status)) continue;
                    if (obj[prop][status] === true) str += '&status=' + status;
                }
                continue;
            }
            if (prop === 'filterGroup') {
                for (let filter in obj[prop]) {
                    if (!obj[prop].hasOwnProperty(filter)) continue;
                    if (obj[prop][filter]) str += `&${filter}=` + obj[prop][filter];
                }
                continue;
            }
            str += '&' + prop + "=" + obj[prop];
        }
        if (str.length > 0) {
            str = str.slice(1, str.length);
            str = '?' + str;
        }
        return str;
    }
}