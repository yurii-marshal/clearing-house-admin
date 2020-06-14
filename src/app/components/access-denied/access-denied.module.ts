import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccessDeniedRoutingModule} from './access-denied-routing.module';
import {AccessDeniedComponent} from './access-denied.component';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        AccessDeniedRoutingModule
    ],
    declarations: [AccessDeniedComponent]
})
export class AccessDeniedModule {
}
