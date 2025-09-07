import { Cliente } from "./Cliente";
import { ItemPedido } from "./ItemPedido";

/*Esse objeto Pedido funciona apenas como um carrinho de compras */
export class Pedido{
    public id!: number;
    public itensPedido!: ItemPedido[];
    public valorTotal!: number;
    public observacoes!: string;
    public cliente!: Cliente;
    public status!: number;
}