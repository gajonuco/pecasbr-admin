import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorUsuario } from './editor-usuario';

describe('EditorUsuario', () => {
  let component: EditorUsuario;
  let fixture: ComponentFixture<EditorUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
