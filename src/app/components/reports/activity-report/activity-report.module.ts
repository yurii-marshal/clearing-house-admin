import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {ActivityReportComponent} from "./activity-report.component";
import {PipesModule} from "../../../pipes.module";

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
        ActivityReportComponent
    ]
})
export class ActivityReportModule {
}
