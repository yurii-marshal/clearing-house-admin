import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {TransactionHistoryDetailsComponent} from "./transaction-history-details.component";

describe('TransactionsInformationComponent', () => {
  let component: TransactionHistoryDetailsComponent;
  let fixture: ComponentFixture<TransactionHistoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionHistoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
