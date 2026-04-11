import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorVariacoes } from './editor-variacoes';

describe('EditorVariacoes', () => {
  let component: EditorVariacoes;
  let fixture: ComponentFixture<EditorVariacoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorVariacoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorVariacoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
