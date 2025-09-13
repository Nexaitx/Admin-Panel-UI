import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieticianDashboard } from './dietician-dashboard';

describe('DieticianDashboard', () => {
  let component: DieticianDashboard;
  let fixture: ComponentFixture<DieticianDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DieticianDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieticianDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
