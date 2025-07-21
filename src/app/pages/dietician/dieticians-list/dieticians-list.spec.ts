import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieticiansList } from './dieticians-list';

describe('DieticiansList', () => {
  let component: DieticiansList;
  let fixture: ComponentFixture<DieticiansList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DieticiansList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieticiansList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
