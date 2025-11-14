import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagamentos } from './pagamentos';

describe('Pagamentos', () => {
  let component: Pagamentos;
  let fixture: ComponentFixture<Pagamentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagamentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pagamentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
