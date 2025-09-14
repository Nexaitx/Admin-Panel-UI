import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietOnboardUsers } from './diet-onboard-users';

describe('DietOnboardUsers', () => {
  let component: DietOnboardUsers;
  let fixture: ComponentFixture<DietOnboardUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietOnboardUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietOnboardUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
