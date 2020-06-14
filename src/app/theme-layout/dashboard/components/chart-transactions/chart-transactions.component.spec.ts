import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTransactionsComponent } from './chart-transactions.component';

describe('ChartTransactionsComponent', () => {
  let component: ChartTransactionsComponent;
  let fixture: ComponentFixture<ChartTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
