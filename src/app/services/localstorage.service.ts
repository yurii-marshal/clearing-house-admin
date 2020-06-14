import {Injectable} from "@angular/core";

@Injectable()
export class LocalstorageService {
    public prefix: string = 'clearing_house_';

    constructor() {
    }

    public read(key: string): any {
        const data = localStorage.getItem(this.prefix + key);
        if (data != null) {
            return JSON.parse(data);
        }
        return;
    }

    public write(key: string, value: any): void {
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
    }

    public remove(key: string) {
        localStorage.removeItem(this.prefix + key);
    }

    // public readObject(key: string): any {
    //     const base_str = localStorage.getItem(this.BASE_REF);
    //     if (base_str != null) {
    //         const data = JSON.parse(base_str);
    //         if (data != null) {
    //             const sub_obj = data[this.SUB_REF];
    //             if (sub_obj != null) {
    //                 const data = sub_obj[key];
    //                 if (data) return data;
    //             }
    //         }
    //     }
    //     return;
    // }
    //
    // public writeObject(key: string, value: any): void {
    //     const base_str = localStorage.getItem(this.BASE_REF);
    //     if (base_str != null) {
    //         const base_obj = JSON.parse(base_str);
    //         base_obj[this.SUB_REF][key] = value;
    //         localStorage.setItem(this.BASE_REF, JSON.stringify(base_obj));
    //     }
    // }
}