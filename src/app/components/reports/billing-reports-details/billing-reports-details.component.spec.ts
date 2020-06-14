import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BillingReportsDetailsComponent} from "./billing-reports-details.component";

describe('ReportsComponent', () => {
    let component: BillingReportsDetailsComponent;
    let fixture: ComponentFixture<BillingReportsDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BillingReportsDetailsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BillingReportsDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
