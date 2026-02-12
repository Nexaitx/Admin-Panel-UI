import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsCreation } from './blogs-creation';

describe('BlogsCreation', () => {
  let component: BlogsCreation;
  let fixture: ComponentFixture<BlogsCreation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsCreation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsCreation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
