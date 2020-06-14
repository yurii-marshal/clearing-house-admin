import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ChargebackReportsDetailsComponent} from "./chargeback-reports-details.component";

describe('ReportsComponent', () => {
  let component: ChargebackReportsDetailsComponent;
  let fixture: ComponentFixture<ChargebackReportsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargebackReportsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargebackReportsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
