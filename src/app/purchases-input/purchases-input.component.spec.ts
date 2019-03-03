import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesInputPage } from './purchases-input.page';

describe('PurchasesInputPage', () => {
  let component: PurchasesInputPage;
  let fixture: ComponentFixture<PurchasesInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasesInputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
