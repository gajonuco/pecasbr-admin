import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPagamentos } from './editor-pagamentos';

describe('EditorPagamentos', () => {
  let component: EditorPagamentos;
  let fixture: ComponentFixture<EditorPagamentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorPagamentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorPagamentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
