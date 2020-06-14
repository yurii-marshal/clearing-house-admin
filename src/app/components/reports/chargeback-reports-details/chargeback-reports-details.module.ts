import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {ChargebackReportsDetailsComponent} from "./chargeback-reports-details.component";
import {ChargebackReportsDetailsRoutingModule} from "./chargeback-reports-details-routing.module";
import {PipesModule} from "../../../pipes.module";

@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        TranslateModule,
        ChargebackReportsDetailsRoutingModule,
        NgbModule.forRoot(),
        MatTabsModule,
        FormsModule,
        NgSelectModule

    ],
    declarations: [
        ChargebackReportsDetailsComponent
    ]
})
export class ChargebackReportsDetailsModule {
}
