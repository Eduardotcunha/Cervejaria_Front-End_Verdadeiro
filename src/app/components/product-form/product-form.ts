// src/app/components/product-form/product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product'; // CONFIRME se é 'product.service' ou 'product'
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
// IMPORTS ESSENCIAIS PARA EDIÇÃO/ROTEAMENTO
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; 
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs'; 

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductFormComponent implements OnInit {
  
  productForm!: FormGroup; 
  isEditMode: boolean = false; 
  productId: number | null = null; 

  // Injetar FormBuilder, Service e os serviços de Roteamento
  constructor(
    private fb: FormBuilder, // Necessário para initForm
    private productService: ProductService,
    private route: ActivatedRoute, 
    private router: Router 
  ) { }

  ngOnInit(): void {
    // 1. INICIALIZA O FORMULÁRIO (CORRIGINDO O ERRO DE PROPRIEDADE)
    this.initForm(); 
    // 2. ATIVA A LÓGICA DE EDIÇÃO/CRIAÇÃO
    this.checkEditModeAndLoadData();
  }

  /**
   * Inicializa o FormGroup com os FormControls e suas validações.
   */
  initForm(): void {
    this.productForm = this.fb.group({
      id: [null], 
      name: ['', Validators.required], 
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]], 
      stock: [0, [Validators.required, Validators.min(0)]], 
      // Campo aninhado para o tipo de cerveja
      beerStyle: this.fb.group({
        id: [1, Validators.required],
        name: ['IPA'], // Mantido para exibição, mas simplificado no onSubmit
        description: ['India Pale Ale']
      })
    });
  }

  /**
   * Implementa a lógica para carregar o produto em modo edição (via ID da rota).
   */
  checkEditModeAndLoadData(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        
        if (idParam) {
          this.isEditMode = true;
          this.productId = +idParam; 
          // Chama o serviço HTTP para buscar o produto
          return this.productService.getProductById(this.productId);
        } else {
          this.isEditMode = false;
          return of(null); // Modo de cadastro
        }
      })
    ).subscribe(product => {
      if (product) {
        // Preenche o formulário com os dados do produto buscados
        this.productForm.patchValue(product);
      }
    });
  }

  /**
   * Lógica de submissão: Envia POST (Criação) ou PUT (Edição).
   */
  onSubmit(): void {
    if (this.productForm.valid) {
      let productData: Product = this.productForm.value;

      // CORREÇÃO CRUCIAL: Simplificar o objeto beerStyle para o Backend
      if (productData.beerStyle && productData.beerStyle.id) {
          // O Backend geralmente espera apenas o ID para a criação/edição
          productData.beerStyle = { id: productData.beerStyle.id } as any; 
      } else {
          console.error("O tipo de cerveja é obrigatório. Formulário Inválido.");
          return;
      }
      
      let saveObservable: Observable<Product>; 

      if (this.isEditMode) {
        console.log('Atualizando Produto:', productData.name);
        saveObservable = this.productService.updateProduct(productData);
      } else {
        console.log('Cadastrando Novo Produto:', productData.name);
        saveObservable = this.productService.createProduct(productData);
      }

      // CHAMADA HTTP REAL E TRATAMENTO DA RESPOSTA
      saveObservable.subscribe({
        next: () => {
          console.log(`Produto ${this.isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
        
        // 1. Navega para a lista de produtos
        this.router.navigate(['/products']).then(() => {
            
            // 2. FORÇA A RECARGA DA PÁGINA:
            // Isso força o Angular a re-executar o ngOnInit do componente de lista
            window.location.reload(); 
        });
        },
        error: (err) => {
          console.error('Erro ao salvar produto:', err);
          alert(`Falha ao salvar produto. Verifique o console: ${err.status}`);
        }
      });
      
    } else {
      this.productForm.markAllAsTouched();
      console.error('Formulário Inválido!');
    }
  }
}