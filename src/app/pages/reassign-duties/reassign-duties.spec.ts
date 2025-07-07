import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignDuties } from './reassign-duties';

describe('ReassignDuties', () => {
  let component: ReassignDuties;
  let fixture: ComponentFixture<ReassignDuties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReassignDuties]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReassignDuties);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
