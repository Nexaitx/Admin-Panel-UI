import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsLiveDeviatian } from './gps-live-deviatian';

describe('GpsLiveDeviatian', () => {
  let component: GpsLiveDeviatian;
  let fixture: ComponentFixture<GpsLiveDeviatian>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpsLiveDeviatian]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsLiveDeviatian);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
