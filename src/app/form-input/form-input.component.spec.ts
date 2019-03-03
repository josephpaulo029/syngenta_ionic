import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInputPage } from './form-input.page';

describe('FormInputPage', () => {
  let component: FormInputPage;
  let fixture: ComponentFixture<FormInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
