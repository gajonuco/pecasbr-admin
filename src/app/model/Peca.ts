import { CategoriaPeca } from "./CategoriaPeca";
import { PecaImagem } from "./PecaImagem";
import { PecaVariacao } from "./PecaVariacao";

export class Peca {
    public id!: number;
    public nome!: string;
    public detalhe!: string;
    public linkFoto!: string;
     public imagens: PecaImagem[] = [];  // novo campo
    public precoPromo!: number;
    public prontaEntrega!: number;
    public preco!: number;
    public disponivel!: number;
    public destaque!: number;
    public quantidadeEstoque!: number;
    public estoqueMinimo!: number;
    public estoqueCritico!: number;
    public categoriaPeca!: CategoriaPeca;
    public corUnica: boolean = false;
    public tamanhoUnico: boolean = false;
    public variacoes: PecaVariacao[] = [];


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

        get imagemPrincipal(): string {
        const principal = this.imagens?.find(i => i.principal === 1);
        return principal?.linkImagem ?? this.linkFoto ?? '';
    }
}
