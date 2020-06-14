import { Component, OnInit } from '@angular/core';
import {routerTransition} from '../../router.animations';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  animations: [routerTransition()]
})
export class ProfileDetailsComponent implements OnInit {
  model: NgbDateStruct;
  model2: NgbDateStruct;
  model3: NgbDateStruct;
  public selectedSimpleItem: any;
  public selectedSimpleItem2: any;
  date: {year: number, month: number};

  items: any;
  items2: any;
  constructor() {
    this.items = [1, 2, 3];
  }

  ngOnInit() {
  }

  closeOutsideDatePicker(ev, el) {
    if (!el.isOpen() || ev.target.id == el
        || (ev.target.offsetParent && ev.target.offsetParent.localName.includes('ngb-datepicker'))
        || !(ev.target.parentElement && ev.target.parentElement.parentElement
        && !ev.target.parentElement.parentElement.localName.includes('ngb-datepicker'))) {
      return;
    }
    if (el.isOpen() && ev.target.id != el) {
      el.close();
    }
  }

}
