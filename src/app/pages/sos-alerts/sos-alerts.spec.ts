import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SosAlerts } from './sos-alerts';

describe('SosAlerts', () => {
  let component: SosAlerts;
  let fixture: ComponentFixture<SosAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SosAlerts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SosAlerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
