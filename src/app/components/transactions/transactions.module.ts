import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TransactionsRoutingModule} from './transactions-routing.module';
import {TransactionsComponent} from './transactions.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {PipesModule} from "../../pipes.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        FormsModule,
        TranslateModule,
        CommonModule,
        PipesModule,
        TransactionsRoutingModule,
        NgbModule.forRoot(),
        FormsModule,
        NgSelectModule
    ],
    declarations: [
        TransactionsComponent
    ]
})
export class TransactionsModule {
}
