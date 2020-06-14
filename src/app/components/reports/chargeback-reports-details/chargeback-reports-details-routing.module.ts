import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ChargebackReportsDetailsComponent} from "./chargeback-reports-details.component";

const routes: Routes = [
    {
        path: '', component: ChargebackReportsDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChargebackReportsDetailsRoutingModule {
}
