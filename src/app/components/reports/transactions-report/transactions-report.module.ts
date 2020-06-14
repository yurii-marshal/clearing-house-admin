import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {PipesModule} from "../../../pipes.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {TransactionsReportComponent} from "./transactions-report.component";

@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        TranslateModule,
        NgbModule.forRoot(),
        MatTabsModule,
        FormsModule,
        NgSelectModule

    ],
    declarations: [
        TransactionsReportComponent
    ]
})
export class TransactionsReportModule {
}
