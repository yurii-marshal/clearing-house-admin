import {NgModule} from "@angular/core";

import {CommonModule} from '@angular/common';

import {ProfileDetailsRoutingModule} from './profile-details-routing.module';
import {ProfileDetailsComponent} from './profile-details.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {PageHeaderModule} from "../../common-components/page-header/page-header.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        ProfileDetailsRoutingModule,
        PageHeaderModule,
        NgbModule.forRoot(),
        FormsModule,
        NgSelectModule
    ],
    declarations: [
        ProfileDetailsComponent
    ]
})
export class ProfileDetailsModule {
}
