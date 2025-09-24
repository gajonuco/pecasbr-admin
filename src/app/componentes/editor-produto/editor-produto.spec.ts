import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorProduto } from './editor-produto';

describe('EditorProduto', () => {
  let component: EditorProduto;
  let fixture: ComponentFixture<EditorProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorProduto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorProduto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
