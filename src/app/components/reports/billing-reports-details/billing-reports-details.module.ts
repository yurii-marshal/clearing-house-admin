import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {BillingReportsDetailsRoutingModule} from "./billing-reports-details-routing.module";
import {PipesModule} from "../../../pipes.module";
import {BillingReportsDetailsComponent} from "./billing-reports-details.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        TranslateModule,
        BillingReportsDetailsRoutingModule,
        NgbModule.forRoot(),
        MatTabsModule,
        FormsModule,
        NgSelectModule

    ],
    declarations: [
        BillingReportsDetailsComponent
    ]
})
export class BillingReportsDetailsModule {
}
