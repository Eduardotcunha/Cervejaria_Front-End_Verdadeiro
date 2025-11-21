// src/app/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product'; // <-- CORREÇÃO: Usando .service
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, NavigationEnd, Router } from '@angular/router'; // <-- NOVO IMPORT para Router
import { filter } from 'rxjs/operators'; // <-- NOVO IMPORT para resolver o problema de recarga

@Component({
  selector: 'app-product-list',
  standalone: true,
  // Adiciona o RouterLink para funcionar no HTML
  imports: [CommonModule, RouterLink, ReactiveFormsModule], 
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; // Array para armazenar os produtos

  // Injeção de dependência: ProductService e Router
  constructor(
    private productService: ProductService,
    private router: Router // <-- NOVO SERVIÇO INJETADO
  ) { }

  ngOnInit(): void {
    // 1. CARGA INICIAL
    this.loadProducts();
    
    // 2. CORREÇÃO: Lógica para recarregar a lista ao navegar
    // Isso resolve o problema de precisar dar Ctrl+R
    this.router.events.pipe(
      // Filtra apenas eventos de conclusão de navegação
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Recarrega se a URL for a lista de produtos
      if (event.urlAfterRedirects === '/products') {
        this.loadProducts(); 
      }
    });
  }

  /**
   * Busca a lista de produtos no Backend.
   */
  loadProducts(): void {
    this.productService.getProducts().subscribe({
        next: (data: Product[]) => {
          this.products = data;
          console.log('Produtos carregados:', this.products);
        },
        error: (error) => {
          console.error('Erro ao carregar produtos:', error);
          // Adicionar lógica de tratamento de erro (ex: mostrar mensagem ao usuário)
        }
      });
  } 
  trackById(index: number, product: Product): number | undefined {
    return product.id;
  }

  /**
   * Implementação da Deleção: Chama o DELETE no serviço e remove da lista local.
   */
  deleteProduct(id: number | undefined): void {
    if (!id) {
      console.error('ID do produto não fornecido.');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o produto #${id}?`)) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log(`Produto #${id} excluído com sucesso.`);
          // Remove o produto da lista local para atualização imediata da interface
          this.products = this.products.filter(p => p.id !== id); 
        },
        error: (err) => {
          console.error(`Erro ao excluir produto #${id}:`, err);
          alert('Erro ao excluir produto. Verifique o console.');
        }
      });
    }
  }
  
  /**
   * Lógica do carrinho (apenas placeholder).
   */
  addToCart(product: Product): void {
    console.log('Produto adicionado ao carrinho (Ainda não implementado):', product.name); 
  }
}