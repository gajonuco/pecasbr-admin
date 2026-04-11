import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PecaImagem } from '../../model/PecaImagem';

export interface ArquivoParaUpload {
  file: File;
  preview: string;
}

@Component({
  selector: 'app-upload-imagem-drag-drop',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './upload-imagem-drag-drop.html',
  styleUrl: './upload-imagem-drag-drop.css'
})
export class UploadImagemDragDrop {

  @Input() imagens: PecaImagem[] = [];
  @Input() maxImagens: number = 10;
  @Input() uploadando: boolean = false;
  @Input() erroUpload: string = '';

  @Output() arquivosSelecionados = new EventEmitter<File[]>();
  @Output() removerImagem = new EventEmitter<{ imagem: PecaImagem; index: number }>();
  @Output() definirPrincipal = new EventEmitter<{ imagem: PecaImagem; index: number }>();
  @Output() reordenar = new EventEmitter<PecaImagem[]>();
  @Output() imagemViaUrl = new EventEmitter<string>();

  public isDragOver: boolean = false;
  public previews: ArquivoParaUpload[] = [];

  // Índice da imagem sendo arrastada para reordenação
  private dragIndex: number | null = null;


  // ─── Drag & Drop para UPLOAD ───────────────────────────────────────

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  public onZonaDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  public onZonaDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  public onZonaDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;

    // Caso 1: arquivo local — comportamento atual
    if (files && files.length > 0) {
      this.processarArquivos(Array.from(files));
      return;
    }

    // Caso 2: imagem arrastada de outro site
    const uriList = event.dataTransfer?.getData('text/uri-list');
    const htmlData = event.dataTransfer?.getData('text/html');

    const url = uriList || this.extrairUrlDoHtml(htmlData);

    if (url && this.ehUrlDeImagem(url)) {
      this.imagemViaUrl.emit(url);
    }
  }

  private extrairUrlDoHtml(html?: string): string {
    if (!html) return '';
    const match = html.match(/src=["']([^"']+)/i);
    return match ? match[1] : '';
  }

  private ehUrlDeImagem(url: string): boolean {
    return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(url) || url.startsWith('http');
  }

  public onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.processarArquivos(Array.from(input.files));
      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      input.value = '';
    }
  }

  private processarArquivos(files: File[]): void {
    const imagensDisponiveis = this.maxImagens - this.imagens.length - this.previews.length;
    const arquivosValidos = files
      .filter(f => f.type.startsWith('image/'))
      .slice(0, imagensDisponiveis);

    arquivosValidos.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previews.push({
          file,
          preview: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    });

    if (arquivosValidos.length > 0) {
      this.arquivosSelecionados.emit(arquivosValidos);
    }
  }

  public removerPreview(index: number): void {
    this.previews.splice(index, 1);
  }

  public limparPreviews(): void {
    this.previews = [];
  }

  get totalAtual(): number {
    return this.imagens.length + this.previews.length;
  }

  get limiteAtingido(): boolean {
    return this.totalAtual >= this.maxImagens;
  }

  // ─── Drag & Drop para REORDENAÇÃO ──────────────────────────────────

  public onCardDragStart(event: DragEvent, index: number): void {
    this.dragIndex = index;
    const target = event.target as HTMLElement;
    target.classList.add('dragging');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  public onCardDragEnd(event: DragEvent): void {
    const target = event.target as HTMLElement;
    target.classList.remove('dragging');
    this.dragIndex = null;
    // Remove highlight de todos os cards
    document.querySelectorAll('.imagem-card').forEach(el => {
      el.classList.remove('drag-over-card');
    });
  }

  public onCardDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    if (this.dragIndex === null || this.dragIndex === index) return;
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over-card');
  }

  public onCardDragLeave(event: DragEvent): void {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over-card');
  }

  public onCardDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over-card');

    if (this.dragIndex === null || this.dragIndex === dropIndex) return;

    // Reordena o array
    const novaLista = [...this.imagens];
    const [removido] = novaLista.splice(this.dragIndex, 1);
    novaLista.splice(dropIndex, 0, removido);

    // Atualiza a ordem
    novaLista.forEach((img, i) => img.ordem = i + 1);

    this.reordenar.emit(novaLista);
    this.dragIndex = null;
  }

  // ─── Delegações para o pai ─────────────────────────────────────────

  public aoRemoverImagem(imagem: PecaImagem, index: number): void {
    this.removerImagem.emit({ imagem, index });
  }

  public aoDefinirPrincipal(imagem: PecaImagem, index: number): void {
    this.definirPrincipal.emit({ imagem, index });
  }
}
