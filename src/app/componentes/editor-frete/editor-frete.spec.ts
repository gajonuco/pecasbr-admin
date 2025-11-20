import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorFrete } from './editor-frete';

describe('EditorFrete', () => {
  let component: EditorFrete;
  let fixture: ComponentFixture<EditorFrete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorFrete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorFrete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
