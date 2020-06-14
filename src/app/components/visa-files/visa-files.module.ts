import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {NgSelectModule, NgOption} from "@ng-select/ng-select";
import {RouterModule, Routes} from "@angular/router";
import {PipesModule} from "../../pipes.module";
import {TranslateModule} from "@ngx-translate/core";
import {VisaFilesComponent} from "./visa-files.component";

const routes: Routes = [
    {
        path: '',
        component: VisaFilesComponent
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
    declarations: [VisaFilesComponent],
    exports: [RouterModule]
})
export class VisaFilesModule {
}
