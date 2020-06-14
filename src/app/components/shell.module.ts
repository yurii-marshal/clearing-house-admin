import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

import {SidebarComponent} from '../common-components/sidebar/sidebar.component';
import {HeaderComponent} from '../common-components/header/header.component';
import {ShellComponent} from "./shell.component";
import {ShellRoutingModule} from "./shell-routing.module";
import {LoaderScreenComponent} from "../common-components/loader-screen/loader-screen.component";

@NgModule({
    imports: [
        CommonModule,
        ShellRoutingModule,
        TranslateModule,
        NgbDropdownModule.forRoot(),
    ],
    declarations: [
        ShellComponent,
        SidebarComponent,
        LoaderScreenComponent,
        HeaderComponent,
    ]
})
export class ShellModule {
}
