import { environment } from '../environments/environment';
import {HttpHeaders} from "@angular/common/http";

export class AppSettings {
    public static BASE_URL = environment.production ? '/api' :
       "http://localhost:3047/api/";
    //'https://rapid-clearinghouse-api.azurewebsites.net/api';

    public static HttpOptions = {
        headers: new HttpHeaders({
            "Accept": "*/*",
            'Content-Type': 'application/json'
        })
    };

    public static convertUTCDateToLocalDate(date) {
        let newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        let offset = date.getTimezoneOffset() / 60;
        let hours = date.getHours();
        newDate.setHours(hours - offset);

        return newDate;
    }
}
