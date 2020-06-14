import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {BillingCycleReportComponent} from "./billing-cycle-report.component";

describe('BillingCycleReportComponent', () => {
  let component: BillingCycleReportComponent;
  let fixture: ComponentFixture<BillingCycleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingCycleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCycleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
