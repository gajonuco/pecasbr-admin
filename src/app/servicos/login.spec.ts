import { TestBed } from '@angular/core/testing';

import { LoginServico } from './login-servico';

describe('LoginServico', () => {
  let service: LoginServico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginServico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
