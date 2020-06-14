import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShellComponent} from "./shell.component";
import {AuthorizationGuard} from "../authorization.guard";

const routes: Routes = [
    {
        path: '',
        component: ShellComponent,
        children: [
            {
                path: 'unauthorized',
                loadChildren: './unauthorized/unauthorized.module#UnauthorizedModule'
            },
            {
                path: 'merchants',
                loadChildren: './merchants/merchants.module#MerchantsModule',
                //canActivate: [AuthorizationGuard]
            },
            {
                path: 'merchants/:id',
                loadChildren: './merchants/merchants-details/merchants-details.module#MerchantsDetailsModule'
            },
            {
                path: 'profile-details',
                loadChildren: './profile-details/profile-details.component'
            },
            {
                path: 'reports',
                loadChildren: './reports/reports.module#ReportsModule'
            },
            {
                path: 'billing-reports-details/:id',
                loadChildren: './reports/billing-reports-details/billing-reports-details.module#BillingReportsDetailsModule'
            },
            {
                path: 'chargeback-reports-details/:id',
                loadChildren: './reports/chargeback-reports-details/chargeback-reports-details.module#ChargebackReportsDetailsModule'
            },
            {
                path: 'activity-reports-details/:id',
                loadChildren: './reports/activity-reports-details/activity-reports-details.module#ActivityReportsDetailsModule'
            },
            {
                path: 'transactions',
                loadChildren: './transactions/transactions.module#TransactionsModule'
            },
            {
                path: 'transactions/:id',
                loadChildren: './transactions/transactions-information/transactions-information.module#TransactionsInformationModule'
            },
            {
                path: 'transaction-history-details/:id',
                loadChildren: './transactions/transactions-information/transaction-history-details/transaction-history-details.module#TransactionHistoryDetailsModule'
            },
            {
                path: 'chargebacks',
                loadChildren: './chargebacks/chargebacks.module#ChargebacksModule'
            },
            {
                path: 'chargebacks/:id',
                loadChildren: './chargebacks/chargebacks-information/chargebacks-information.module#ChargebacksInformationModule'
            },
            {
                path: 'visa-files',
                loadChildren: './visa-files/visa-files.module#VisaFilesModule'
            },
            {
                path: 'visa-files/:id',
                loadChildren: './visa-files/visa-file-information/visa-file-information.module#VisaFileInformationModule'
            },
            {
                path: 'system-settings',
                loadChildren: './system-settings/system-settings.module#SystemSettingsModule'
            },
            // {
            //     path: '**',
            //     redirectTo: 'merchants'
            // }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShellRoutingModule {
}
