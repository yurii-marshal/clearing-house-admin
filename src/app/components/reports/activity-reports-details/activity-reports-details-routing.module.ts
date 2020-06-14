import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ActivityReportsDetailsComponent} from "./activity-reports-details.component";

const routes: Routes = [
    {
        path: '', component: ActivityReportsDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivityReportsDetailsRoutingModule {
}
