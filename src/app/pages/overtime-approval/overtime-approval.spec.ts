import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeApproval } from './overtime-approval';

describe('OvertimeApproval', () => {
  let component: OvertimeApproval;
  let fixture: ComponentFixture<OvertimeApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OvertimeApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimeApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
