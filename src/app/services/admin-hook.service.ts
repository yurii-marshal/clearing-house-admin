import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../app-settings";

@Injectable()
export class AdminHookService {
    private response: string;

    constructor(private http: HttpClient) {
    }

    public getAdminHook() {
        return this.http.get(AppSettings.BASE_URL + '/admin/merchant', AppSettings.HttpOptions)
            .subscribe(response => this.response = JSON.stringify(response));
    }
}
