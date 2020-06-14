import {NgModule} from '@angular/core';
import {UnauthorizedComponent} from "./unauthorized.component";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {SidebarComponent} from "../../common-components/sidebar/sidebar.component";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
    {
        path: '',
        component: UnauthorizedComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes)
    ],
    declarations: [UnauthorizedComponent],
    providers: [SidebarComponent]
})
export class UnauthorizedModule {
}
