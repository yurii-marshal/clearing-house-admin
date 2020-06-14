import {Injectable} from "@angular/core";
import {RequestsService} from "../http-interceptors/requests.service";

// export type ChargeBack = {
//     transactionID: string,
//     chargeBackDate: string,
//     dealReference: string,
//     terminalReference: string,
//     merchantReference: string,
//     dealDescription: string,
//     requestedChargebackAmount: number,
//     chargebackDescription: string
// };

@Injectable()
export class ChargebackApiService {
    constructor(private httpService: RequestsService) {
    }

    public getChargeBackList(requestUrl, response) {
        this.httpService.get(
            `/chargeback`, requestUrl,
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }

    public createChargeback(requestData, response, error) {
        this.httpService.post(
            `/chargeback`,
            requestData,
            (data) => {
                response(data);
            },
            () => (null), (err) => (error(err)));
    }

    public getChargeBackByID(chargebackID, response) {
        this.httpService.get(
            `/chargeback/${chargebackID}`, {},
            (data) => {
                response(data);
            },
            () => (null), () => (null));
    }
}
