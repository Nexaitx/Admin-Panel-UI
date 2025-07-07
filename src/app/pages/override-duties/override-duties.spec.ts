import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverrideDuties } from './override-duties';

describe('OverrideDuties', () => {
  let component: OverrideDuties;
  let fixture: ComponentFixture<OverrideDuties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverrideDuties]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverrideDuties);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
