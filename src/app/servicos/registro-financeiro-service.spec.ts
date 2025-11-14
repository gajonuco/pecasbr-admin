import { TestBed } from '@angular/core/testing';

import { RegistroFinanceiroService } from './registro-financeiro-service';

describe('RegistroFinanceiroService', () => {
  let service: RegistroFinanceiroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroFinanceiroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
