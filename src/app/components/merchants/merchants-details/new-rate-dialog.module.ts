import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material";
import {NgSelectModule} from "@ng-select/ng-select";
import {NewRateDialogComponent} from "./new-rate-dialog.component";

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        MatTabsModule,
        FormsModule,
        NgSelectModule,
        NewRateDialogComponent
    ],
    declarations: [NewRateDialogComponent],
    entryComponents: [NewRateDialogComponent]
})
export class NewRateDialogModule {
}
