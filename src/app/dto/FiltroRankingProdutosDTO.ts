export class FiltroRankingProdutosDTO {
    public dataInicio!: string;
    public dataFim!: string;
    public limiteProdutos!: number
    public ordenarPor: string = 'quantidade';
}