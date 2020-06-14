import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-card-amounts',
    templateUrl: './card-amounts.component.html',
    styleUrls: ['./card-amounts.component.scss']
})
export class CardAmountsComponent implements OnInit {
    @Input() cardAmountImg: string;
    @Input() cardAmountTitle: string;
    @Input() cardAmount: number;
    @Input() cardAmountFooter: number;
    @Input() cardAmountFooterTitle: string;

    constructor() {

    }

    ngOnInit() {
    }

}
