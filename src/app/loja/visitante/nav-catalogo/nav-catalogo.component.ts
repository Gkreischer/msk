import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { Login } from './../../compartilhados/login';
import { DadosEmpresa } from '../../compartilhados/dadosEmpresa';

import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { CrudService } from '../../services/crud.service';

@Component({
  selector: 'app-nav-catalogo',
  templateUrl: './nav-catalogo.component.html',
  styleUrls: ['./nav-catalogo.component.css'],
  providers: [NgbDropdownConfig]
})
export class NavCatalogoComponent implements OnInit {

  constructor(private modalService: NgbModal, private fb: FormBuilder,
    private router: Router, config: NgbDropdownConfig, private loginService: LoginService, private crud: CrudService) {
    config.placement = 'top-left';
    let token = this.loginService.estaLogado();

    if (token) {
      console.log('Token armazenado localmente');
      this.eAdministrador = true;
    } else {
      console.log('Usuario nao logado.')
    }
  }

  ngOnInit() {
    this.montaForm();
    this.exibeDadosLoja();
  }

  formLogin: FormGroup;
  dadosUsuario: Login;
  eAdministrador: boolean = false;
  dadosDaLoja: DadosEmpresa = null;
  msg: string = null;
  erro = null;
  tituloLoja: string = null;

  montaForm() {
    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  enviaForm(usuario: string, senha: string) {
    this.dadosUsuario = this.formLogin.value;

    this.loginService.login(this.dadosUsuario).subscribe((data) => {
      console.log(`Usuario autenticado ${JSON.stringify(data)}`);
      this.modalService.dismissAll();
      this.eAdministrador = true;

      this.pegaDadosLoja();

    }, error => {
      this.erro = error;
      console.log(error);
      this.eAdministrador = false;
    });
  }

  abreModalPainelAdm(conteudo) {
    this.modalService.open(conteudo, { centered: true});
  }

  deslogar() {
    this.loginService.logout();
    this.eAdministrador = false;
  }

  pegaDadosLoja() {

    this.tituloLoja = localStorage.getItem('nomeLoja');

    if (this.tituloLoja === null) {
      this.crud.leRegistro('/configuracaos').subscribe((data) => {
        if (data.length != 0) {

          localStorage.setItem('nomeLoja', data[0].nomeFantasia);
          this.tituloLoja = localStorage.getItem('nomeLoja');

        } else {
          alert('Primeiro configure sua loja');
          this.router.navigate(['/configuracoes']);
        }
      }, error => {
        this.erro = error;
        console.log(this.erro);
      });
    } else {
      this.tituloLoja = localStorage.getItem('nomeLoja');
    }
  }

  exibeDadosLoja() {
    
    this.tituloLoja = localStorage.getItem('nomeLoja');
  }

}
