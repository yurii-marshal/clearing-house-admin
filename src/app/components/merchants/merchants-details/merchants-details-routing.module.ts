import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MerchantsDetailsComponent} from "./merchants-details.component";
import {MerchantDetailsDeactivateGuard} from "../../../services/deactivationMerchantDetails.service";

const routes: Routes = [
    {
        path: '',
        component: MerchantsDetailsComponent,
        canDeactivate: [MerchantDetailsDeactivateGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MerchantsDetailsRoutingModule {
}
