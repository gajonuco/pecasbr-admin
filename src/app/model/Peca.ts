import { CategoriaPeca } from "./CategoriaPeca";

export class Peca {
    public id!: number;
    public nome!: string;
    public detalhe!: string;
    public linkFoto!: string;
    public precoPromo!: number;
    public prontaEntrega!: number;
    public preco!: number;
    public disponivel!: number;
    public destaque!: number;
    public categoriaPeca!: CategoriaPeca;
}
 