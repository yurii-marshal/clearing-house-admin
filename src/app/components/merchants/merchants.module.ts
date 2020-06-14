import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MerchantsRoutingModule} from './merchants-routing.module';
import {MerchantsComponent} from './merchants.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {PipesModule} from "../../pipes.module";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        PipesModule,
        MerchantsRoutingModule,
        NgbModule.forRoot(),
        FormsModule,
        NgSelectModule
    ],
    declarations: [
        MerchantsComponent
    ]
})
export class MerchantsModule {
}
