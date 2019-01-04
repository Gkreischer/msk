import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PecaParaCadastro } from './../../compartilhados/cadastroPeca';
import { CrudService } from './../../services/crud.service';
import { Observable } from 'rxjs';
import { Categoria } from './../../compartilhados/categoria';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-cdpeca',
  templateUrl: './cdpeca.component.html',
  styleUrls: ['./cdpeca.component.css']
})
export class CdpecaComponent implements OnInit {

  constructor(private fb: FormBuilder, private modalService: NgbModal,
    private crud: CrudService, private router: ActivatedRoute) {
    document.body.style.background = 'linear-gradient(to bottom, #aebfbc 22%,#99afab 33%,#8ea6a2 50%,#829d98 67%,#4e5c5a 82%,#0e0e0e 100%)';
  }

  formCadastroPeca: FormGroup = null;
  dadosPeca: PecaParaCadastro;

  formCategoria: FormGroup = null;
  categorias = [];

  sucesso: boolean = false;
  erro;
  msg: string = null;
  id: string = null;
  ngOnInit() {
    this.montaForm();
    this.leCategorias();
    this.pegaIdEAtualizaForm();
  }

  montaForm() {
    this.formCadastroPeca = this.fb.group({
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      categoria: ['', Validators.required],
      preco: ['', Validators.required],
      linkImagem: ['', Validators.required],
      detalhes: ['', Validators.required]
    });

    this.formCategoria = this.fb.group({
      categoria: ['',Validators.required]
    });

  }

  pegaIdEAtualizaForm(){
    this.router.params.subscribe((params) => {
      this.id = params.id;
      if(this.id){
        console.log(`Id recebido ${this.id}`);
        this.crud.leRegistroEspecifico('/produtos', this.id).subscribe((data) => {
          console.table(`Peca da id recebida ${data}`);
          this.formCadastroPeca.patchValue(data);
        }, error => {
          this.erro = error;
          console.log(this.erro);
        });
      } else {
        console.log(`Nenhum id na rota`);
      }
    });
  }

  enviaForm() {
    this.dadosPeca = this.formCadastroPeca.value;
    console.table(this.dadosPeca);
    
    this.crud.criaRegistro('/produtos', this.dadosPeca).subscribe((data) => {
      this.msg = 'Peca criada com sucesso';
      this.sucesso = true;
      console.log('Peca criada com sucesso');
    }, error => {
      this.erro = error;
      console.log('Erro ao criar a peça');
    });
  }

  leCategorias() {
    this.crud.leRegistro('/categoria').subscribe((categorias) => {
      this.categorias = categorias;
    }, error => {
      this.erro = error;
    });
  }

  cadastraCategoria() {
    this.crud.criaRegistro('/categoria', this.formCategoria.value).subscribe((data) => {
      console.log('Categoria adicionada globalmente');
      this.categorias.push(this.formCategoria.value);
      this.modalService.dismissAll();
    }, error => {
      this.erro = error;
    });
  }

  exibeModalCadastroCategoria(cadastroCategoriaModal) {
    this.modalService.open(cadastroCategoriaModal, { centered: true });
  }



}
