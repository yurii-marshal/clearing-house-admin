import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './layout.component';
import {MerchantsDetailsModule} from "../components/merchants/merchants-details/merchants-details.module";

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            // { path: '', redirectTo: 'merchants' },
            {
                path: 'merchants',
                loadChildren: '../components/merchants/merchants.module#MerchantsModule'
            },
            {
                path: 'merchants/:id',
                loadChildren: '../components/merchants/merchants-details/merchants-details.module#MerchantsDetailsModule'
            },
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'profile-details',
                loadChildren: '../components/profile-details/profile-details.component'
            },
            {
                path: 'reports',
                loadChildren: './reports/reports.module#ReportsModule'
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
                path: 'charts',
                loadChildren: './charts/charts.module#ChartsModule'
            },
            {
                path: 'tables',
                loadChildren: './tables/tables.module#TablesModule'
            },
            {
                path: 'forms',
                loadChildren: './form/form.module#FormModule'
            },
            {
                path: 'bs-element',
                loadChildren: './bs-element/bs-element.module#BsElementModule'
            },
            {
                path: 'grid',
                loadChildren: './grid/grid.module#GridModule'
            },
            {
                path: 'components',
                loadChildren: './bs-component/bs-component.module#BsComponentModule'
            },
            {
                path: 'blank-page',
                loadChildren: './blank-page/blank-page.module#BlankPageModule'
            },
            // otherwise redirect to home
            {
                path: '**',
                redirectTo: 'merchants'
            }

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {
}
