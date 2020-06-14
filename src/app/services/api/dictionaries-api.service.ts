import {Injectable} from "@angular/core";
import {RequestsService} from "../http-interceptors/requests.service";
import {TransitionsService} from "../transitions.service";

@Injectable()
export class DictionariesService {
    public dictionaries: Object;
    public convertedDTO: Object;
    public paymentGatewayList: Array<Object>;
    public businessAreas: Array<Object>;
    public clearingCompanies: Array<Object>;

    constructor(private httpService: RequestsService,
                private transitionsService: TransitionsService) {
        this.convertedDTO = {};
    }

    public getDictionaries(response) {
        let lang = this.transitionsService.currentLang;
        if(lang == 'he') lang = 'he-il';

        if(this.convertedDTO[lang])
            return response(this.convertedDTO[lang]);

        const that = this;
        this.httpService.get(
            `/dictionaries`,
            {language: lang},
            (data) => {
                that.dictionaries = data;
                let convertedDTO = {};
                for (let prop in data) {
                    if (!data.hasOwnProperty(prop)) continue;
                    convertedDTO[prop] = {};
                    for (let i = 0; i < data[prop].length; i++) {
                        convertedDTO[prop][data[prop][i]['code']] = {
                            title: data[prop][i]['description'],
                            checkbox: false
                        };
                    }
                }

                that.convertedDTO[lang] = convertedDTO;
                if(response) response(that.convertedDTO[lang]);
            },
            () => (null), () => (null));
    }

    public getClearingCompanyList(response) {
        if(this.clearingCompanies)
            return response(this.clearingCompanies);

        const that = this;
        this.httpService.get(
            `/clearingCompany`,
            {lang: this.transitionsService.currentLang},
            (data) => {
                that.clearingCompanies = data;
                response(data);
            },
            () => (null), () => (null));
    }

    public getPaymentGatewayList(response) {
        if(this.paymentGatewayList)
            return response(this.paymentGatewayList);

        const that = this;
        this.httpService.get(
            `/paymentGateway`,
            {lang: this.transitionsService.currentLang},
            (data) => {
                that.paymentGatewayList = data;
                if(response) response(that.paymentGatewayList);
            },
            () => (null), () => (null));
    }

    public getBusinessAreas(response, completeCallback) {
        if(this.businessAreas)
            return response(this.businessAreas);

        const that = this;
        this.httpService.get(
            `/businessAreas`,
            {},
            (data) => {
                that.businessAreas = data;
                response(data);
            },
            () => (completeCallback), () => (null));
    }
}