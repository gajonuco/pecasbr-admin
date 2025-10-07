import { TestBed } from '@angular/core/testing';

import { ClienteServico } from './cliente-servico';

describe('ClienteServico', () => {
  let service: ClienteServico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteServico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
