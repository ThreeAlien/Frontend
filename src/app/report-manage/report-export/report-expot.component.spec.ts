import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportExpotComponent } from './report-expot.component';

describe('ReportExpotComponent', () => {
  let component: ReportExpotComponent;
  let fixture: ComponentFixture<ReportExpotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportExpotComponent]
    });
    fixture = TestBed.createComponent(ReportExpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
