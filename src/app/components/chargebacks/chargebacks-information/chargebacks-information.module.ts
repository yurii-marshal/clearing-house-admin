import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {ChargebacksInformationComponent} from "./chargebacks-information.component";
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../../pipes.module";

const routes: Routes = [   {
    path: '', component: ChargebacksInformationComponent
}];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        PipesModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ChargebacksInformationComponent],
    exports: [RouterModule]
})
export class ChargebacksInformationModule {
}
