import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GPSLiveMonitoring } from './gps-live-monitoring';

describe('GPSLiveMonitoring', () => {
  let component: GPSLiveMonitoring;
  let fixture: ComponentFixture<GPSLiveMonitoring>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GPSLiveMonitoring]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GPSLiveMonitoring);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
