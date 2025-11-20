// src/app/components/product-form/product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importar módulos reativos
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common'; // Para usar o ngIf/ngFor, se necessário

@Component({
  selector: 'app-product-form',
  // Se for standalone, adicione os imports necessários aqui:
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  // -----------------------------------------------------------
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductFormComponent implements OnInit {
  
  productForm!: FormGroup; // ! indica que será inicializada em ngOnInit
  isEditMode: boolean = false; // Flag para saber se estamos editando ou cadastrando

  // Injetar o FormBuilder e o Service
  constructor(
    private fb: FormBuilder, 
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    // 1. Inicializa o formulário
    this.initForm();

    // 2. Simulação de Modo Edição (apenas para testar o carregamento)
    // Em um cenário real, você buscará o ID da rota (Router)
    // if (ID_EXISTE_NA_ROTA) {
    //   this.loadProductForEdit(ID);
    // }
  }

  /**
   * Inicializa o FormGroup com os FormControls e suas validações.
   */
  initForm(): void {
    this.productForm = this.fb.group({
      // ID é opcional (auto-gerado ou só para edição)
      id: [null], 
      
      name: ['', Validators.required], // Campo obrigatório
      description: ['', [Validators.required, Validators.minLength(10)]],
      
      // O campo Price deve ser um número positivo
      price: [0, [Validators.required, Validators.min(0.01)]], 
      stock: [0, [Validators.required, Validators.min(0)]], 
      
      // Simulação do BeerType (em um sistema real seria um dropdown com ID)
      beerType: this.fb.group({
        id: [1, Validators.required],
        name: ['IPA'],
        description: ['India Pale Ale']
      })
    });
  }

  /**
   * Lógica de submissão do formulário.
   */
  onSubmit(): void {
    if (this.productForm.valid) {
      // Cria uma cópia do objeto do formulário
      const productData: Product = this.productForm.value;

      if (this.isEditMode) {
        console.log('Atualizando Produto:', productData);
        // TODO: Chamar productService.updateProduct(productData);
      } else {
        console.log('Cadastrando Novo Produto:', productData);
        // TODO: Chamar productService.createProduct(productData);
      }
      
      // Após sucesso, geralmente redirecionamos ou limpamos o formulário
      this.productForm.reset(); 
    } else {
      // Marca todos os campos como "touched" para exibir mensagens de erro
      this.productForm.markAllAsTouched();
      console.error('Formulário Inválido!');
    }
  }

  // TODO: Adicionar um método para carregar o produto no modo edição
  // loadProductForEdit(id: number): void { ... }
}