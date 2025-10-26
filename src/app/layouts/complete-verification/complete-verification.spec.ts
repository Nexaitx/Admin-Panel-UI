import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteVerification } from './complete-verification';

describe('CompleteVerification', () => {
  let component: CompleteVerification;
  let fixture: ComponentFixture<CompleteVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
