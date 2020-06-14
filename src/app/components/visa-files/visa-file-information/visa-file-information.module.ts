import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {VisaFileInformationComponent} from "./visa-file-information.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {PipesModule} from "../../../pipes.module";

const routes: Routes = [   {
    path: '', component: VisaFileInformationComponent
}];

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
    declarations: [VisaFileInformationComponent],
    exports: [RouterModule]
})
export class VisaFileInformationModule {
}
