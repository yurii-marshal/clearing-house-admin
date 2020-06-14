import {Routes, RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";
import {ProfileDetailsComponent} from "./profile-details.component";

const routes: Routes = [
    {
        path: '', component: ProfileDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileDetailsRoutingModule {
}
