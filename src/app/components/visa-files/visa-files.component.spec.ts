import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {VisaFilesComponent} from "./visa-files.component";

describe('VisaFilesComponent', () => {
  let component: VisaFilesComponent;
  let fixture: ComponentFixture<VisaFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
