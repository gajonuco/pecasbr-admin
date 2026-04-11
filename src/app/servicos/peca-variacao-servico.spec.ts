import { TestBed } from '@angular/core/testing';

import { PecaVariacaoServico } from './peca-variacao-servico';

describe('PecaVariacaoServico', () => {
  let service: PecaVariacaoServico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PecaVariacaoServico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
