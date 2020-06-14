import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {PipesModule} from "../../../pipes.module";
import {ActivityReportsDetailsComponent} from "./activity-reports-details.component";
import {ActivityReportsDetailsRoutingModule} from "./activity-reports-details-routing.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        PipesModule,
        TranslateModule,
        ActivityReportsDetailsRoutingModule,
        NgbModule.forRoot(),
        MatTabsModule,
        FormsModule,
        NgSelectModule

    ],
    declarations: [
        ActivityReportsDetailsComponent
    ]
})
export class ActivityReportsDetailsModule {
}
