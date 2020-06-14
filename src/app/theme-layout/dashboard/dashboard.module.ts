import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent
} from './components';
import { StatModule } from '../../common-components/stat/stat.module';
import {ChartsModule} from 'ng2-charts';
import { LastTransactionsComponent } from './components/last-transactions/last-transactions.component';
import { CardAmountsComponent } from './components/card-amounts/card-amounts.component';
import { ChartTransactionsComponent } from './components/chart-transactions/chart-transactions.component';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        DashboardRoutingModule,
        StatModule,
        ChartsModule
    ],
    declarations: [
        DashboardComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent,
        LastTransactionsComponent,
        CardAmountsComponent,
        ChartTransactionsComponent
    ]
})
export class DashboardModule {}
