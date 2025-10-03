import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ledgers } from './ledgers';

describe('Ledgers', () => {
  let component: Ledgers;
  let fixture: ComponentFixture<Ledgers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ledgers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ledgers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
