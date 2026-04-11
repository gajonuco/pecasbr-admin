// soma-estoque.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { PecaVariacao } from '../../model/PecaVariacao';


@Pipe({ name: 'somaEstoque', standalone: true })
export class SomaEstoquePipe implements PipeTransform {
  transform(variacoes: PecaVariacao[] | null | undefined): number {
    if (!variacoes?.length) return 0;
    return variacoes.reduce((acc, v) => acc + (v.quantidadeEstoque ?? 0), 0);
  }
}

