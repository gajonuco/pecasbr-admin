export class PecaVariacao {
  id?: number;
  cor: string = '';
  hexCode: string = '#000000';
  tamanho: string = '';
  quantidadeEstoque: number = 0;
  sku?: string;
}

export class SalvarVariacoesDTO {
  corUnica: boolean = false;
  tamanhoUnico: boolean = false;
  variacoes: PecaVariacao[] = [];
}

