import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TransactionsReportModule} from "./transactions-report.module";

describe('TransactionsReportModule', () => {
  let component: TransactionsReportModule;
  let fixture: ComponentFixture<TransactionsReportModule>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsReportModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsReportModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
