export class ItemFinanceiroDTO{
    public numSeq!: number;
    public idPedido!: number;
    public nomeCliente!: string;
    public telefone!: string;
    public numParcela!: number;
    public totalParcelas!: number;
    public dataVencimento!: Date;
    public valorBruto!: number;
    public idFormaPagamento!: number;
    public formaPagamento!: string;
    public percentRetencao!: number;
    public valorRetencao!: number;
    public valorReceber!: number;
    public status!: number;
}