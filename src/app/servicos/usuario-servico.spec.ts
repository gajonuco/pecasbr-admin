import { TestBed } from '@angular/core/testing';

import { UsuarioServico } from './usuario-servico';

describe('UsuarioServico', () => {
  let service: UsuarioServico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioServico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
