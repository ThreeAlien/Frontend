import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillManageComponent } from './bill-manage.component';

describe('ClientManageComponent', () => {
  let component: BillManageComponent;
  let fixture: ComponentFixture<BillManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillManageComponent]
    });
    fixture = TestBed.createComponent(BillManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
