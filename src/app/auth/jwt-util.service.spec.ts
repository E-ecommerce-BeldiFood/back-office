import { TestBed } from '@angular/core/testing';

import { JwtUtilService } from './jwt-util.service';

describe('JwtUtilService', () => {
  let service: JwtUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
