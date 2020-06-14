import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {NgSelectModule, NgOption} from "@ng-select/ng-select";
import {RouterModule, Routes} from "@angular/router";
import {ChargebacksComponent} from "./chargebacks.component";
import {PipesModule} from "../../pipes.module";
import {TranslateModule} from "@ngx-translate/core";


const routes: Routes = [
    {
        path: '',
        component: ChargebacksComponent
    }
];

@NgModule({
    imports: [
        TranslateModule,
        RouterModule.forChild(routes),
        CommonModule,
        PipesModule,
        NgbModule.forRoot(),
        FormsModule,
        NgSelectModule
    ],
    declarations: [ChargebacksComponent],
    exports: [RouterModule]
})
export class ChargebacksModule {
}
