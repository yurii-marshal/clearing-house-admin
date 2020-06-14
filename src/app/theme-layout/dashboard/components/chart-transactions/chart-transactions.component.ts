import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';

@Component({
    selector: 'app-chart-transactions',
    templateUrl: './chart-transactions.component.html',
    styleUrls: ['./chart-transactions.component.scss']
})
export class ChartTransactionsComponent implements OnInit {
    @Input() lineChartData: Array<any> = [];
    @Input() lineChartLabels: Array<any> = [];
    @ViewChild(BaseChartDirective)
    public chart: BaseChartDirective;

    public lineChartOptions: any = {
        responsive: true,
        scaleBeginAtZero: true,
        scaleShowGridLines: true,
        maintainAspectRatio: false,
        animating: true,
        legend: {
            display: false,
            labels: {
                // This more specific font property overrides the global property
                fontColor: 'red'
            }
        },
        scales: {
            xAxes: [
                {
                    ticks: {
                        fontColor: '#c0c0c0',
                        fontFamily: 'Roboto',
                        fontSize: 10,
                        fontStyle: 'normal'
                    }
                }
            ],
            yAxes: [
                {
                    ticks: {
                        fontColor: '#c0c0c0',
                        fontFamily: 'Roboto',
                        fontSize: 10,
                        fontStyle: 'normal'
                    }
                }
            ]
        }
    };
    public lineChartType: string = 'line';
    public lineChartDataSet: any;

    constructor() {
    }

    ngOnInit() {
        this.lineChartData = [];
        // console.log(this.lineChartLabels);
        // console.log(this.lineChartData);
        this.lineChartDataSet = [
            {
                data: this.lineChartData
            }
        ];
    }

    chartClicked($event) {
        // console.log($event);
    }

    reloadChart($event) {
        // console.log($event);
        setTimeout(() => {
            this.chart.chart.resize();
        }, 0);
    }
}
