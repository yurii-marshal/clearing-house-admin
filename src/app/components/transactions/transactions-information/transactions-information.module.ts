import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule, NgOption} from "@ng-select/ng-select";

import {TransactionsInformationRoutingModule} from './transactions-information-routing.module';
import {TransactionsInformationComponent} from './transactions-information.component';
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../../pipes.module";

@NgModule({
    imports: [
        FormsModule,
        PipesModule,
        CommonModule,
        TranslateModule,
        TransactionsInformationRoutingModule,
        NgSelectModule
    ],
    declarations: [TransactionsInformationComponent]
})
export class TransactionsInformationModule {
}
