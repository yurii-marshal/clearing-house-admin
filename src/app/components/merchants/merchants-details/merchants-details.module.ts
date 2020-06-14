import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MerchantsDetailsRoutingModule} from './merchants-details-routing.module';
import {MerchantsDetailsComponent} from './merchants-details.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material";
import {NgSelectModule} from "@ng-select/ng-select";
import {PipesModule} from "../../../pipes.module";
import {TranslateModule} from "@ngx-translate/core";
import {DirectivesModule} from "../../../directives.module";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        PipesModule,
        MerchantsDetailsRoutingModule,
        NgbModule.forRoot(),
        MatTabsModule,
        FormsModule,
        NgSelectModule,
        DirectivesModule,
    ],
    declarations: [
        MerchantsDetailsComponent
    ]
})
export class MerchantsDetailsModule {
}
