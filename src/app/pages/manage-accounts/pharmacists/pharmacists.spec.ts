import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pharmacists } from './pharmacists';

describe('Pharmacists', () => {
  let component: Pharmacists;
  let fixture: ComponentFixture<Pharmacists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pharmacists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pharmacists);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
