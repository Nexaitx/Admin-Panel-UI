import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientIndividual } from './client-individual';

describe('ClientIndividual', () => {
  let component: ClientIndividual;
  let fixture: ComponentFixture<ClientIndividual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientIndividual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientIndividual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
