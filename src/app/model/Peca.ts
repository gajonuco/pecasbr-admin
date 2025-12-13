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
    public quantidadeEstoque!: number;
    public estoqueMinimo!: number;
    public estoqueCritico!: number;
    public categoriaPeca!: CategoriaPeca;


    // Getters para usar no template
    get disponivelBool(): boolean {
        return this.disponivel === 1;
    }

    set disponivelBool(value: boolean) {
        this.disponivel = value ? 1 : 0;
    }

    get destaqueBool(): boolean {
        return this.destaque === 1;
    }

    set destaqueBool(value: boolean) {
        this.destaque = value ? 1 : 0;
    }

    get prontaEntregaBool(): boolean {
        return this.prontaEntrega === 1;
    }

    set prontaEntregaBool(value: boolean) {
        this.prontaEntrega = value ? 1 : 0;
    }
}