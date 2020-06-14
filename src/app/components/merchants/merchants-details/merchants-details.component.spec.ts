import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantsDetailsComponent } from './merchants-details.component';

describe('MerchantsDetailsComponent', () => {
  let component: MerchantsDetailsComponent;
  let fixture: ComponentFixture<MerchantsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
