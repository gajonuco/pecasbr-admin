import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoVendas } from './grafico-vendas';

describe('GraficoVendas', () => {
  let component: GraficoVendas;
  let fixture: ComponentFixture<GraficoVendas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoVendas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoVendas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
