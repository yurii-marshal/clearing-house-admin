import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppSettings } from '../app-settings';

@Component({
  selector: 'app-call-api',
  templateUrl: './call-api.component.html',
  styleUrls: ['./call-api.component.scss']
})
export class CallApiComponent implements OnInit {
  response: string;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    let options = {};

    this.http.get(AppSettings.BASE_URL + "/transaction", options)
      .subscribe(response => this.response = JSON.stringify(response));
  }

}
