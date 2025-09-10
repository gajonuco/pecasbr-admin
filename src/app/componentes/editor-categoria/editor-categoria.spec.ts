import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorCategoria } from './editor-categoria';

describe('EditorCategoria', () => {
  let component: EditorCategoria;
  let fixture: ComponentFixture<EditorCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorCategoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorCategoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
