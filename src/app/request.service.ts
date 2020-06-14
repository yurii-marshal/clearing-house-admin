import { Injectable } from '@angular/core';

@Injectable()
export class RequestService {

   dashboardInfo:any;

  constructor() {
    this.dashboardInfo ={
      generalBalanse : 1000,
      weeklyAmount : 109,
      commission : 10,
      lineChartData : [
        [65, 59, 80, 81]
      ],
      lineChartLabels:['January', 'February', 'March', 'April'],
      dataTable:[
        {
          date: '02/15/2018',
          transactionID: 'Lorem ipsum',
          merchant: 'Jones Smith',
          paymentGateway: 'Easycard',
          status: 'Pending',
          currency: '₪',
          amount: 100
        }, {
          date: '02/16/2018',
          transactionID: 'Lorem ipsum2',
          merchant: 'Jones Smith2',
          paymentGateway: 'Easycard2',
          status: 'Pending',
          currency: '₪',
          amount: 200
        }, {
          date: '02/17/2018',
          transactionID: 'Lorem ipsum3',
          merchant: 'Jones Smith3',
          paymentGateway: 'Easycard3',
          status: 'Pending',
          currency: '$',
          amount: 300
        }
      ]
    }

  }



  dashboardGet(){
    return this.dashboardInfo;
  }

}
