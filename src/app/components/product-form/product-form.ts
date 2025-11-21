// src/app/components/product-form/product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product'; // Confirme o nome do arquivo
import { BeerStyleService } from '../../services/beerstyle'; // <<<< NOVO SERVIÇO IMPORTADO
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; 
import { switchMap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs'; 

// Adicione a interface BeerStyle aqui ou importe-a do seu arquivo de modelos
interface BeerStyle {
  id: number | null;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  // O RouterLink é mantido caso você tenha botões de navegação no template
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './product-form.html', // Corrija seu HTML para usar beerStyle!
  styleUrls: ['./product-form.css']
})
export class ProductFormComponent implements OnInit {
  
  productForm!: FormGroup; 
  isEditMode: boolean = false; 
  productId: number | null = null; 

  // Injetar FormBuilder, Services e Roteamento
  constructor(
    private fb: FormBuilder, // Necessário para initForm
    private productService: ProductService,
    private beerStyleService: BeerStyleService, // <<<< NOVO SERVIÇO INJETADO
    private route: ActivatedRoute, 
    private router: Router 
  ) { }

  ngOnInit(): void {
    // 1. INICIALIZA O FORMULÁRIO (USANDO beerStyle)
    this.initForm(); 
    // 2. ATIVA A LÓGICA DE EDIÇÃO/CRIAÇÃO
    this.checkEditModeAndLoadData();
  }

  /**
   * Inicializa o FormGroup com os FormControls e suas validações.
   * Note: O 'id' do beerStyle é setado para null para forçar a criação se o usuário editar o nome.
   */
  initForm(): void {
    this.productForm = this.fb.group({
      id: [null], 
      name: ['', Validators.required], 
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]], 
      stock: [0, [Validators.required, Validators.min(0)]], 
      // Campo aninhado CORRIGIDO para 'beerStyle'
      beerStyle: this.fb.group({
        id: [null as number | null], // Deve ser null para indicar novo estilo (se o usuário digitar)
        name: ['', Validators.required], 
        description: ['']
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
   * * ESSA É A LÓGICA PRINCIPAL:
   * 1. Verifica se o BeerStyle já existe (tem ID).
   * 2. Se não tem ID, cria o BeerStyle via POST e obtém o novo ID.
   * 3. Usa o ID obtido para salvar o Produto.
   */
  onSubmit(): void {
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      console.error('Formulário Inválido!');
      return;
    }

    let productData: Product = this.productForm.value;
    let currentBeerStyle: BeerStyle = this.productForm.get('beerStyle')!.value;
    
    // Observable que emitirá o ID FINAL do BeerStyle
    let beerStyleIdObservable: Observable<number>;

    // 1. DECISÃO: BeerStyle precisa ser criado?
    if (currentBeerStyle.id && currentBeerStyle.id > 0) {
      // O BeerStyle já tem ID (ou veio da edição), usa o ID existente.
      beerStyleIdObservable = of(currentBeerStyle.id);
    } else {
      // 2. CRIAÇÃO: Cria o BeerStyle primeiro.
      console.log('Criando novo BeerStyle:', currentBeerStyle.name);
      
      // Enviamos o BeerStyle sem ID, e o Backend deve retornar o objeto com o ID gerado.
      beerStyleIdObservable = this.beerStyleService.createBeerStyle(currentBeerStyle).pipe(
        switchMap(newStyle => {
          if (newStyle.id) {
            return of(newStyle.id);
          }
          throw new Error('O Backend não retornou o ID do novo BeerStyle.');
        }),
        catchError(err => {
          console.error('Erro fatal ao criar BeerStyle:', err);
          alert('Falha ao criar o novo Estilo de Cerveja. Verifique o log do Backend.');
          return of(0); // Retorna 0 (ID inválida) para interromper o salvamento do Produto.
        })
      );
    }

    // 3. SALVAMENTO DO PRODUTO USANDO O ID OBTIDO
    beerStyleIdObservable.pipe(
      switchMap(finalBeerStyleId => {
        if (finalBeerStyleId <= 0) {
          // Se o BeerStyle falhou (ID <= 0), não tenta salvar o Produto.
          return of(null); 
        }
        
        // Prepara o JSON para o Product, enviando APENAS o ID do BeerStyle
        productData.beerStyle = { id: finalBeerStyleId } as any; 
        
        let saveObservable: Observable<Product>; 
        if (this.isEditMode) {
          console.log('Atualizando Produto:', productData.name);
          saveObservable = this.productService.updateProduct(productData);
        } else {
          console.log('Cadastrando Novo Produto:', productData.name);
          saveObservable = this.productService.createProduct(productData);
        }
        return saveObservable;
      })
    ).subscribe({
      next: (result) => {
        if (result) {
          console.log(`Produto ${this.isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
          this.router.navigate(['/products']).then(() => {
            // Força a recarga para garantir que a lista seja atualizada.
            window.location.reload(); 
          });
        }
      },
      error: (err) => {
        console.error('Erro ao salvar produto:', err);
        alert(`Falha ao salvar produto. Verifique o console: ${err.status}`);
      }
    });
  }
}