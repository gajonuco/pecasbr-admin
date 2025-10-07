import { TestBed } from '@angular/core/testing';

import { PedidosServico } from './pedidos-servico';

describe('PedidosServico', () => {
  let service: PedidosServico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidosServico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
