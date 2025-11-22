import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';    
import { Product } from '../../models/product';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  
  products: Product[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService, 
    private authService: AuthService  
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({ 
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar lista de produtos.';
        this.loading = false;
        console.error('Erro:', err);
      }
    });
  }

  // ====================================================
  // 🛑 CORREÇÃO APLICADA AQUI
  // ====================================================

  /**
   * Verifica se o usuário atual tem permissão de administrador.
   */
  isAdmin(): boolean {
    return this.authService.isAdmin(); // 🛑 CORRIGIDO
  }

  /**
   * Função para rastrear produtos por ID no *ngFor.
   */
  trackById(index: number, product: Product): number {
    return product.id;
  }
  
  /**
   * Exclui um produto, chamando o ProductService.
   */
  deleteProduct(productId: number | undefined): void {
    if (!productId || !confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        alert('Produto excluído com sucesso!');
        this.products = this.products.filter(p => p.id !== productId);
      },
      error: (err) => {
        alert('Erro ao excluir o produto. Verifique suas permissões.');
        console.error('Erro de exclusão:', err);
      }
    });
  }


  // ====================================================
  // FUNÇÃO PARA ADICIONAR ITEM À PARTIR DA LISTA
  // ====================================================
  addToCart(product: Product): void {
    const userId = this.authService.getCurrentUserId();
    
    if (userId === null) {
      alert('Você precisa estar logado para adicionar produtos ao carrinho.');
      return;
    }

    if (product.stock === 0) {
        alert('Produto esgotado!');
        return;
    }
    
    const quantity = 1; 

    this.cartService.addItemToCart(userId, product.id, quantity).subscribe({
      next: (cartResponse) => {
        alert(`1x ${product.name} adicionado ao carrinho!`);
      },
      error: (err) => {
        console.error('Erro ao adicionar ao carrinho:', err);
        alert('Falha ao adicionar ao carrinho. Tente novamente.');
      }
    });
  }

  // Método auxiliar para o template
  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}