import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieticianReports } from './dietician-reports';

describe('DieticianReports', () => {
  let component: DieticianReports;
  let fixture: ComponentFixture<DieticianReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DieticianReports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieticianReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
