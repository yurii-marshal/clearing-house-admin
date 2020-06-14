import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BillingReportsDetailsComponent} from "./billing-reports-details.component";

const routes: Routes = [
    {
        path: '', component: BillingReportsDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingReportsDetailsRoutingModule {
}
