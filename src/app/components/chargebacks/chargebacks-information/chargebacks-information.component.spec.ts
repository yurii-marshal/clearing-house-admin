import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ChargebacksInformationComponent} from "./chargebacks-information.component";


describe('ChargebacksInformationComponent', () => {
  let component: ChargebacksInformationComponent;
  let fixture: ComponentFixture<ChargebacksInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargebacksInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargebacksInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
