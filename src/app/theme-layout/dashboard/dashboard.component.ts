import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {Chart} from 'chart.js';
import {RequestService} from "../../request.service";


export interface dashboardInfoInterface {
     generalBalanse: number;
     weeklyAmount: number;
     commission: number;
     lineChartData: Array<any>;
     lineChartLabels: Array<any>;
     dataTable: any;
};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()],
    providers: [RequestService]
})

export class DashboardComponent implements OnInit {


    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public generalBalanseImg: string;
    public weeklyAmountImg: string;
    public generalBalanceTitle: string;
    public weeklyAmountTitle: string;
    public commissionTitle: string;

    public dataTable: [{
        date: any,
        transactionID: any,
        merchant: any,
        paymentGateway: any,
        status: any,
        currency: any,
        amount: any
    }];

    public dashboardInfo:dashboardInfoInterface;

    constructor(private getDataService: RequestService) {
        this.generalBalanseImg = './assets/images/dashboard/general_balance_icon.svg';
        this.weeklyAmountImg = './assets/images/dashboard/Weekly Amount_icon.svg';
        this.generalBalanceTitle = 'General Balance';
        this.weeklyAmountTitle = 'Weekly Amount';
        this.commissionTitle = 'Commission';
    }

    ngOnInit() {
        this.dashboardInfo = this.getDataService.dashboardGet();
    }

    public chartClicked(event) {
        console.log(event);
    }



}
