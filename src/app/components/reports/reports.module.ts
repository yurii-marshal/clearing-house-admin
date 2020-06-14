import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportsRoutingModule} from './reports-routing.module';
import {ReportsComponent} from './reports.component';
import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {PipesModule} from "../../pipes.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {TransactionsReportComponent} from "./transactions-report/transactions-report.component";
import {ActivityReportComponent} from "./activity-report/activity-report.component";
import {BillingCycleReportComponent} from "./billing-cycle-report/billing-cycle-report.component";
import {ChargebackReportComponent} from "./chargeback-report/chargeback-report.component";

@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        TranslateModule,
        ReportsRoutingModule,
        NgbModule.forRoot(),
        MatTabsModule,
        FormsModule,
        NgSelectModule
    ],
    declarations: [
        ReportsComponent,
        TransactionsReportComponent,
        ActivityReportComponent,
        BillingCycleReportComponent,
        ChargebackReportComponent
    ]
})
export class ReportsModule {
}
