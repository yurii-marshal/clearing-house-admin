import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";
import {FiltersService} from "../../services/filters.service";
import {DictionariesService} from "../../services/api/dictionaries-api.service";
import {Router} from "@angular/router";
import {RequestsService} from "../../services/http-interceptors/requests.service";
import {LocalstorageService} from "../../services/localstorage.service";
import {AdvancedYScrollService} from "../../services/advanced-y-scroll.service";
import {TransitionsService} from "../../services/transitions.service";
import {AppSettings} from "../../app-settings";
import {ToastrService} from "ngx-toastr";
import {HttpClient} from "@angular/common/http";
import {UserApiService} from "../../services/api/user-api.service";
import {VisaFileApiService} from "../../services/api/visafile-api.service";

export interface orderBy {
    visaConfirmationFileID: string;
    date: string;
    transactionID: string;
    customerName: string;
    paymentGateway: string;
    status: string;
    currency: string;
    amount: string;
}

export class visaFilesFilter {
    processingFailed: boolean;
}

@Component({
    selector: 'app-visa-files',
    templateUrl: './visa-files.component.html',
    styleUrls: ['./visa-files.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig]
})
export class VisaFilesComponent implements OnInit, OnDestroy {
    @ViewChild('fileVisa') fileVisa;
    exp: boolean = true;
    public isUploadingInProgress: boolean = false;

    public merchant: any;
    public visaList: any;
    public processingFailedFilter: Array<Object>;

    public tablePeriodFrom: any;
    public tablePeriodTo: any;
    public tablePeriodRestrict: any;

    public page = 1;
    public maxSize = 10;
    public collectionSize = 0;
    public pageSize = 10;

    public filterGroup: visaFilesFilter = {
        processingFailed: null
    };

    selectedChargeBacksPeriod: any;
    tableVisaListFilter: any;
    currentOrderBy: Object;

    placementPosition: string;

    isColumnsFilterEmpty = true;

    public toggleFilterSection: boolean = false;

    public selectConfig: any;
    public orderBy: orderBy = {} as any;

    constructor(config: NgbDropdownConfig,
                private http: HttpClient,
                public requests: RequestsService,
                private localstorageService: LocalstorageService,
                public transitions: TransitionsService,
                public dictionaryService: DictionariesService,
                public filtersService: FiltersService,
                public router: Router,
                public userService: UserApiService,
                public toastr: ToastrService,
                public advancedScrollService: AdvancedYScrollService,
                public visaFileApiService: VisaFileApiService,
                private _eref: ElementRef) {
        // this.transactionsDictionary = dictionariesApi.dictionaries['transactionStatuses'];
        config.placement = 'bottom-right';
        config.autoClose = "outside";
        this.selectConfig = config;
    }

    ngOnInit() {
        this.maxSize = (window.screen.width < 768) ? 4 : 10;
        this.processingFailedFilter = [
            {
                code: "true",
                description: 'Yes'
            },
            {
                code: "false",
                description: 'No'
            }
        ];
        this.transitions.currentRTLToggle.subscribe((data) => {
            this.placementPosition = data === false ? 'left-top' : 'right-top';
        });
        this.merchant = this.localstorageService.read('merchant') || {};
        if (this.localstorageService.read('visaFilesFilterGroup') != null) {
            this.filterGroup = this.localstorageService.read('visaFilesFilterGroup');
            this.toggleFilterSection = true;
        } else this.initFilterGroup();
        this.localstorageService.read('tableVisaListFilter') ?
            this.tableVisaListFilter = this.localstorageService.read('tableVisaListFilter') :
            this.tableVisaListFilter = {
                visaConfirmationFileID: {
                    title: "ID",
                    checkbox: true,
                },
                receivedDate: {
                    title: "Received Date",
                    checkbox: true,
                },
                fileName: {
                    title: "File Name",
                    checkbox: true,
                },
                uploadedBy: {
                    title: "Uploaded By",
                    checkbox: true,
                },
                processingFailed: {
                    title: "Processing Failed",
                    checkbox: true,
                }
            };
        this.tablePeriodRestrict = this.filtersService.setCustomNgbDate(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            new Date().getUTCDate()
        );
        this.getList(0);

        this.checkColumnsFilterEmpty();
    }

    private checkColumnsFilterEmpty() {
        this.isColumnsFilterEmpty = true;
        for (let item in this.tableVisaListFilter) {
            if (this.tableVisaListFilter[item]['checkbox'] === false) {
                this.isColumnsFilterEmpty = false;
                break;
            }
        }
    }

    public uploadVisaFile(event) {
        const that = this;
        let fileList: FileList = event.target.files;
        console.log(event.target.files);
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            console.log(file);
            let ext = file.name.match(/\.([^\.]+)$/)[1];
            if (file.size > 20000000) {
                that.toastr.error('File must have maximum size to 20MB', 'Uploading failed', {
                    disableTimeOut: true,
                    closeButton: true
                });
                that.fileVisa.nativeElement.value = '';
            }
            else if (ext.toLowerCase() === 'txt') {
                // let headers = new Headers();
                /** In Angular 5, including the header Content-Type can invalidate your request */
                // headers.append('Content-Type', 'multipart/form-data');
                // headers.append('Enctype', 'multipart/form-data');
                // headers.append('Accept', 'application/json');
                this.isUploadingInProgress = true;

                this.http.post(AppSettings.BASE_URL + `/visaFile`, formData)
                    .subscribe(
                        (data) => {
                            console.log(data);
                            that.toastr.success(data['message'], 'Successful uploading');
                            that.fileVisa.nativeElement.value = '';
                            that.isUploadingInProgress = false;
                            that.router.navigate(['/visa-files', data['entityID']]);
                        },
                        (error) => {
                            that.toastr.error(error.error.message, 'Uploading failed', {
                                disableTimeOut: true,
                                closeButton: true
                            });
                            that.fileVisa.nativeElement.value = '';
                            that.isUploadingInProgress = false;
                            that.router.navigate(['/visa-files', error.error['entityID']]);
                        }
                    )
            }
            else {
                that.fileVisa.nativeElement.value = '';
                that.toastr.error('Available only txt format', 'Uploading failed', {
                    disableTimeOut: true,
                    closeButton: true
                });
            }
        }
    }

    ngOnDestroy() {
        this.requests.unsubscribeRequests();
    }

    public onDateRangeChange() {
        this.page = 1;
        this.pageChange();
    }

    public onColumnsChange() {
        this.checkColumnsFilterEmpty();
        this.localstorageService.write('tableVisaListFilter', this.tableVisaListFilter);
    }

    public transitionToVisaFile(data: Object) {
        this.router.navigate(['/visa-files', data['visaConfirmationFileID']]);
    }

    public getList(skip) {
        this.visaFileApiService.getVisaList(
            {
                // merchantID: this.merchant['merchantID'] ? this.merchant['merchantID'] : '',
                take: this.pageSize,
                skip: skip,
                order: this.currentOrderBy,
                dateFrom: this.filtersService.getUTCDate(this.tablePeriodFrom),
                dateTo: this.filtersService.getUTCDate(this.tablePeriodTo),
                filterGroup: this.filterGroup
            },
            (data) => {
                console.log(data);
                this.visaList = data.data;
                this.collectionSize = data.numberOfRecords;
            });
    }

    public initFilterGroup() {
        this.filterGroup = {
            processingFailed: null,
        };
        this.acceptFilters();
    }

    public onPeriodFilterChange() {
        const today = new Date();
        const tmpDate = new Date();
        switch (this.selectedChargeBacksPeriod) {
            case 'today':
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            case 'yesterday':
                const yesterday = new Date(tmpDate.setDate(tmpDate.getDate() - 1));
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    yesterday.getUTCFullYear(),
                    yesterday.getUTCMonth() + 1,
                    yesterday.getUTCDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            case 'lastWeek':
                const lastWeek = new Date(tmpDate.setDate(tmpDate.getDate() - 7));
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    lastWeek.getUTCFullYear(),
                    lastWeek.getUTCMonth() + 1,
                    lastWeek.getUTCDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            case 'lastMonth':
                const lastMonth = new Date(tmpDate.setDate(tmpDate.getDate() - 30));
                this.tablePeriodFrom = this.filtersService.setCustomNgbDate(
                    lastMonth.getUTCFullYear(),
                    lastMonth.getUTCMonth() + 1,
                    lastMonth.getUTCDate());
                this.tablePeriodTo = this.filtersService.setCustomNgbDate(
                    today.getUTCFullYear(),
                    today.getUTCMonth() + 1,
                    today.getUTCDate());
                break;
            default:
                this.tablePeriodFrom = undefined;
                this.tablePeriodTo = undefined;
        }
        console.log('onPeriodFilterChange: ', this.selectedChargeBacksPeriod);
        console.log(this.tablePeriodFrom, this.tablePeriodTo);
        this.pageChange();
    }

    public pageChange() {
        console.log("pageChange: " + this.page);
        this.getList(this.page - 1 > 0 ? (this.page - 1) * this.pageSize : 0);
    }

    public refreshPage() {
        this.visaList = [];
        this.collectionSize = 0;
        this.pageChange();
    }

    public setPositionIconStatus(icon: string) {
        this.orderBy[icon] = this.orderBy[icon] === 'ASC' ? 'DESC' : 'ASC';
        this.currentOrderBy = {
            prop: icon,
            order: this.orderBy[icon]
        };
        for (let i in this.orderBy) {
            if (i !== icon) {
                this.orderBy[i] = "";
            }
        }
        this.pageChange();
    }

    public acceptFilters() {
        this.localstorageService.write('visaFilesFilterGroup', this.filterGroup);
        if (this.page === 1) {
            console.log("page: " + this.page);
            this.pageChange(); 
        }
        else
        {
            this.page = 1;
            this.pageChange(); 
        }
    }

    public reloadConfigSelect($event) {
    }

    closeOutsideDatePicker(ev, el) {
        if (!el.isOpen() || ev.target.id == el
            || (ev.target.offsetParent && ev.target.offsetParent.localName.includes('ngb-datepicker'))
            || !(ev.target.parentElement && ev.target.parentElement.parentElement
                && !ev.target.parentElement.parentElement.localName.includes('ngb-datepicker'))) {
            return;
        }
        if (el.isOpen() && ev.target.id != el) {
            el.close();
        }
    }
}
