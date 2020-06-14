import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {TransactionHistoryDetailsRoutingModule} from "./transaction-history-details-routing.module";
import {TransactionHistoryDetailsComponent} from "./transaction-history-details.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule,
        TransactionHistoryDetailsRoutingModule,
        NgSelectModule
    ],
    declarations: [TransactionHistoryDetailsComponent]
})
export class TransactionHistoryDetailsModule {
}
