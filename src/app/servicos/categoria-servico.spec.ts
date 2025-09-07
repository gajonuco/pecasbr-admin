import { TestBed } from '@angular/core/testing';

import { CategoriaServico } from './categoria-servico';

describe('CategoriaServico', () => {
  let service: CategoriaServico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaServico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
