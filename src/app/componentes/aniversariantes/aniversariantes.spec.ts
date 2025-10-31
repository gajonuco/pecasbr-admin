import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aniversariantes } from './aniversariantes';

describe('Aniversariantes', () => {
  let component: Aniversariantes;
  let fixture: ComponentFixture<Aniversariantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aniversariantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aniversariantes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
