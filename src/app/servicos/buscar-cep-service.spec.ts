import { TestBed } from '@angular/core/testing';

import { BuscarCepService } from './buscar-cep-service';

describe('BuscarCepService', () => {
  let service: BuscarCepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscarCepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
