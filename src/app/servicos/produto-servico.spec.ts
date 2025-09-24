import { TestBed } from '@angular/core/testing';

import { ProdutoServico } from './produto-servico';

describe('ProdutoServico', () => {
  let service: ProdutoServico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutoServico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
