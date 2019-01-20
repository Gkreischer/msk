import { Component, OnInit } from '@angular/core';
import { CrudService } from './../../services/crud.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Configuracao } from './../../compartilhados/configuracao';
import { ConfigEmail } from './../../compartilhados/configEmail';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css']
})
export class ConfiguracoesComponent implements OnInit {

  constructor(private crud: CrudService, private modalService: NgbModal, private fb: FormBuilder) {
    window.document.body.style.backgroundColor = '#F45D01';

  }

  formConfiguracaoDadosLoja: FormGroup = null;
  configuracaoDadosLoja: Configuracao = null;
  erro: string;
  id: string = null;
  msg: string = null;

  formConfigEmail: FormGroup = null;
  configEmail: ConfigEmail = null;
  ngOnInit() {
    this.montaFormConfig();
    this.verificaInfoDadosLoja();
  }


  montaFormConfig() {
    this.formConfiguracaoDadosLoja = this.fb.group({
      nomeFantasia: ['', Validators.required],
      cnpj: ['', Validators.required],
      site: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      cep: ['', Validators.required]
    });

    this.formConfigEmail = this.fb.group({
      servidor: ['', Validators.required],
      porta: ['', Validators.required],
      conta: ['', Validators.required],
      senha: ['', Validators.required],
      tls: ['', Validators.required]
    });
  }

  verificaInfoDadosLoja() {
    this.crud.leRegistro('/configuracaos').subscribe((data) => {
      if (data.length != 0) {
        console.log('Dados da loja já configurados', data.length);
        this.msg = `Dados da loja já configurados`;
        this.id = data[0].id;
        console.log(data);
        this.formConfiguracaoDadosLoja.patchValue(data[0]);
      } else {
        console.log('Sem dados cadastrados ainda na loja');
        alert('Por favor, cadastre suas informações primeiramente');
      }
    }, error => {
      this.erro = error;
    })
  }

  enviaFormConfig() {
    this.configuracaoDadosLoja = this.formConfiguracaoDadosLoja.value;

    console.table(this.configuracaoDadosLoja);

    if (this.id != undefined) {
      console.log('Atualizando dados loja', this.formConfiguracaoDadosLoja.value);
      this.crud.atualizaRegistro('/configuracaos', this.id, this.configuracaoDadosLoja).subscribe((data) => {
        console.log('Foram atualizadas');
        this.msg = `Dados da loja atualizados`;
        this.formConfiguracaoDadosLoja.patchValue(this.configuracaoDadosLoja);
        localStorage.setItem('nomeDaLoja', this.configuracaoDadosLoja.nomeFantasia);
      }, error => {
        console.log('Não foi possível atualizar as configurações da loja');
        this.erro = error;
      });
    } else {
      console.log('Registrando loja pela primeira vez');
      this.crud.criaRegistro('/configuracaos', this.configuracaoDadosLoja).subscribe((data) => {
        console.log('Configuração criada com sucesso');
        this.msg = `Dados da loja configurados com sucesso.`
        this.formConfiguracaoDadosLoja.patchValue(this.configuracaoDadosLoja);
        localStorage.setItem('nomeDaLoja', this.configuracaoDadosLoja.nomeFantasia);
      }, error => {
        this.erro = error;
        console.log('Não foi posssivel gravar as informações', error.messsage)
      });
    }
  }
}