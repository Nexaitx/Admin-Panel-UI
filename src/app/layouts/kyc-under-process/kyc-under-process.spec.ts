import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycUnderProcess } from './kyc-under-process';

describe('KycUnderProcess', () => {
  let component: KycUnderProcess;
  let fixture: ComponentFixture<KycUnderProcess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycUnderProcess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycUnderProcess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
