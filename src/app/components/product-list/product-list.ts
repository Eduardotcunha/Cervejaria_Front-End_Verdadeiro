// src/app/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CommonModule } from '@angular/common'; // <-- ADICIONAR ESTA IMPORTAÇÃO
@Component({
  selector: 'app-product-list',
  standalone: true, // <-- Assumindo que você está usando standalone
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; // Array para armazenar os produtos

  // Injeção de dependência do ProductService
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    // Chama o método do Service e se inscreve no Observable para receber os dados
    this.productService.getProducts()
      .subscribe(
        (data: Product[]) => {
          this.products = data;
          console.log('Produtos carregados:', this.products);
        },
        (error) => {
          console.error('Erro ao carregar produtos:', error);
          // Adicionar lógica de tratamento de erro (ex: mostrar mensagem ao usuário)
        }
        
      );
      
  }
  

  addToCart(product: Product): void {
console.log('Produto adicionado ao carrinho (Ainda não implementado):', product.name);  }
}