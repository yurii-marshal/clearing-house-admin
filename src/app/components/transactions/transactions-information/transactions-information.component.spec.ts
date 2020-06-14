import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsInformationComponent } from './transactions-information.component';

describe('TransactionsInformationComponent', () => {
  let component: TransactionsInformationComponent;
  let fixture: ComponentFixture<TransactionsInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
