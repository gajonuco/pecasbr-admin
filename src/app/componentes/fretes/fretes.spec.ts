import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fretes } from './fretes';

describe('Fretes', () => {
  let component: Fretes;
  let fixture: ComponentFixture<Fretes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fretes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fretes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
