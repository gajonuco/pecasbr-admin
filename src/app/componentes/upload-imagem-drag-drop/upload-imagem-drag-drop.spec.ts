import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImagemDragDrop } from './upload-imagem-drag-drop';

describe('UploadImagemDragDrop', () => {
  let component: UploadImagemDragDrop;
  let fixture: ComponentFixture<UploadImagemDragDrop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadImagemDragDrop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadImagemDragDrop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
