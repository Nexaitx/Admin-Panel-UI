import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DutyLogs } from './duty-logs';

describe('DutyLogs', () => {
  let component: DutyLogs;
  let fixture: ComponentFixture<DutyLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DutyLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DutyLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
