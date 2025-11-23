import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveStaffs } from './active-staffs';

describe('ActiveStaffs', () => {
  let component: ActiveStaffs;
  let fixture: ComponentFixture<ActiveStaffs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveStaffs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveStaffs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
