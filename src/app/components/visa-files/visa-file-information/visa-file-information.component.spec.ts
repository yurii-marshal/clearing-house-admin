import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {VisaFileInformationComponent} from "./visa-file-information.component";

describe('VisaFileInformationComponent', () => {
  let component: VisaFileInformationComponent;
  let fixture: ComponentFixture<VisaFileInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaFileInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaFileInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
