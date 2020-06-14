import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {MerchantsDetailsComponent} from "../components/merchants/merchants-details/merchants-details.component";

@Injectable()
export class MerchantDetailsDeactivateGuard implements CanDeactivate<MerchantsDetailsComponent> {

    canDeactivate(target: MerchantsDetailsComponent) {
        if (target.getChanged()) {
            return window.confirm('You have unsaved data. Do you really want to cancel?');
        }
        return true;
    }

}