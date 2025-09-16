import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieticianAppointments } from './dietician-appointments';

describe('DieticianAppointments', () => {
  let component: DieticianAppointments;
  let fixture: ComponentFixture<DieticianAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DieticianAppointments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieticianAppointments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
