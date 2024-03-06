import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportExpotPopComponent } from './report-export-pop.component';

describe('ReportExpotPopComponent', () => {
  let component: ReportExpotPopComponent;
  let fixture: ComponentFixture<ReportExpotPopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportExpotPopComponent]
    });
    fixture = TestBed.createComponent(ReportExpotPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
