import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesAndAddresses } from './devices-and-addresses';

describe('DevicesAndAddresses', () => {
  let component: DevicesAndAddresses;
  let fixture: ComponentFixture<DevicesAndAddresses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevicesAndAddresses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevicesAndAddresses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
