export class Cliente {
  public id!: number;
  public nome!: string;
  public email!: string;
  public telefone!: string;
  public dataNasc!: string;
  public cpf!: string;
  public cep!: string;
  public logradouro!: string;
  public numero!: string;
  public complemento!: string;
  public bairro!: string;
  public cidade!: string;
  public estado!: string;

  public resetEndereco(): void {
    this.cep = '';
    this.logradouro = '';
    this.numero = '';
    this.complemento = '';
    this.bairro = '';
    this.cidade ='';
    this.estado = '';
  }

  public reset(): void{
    this.nome = '';
    this.email = '';
    this.telefone = '';
    this.dataNasc = '';
    this.cep = '';
    this.logradouro = '';
    this.numero = '';
    this.complemento = '';
    this.bairro = '';
    this.cidade ='';
    this.estado = '';
}
}

