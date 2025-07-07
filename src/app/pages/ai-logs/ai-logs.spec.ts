import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiLogs } from './ai-logs';

describe('AiLogs', () => {
  let component: AiLogs;
  let fixture: ComponentFixture<AiLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
