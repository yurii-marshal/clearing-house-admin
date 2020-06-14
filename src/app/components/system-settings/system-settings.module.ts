import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemSettingsComponent } from './system-settings.component';
import {RouterModule, Routes} from '@angular/router';
import {PipesModule} from '../../pipes.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {DirectivesModule} from '../../directives.module';
import {TagInputModule} from 'ngx-chips';


const routes: Routes = [
  {
    path: '',
    component: SystemSettingsComponent
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
    NgSelectModule,
    DirectivesModule,
    TagInputModule
  ],
  declarations: [SystemSettingsComponent],
  exports: [RouterModule]
})
export class SystemSettingsModule { }
