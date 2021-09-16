import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTemplateNewComponent } from './create-template-new.component';

describe('CreateTemplateNewComponent', () => {
  let component: CreateTemplateNewComponent;
  let fixture: ComponentFixture<CreateTemplateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTemplateNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTemplateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
