import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RidersComponent } from './Riders';

describe('Client', () => {
  let component: RidersComponent;
  let fixture: ComponentFixture<RidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RidersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
