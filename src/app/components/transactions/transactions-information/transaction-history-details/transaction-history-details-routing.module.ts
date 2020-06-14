import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TransactionHistoryDetailsComponent} from "./transaction-history-details.component";

const routes: Routes = [   {
  path: '', component: TransactionHistoryDetailsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionHistoryDetailsRoutingModule { }
