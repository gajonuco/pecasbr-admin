import { FormaPagamento } from "./FormaPagamento";
import { Pedido } from "./Pedido";

export class RegistroFinanceiro{
    pedido: Pedido;
    diaVencimento!: number;
    formaPagamento: FormaPagamento;
    totalParcelas!: number;

    public constructor(){
        this.pedido = new Pedido();
        this.formaPagamento = new FormaPagamento();
    }
}