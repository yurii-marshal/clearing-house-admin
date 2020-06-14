import {Component, OnDestroy, OnInit} from '@angular/core';
import {TransitionsService} from "../services/transitions.service";

@Component({
    selector: 'app-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {
    isRTLToggle: boolean = false;
    isSafariBrowser: boolean;

    constructor(private transitionService: TransitionsService) {
    }

    ngOnInit() {
        this.transitionService.currentRTLToggle.subscribe(data => this.isRTLToggle = data);
        this.isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        // console.log(this.isSafariBrowser);
    }

    ngOnDestroy() {
    }
}
