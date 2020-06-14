import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../app-settings";
import {RequestsService} from "../http-interceptors/requests.service";

@Injectable()
export class StatusApiService {
    public response: any;

    constructor(private httpService: RequestsService) {
    }

    public getStatusesList() {
        this.httpService.get(
            `/dictionaries`,
            {},
            (data) => {
                this.response = data
            },
            () => (null), () => (null));
    }
}
