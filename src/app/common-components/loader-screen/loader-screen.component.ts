import { Component, OnInit } from '@angular/core';
import {TransitionsService} from "../../services/transitions.service";

@Component({
    selector: 'app-loader-screen',
    templateUrl: './loader-screen.component.html',
    styleUrls: ['./loader-screen.component.scss']
})
export class LoaderScreenComponent implements OnInit {
    public isLoadingInProgress: boolean = false;

    constructor(private transitionService: TransitionsService) {}

    ngOnInit() {
        this.transitionService.currentLoadingProgress.subscribe(data => this.isLoadingInProgress = data);
    }
}
