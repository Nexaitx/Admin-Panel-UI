import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dietician } from './dietician';

describe('Dietician', () => {
  let component: Dietician;
  let fixture: ComponentFixture<Dietician>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dietician]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dietician);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
