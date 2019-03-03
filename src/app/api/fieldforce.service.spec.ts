import { TestBed } from '@angular/core/testing';

import { FieldforceService } from './fieldforce.service';

describe('FieldforceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FieldforceService = TestBed.get(FieldforceService);
    expect(service).toBeTruthy();
  });
});
