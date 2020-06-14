import {Component, Input, OnInit} from '@angular/core';

export interface  orderBy {
    date: string;
    transactionID: string;
    merchant: string;
    paymentGateway: string;
    status: string;
    currency: string;
    amount: string
}

@Component({
    selector: 'app-last-transactions',
    templateUrl: './last-transactions.component.html',
    styleUrls: ['./last-transactions.component.scss']
})
export class LastTransactionsComponent implements OnInit {
    @Input() dataTable;

    public orderBy: orderBy = {} as any;

    constructor() {

    }

    ngOnInit() {
    }


    public setPositionIconStatus(icon: string) {
        if (this.orderBy[icon] === 'ASC') {
            this.orderBy[icon] = 'DESC';
        } else {
            this.orderBy[icon] = 'ASC';
        }
        for (let i in this.orderBy) {
            if (i !== icon) {
                this.orderBy[i] = "";
            }
        }
    }
}
