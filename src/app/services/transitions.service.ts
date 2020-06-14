import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {LocalstorageService} from "./localstorage.service";

@Injectable()
export class TransitionsService {
    merchant: Object = null;
    idUserForTransitions: number = null;
    tabForReport: number = null;
    RTLToggleEmitter = new BehaviorSubject<boolean>(true);
    PageChangeEmitter = new BehaviorSubject<boolean>(true);
    LoadingProgressEmitter = new BehaviorSubject<boolean>(false);
    loadingProgressTimer: any;
    currentRTLToggle = this.RTLToggleEmitter.asObservable();
    currentPageStatus = this.PageChangeEmitter.asObservable();
    currentLoadingProgress = this.LoadingProgressEmitter.asObservable();
    previousUrl: string = '';
    currentUrl: string = '';
    currentLang = 'he';

    constructor(router: Router,
                public localstorageService: LocalstorageService) {
        router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(e => {
                this.setPrevUrl(this.currentUrl);
                if (e) this.currentUrl = e['url'];
            });
    }

    private setPrevUrl(url: string) {
        this.localstorageService.write('previousUrl', url);
    }

    public transiteRTLToggle(data: boolean) {
        this.RTLToggleEmitter.next(data);
    }

    public transitePageChange(data: any) {
        this.PageChangeEmitter.next(data);
    }

    public transiteLoadingProgress(data: boolean) {
        // if (data === true) {
        //     this.loadingProgressTimer = setTimeout( () => {
        //         this.LoadingProgressEmitter.next(true);
        //     }, 500);
        // }
        // else {
        //     clearTimeout(this.loadingProgressTimer);
        //     this.LoadingProgressEmitter.next(false);
        // }
        this.LoadingProgressEmitter.next(data);
    }

    // public setMerchantData(data: Object) {
    //     this.merchant = data;
    // }
    //
    // public setUserForTransaction(id: number) {
    //     this.idUserForTransitions = id;
    // }
    //
    // public setUserForBusinessReports(id: number) {
    //     this.idUserForTransitions = id;
    // }
    //
    // public setUserForChargebackReports(id: number) {
    //     this.idUserForTransitions = id;
    // }
}