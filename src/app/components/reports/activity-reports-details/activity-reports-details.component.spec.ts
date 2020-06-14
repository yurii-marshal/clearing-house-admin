import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivityReportsDetailsComponent} from "./activity-reports-details.component";

describe('ReportsComponent', () => {
    let component: ActivityReportsDetailsComponent;
    let fixture: ComponentFixture<ActivityReportsDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ActivityReportsDetailsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityReportsDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
