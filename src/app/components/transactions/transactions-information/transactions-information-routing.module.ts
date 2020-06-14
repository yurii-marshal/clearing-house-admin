import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TransactionsInformationComponent} from "./transactions-information.component";

const routes: Routes = [   {
  path: '', component: TransactionsInformationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsInformationRoutingModule { }
