export class PecaImagem {
  public id!: number;
  public linkImagem!: string;  // ← deve ser linkImagem, não linkFoto
  public ordem!: number;
  public principal!: number;

  get isPrincipal(): boolean {
    return this.principal === 1;
  }
}
