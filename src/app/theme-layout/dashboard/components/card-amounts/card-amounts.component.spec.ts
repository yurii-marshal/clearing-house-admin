import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAmountsComponent } from './card-amounts.component';

describe('CardAmountsComponent', () => {
  let component: CardAmountsComponent;
  let fixture: ComponentFixture<CardAmountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAmountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAmountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
