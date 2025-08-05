import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dieticians } from './dieticians';

describe('Dieticians', () => {
  let component: Dieticians;
  let fixture: ComponentFixture<Dieticians>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dieticians]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dieticians);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
