import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderAcceptReject } from './new-order-accept-reject';

describe('NewOrderAcceptReject', () => {
  let component: NewOrderAcceptReject;
  let fixture: ComponentFixture<NewOrderAcceptReject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewOrderAcceptReject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOrderAcceptReject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
