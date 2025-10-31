import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimosPedidos } from './ultimos-pedidos';

describe('UltimosPedidos', () => {
  let component: UltimosPedidos;
  let fixture: ComponentFixture<UltimosPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimosPedidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UltimosPedidos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
