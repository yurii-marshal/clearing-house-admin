import {Component, OnInit} from '@angular/core';
import {routerTransition} from "../../router.animations";
import {SidebarComponent} from "../../common-components/sidebar/sidebar.component";

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.component.html',
    styleUrls: ['./unauthorized.component.scss'],
    animations: [routerTransition()],
})
export class UnauthorizedComponent implements OnInit {

    constructor(private sidebar: SidebarComponent) {
        sidebar.isUnauthorized = true;
    }

    ngOnInit() {
    }

}
