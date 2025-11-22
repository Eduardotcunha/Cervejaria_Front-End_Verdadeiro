import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Adicionamos Router para navegação
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🛑 Necessário para [(ngModel)]
import { ProductService } from '../services/product';
import { CartService } from '../services/cart';
import { AuthService } from '../services/auth';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  // 🛑 Importe CommonModule, FormsModule, e as diretivas de Roteamento necessárias (RouterLink, etc.)
  imports: [CommonModule, FormsModule], 
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetailsComponent implements OnInit {
  
  product: Product | null = null;
  quantity: number = 1; // Variável para o binding de quantidade
  loading: boolean = true;
  errorMessage: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router, // Injete o Router
    private productService: ProductService,
    private cartService: CartService, 
    private authService: AuthService  
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idString = params.get('id');
      if (idString) {
        const productId = +idString;
        this.loadProduct(productId);
      } else {
        this.errorMessage = 'ID do produto não fornecido.';
        this.loading = false;
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
        // Define a quantidade mínima como 1
        this.quantity = 1;
      },
      error: (err) => {
        this.errorMessage = 'Produto não encontrado.';
        this.loading = false;
        console.error('Erro ao buscar produto:', err);
      }
    });
  }

  // ====================================================
  // 🛑 LÓGICA DE ADICIONAR AO CARRINHO
  // ====================================================
  addToCart(): void {
    if (!this.product) {
      alert('Erro: Produto não carregado.');
      return;
    }
    
    const userId = this.authService.getCurrentUserId();
    
    // 1. Verificar Autenticação
    if (userId === null) {
      alert('Você precisa estar logado para adicionar itens ao carrinho.');
      this.router.navigate(['/login']); // Redireciona para o login
      return;
    }

    // 2. Validação básica de quantidade e estoque
    const quantityToAdd = Math.max(1, this.quantity); // Garante que é no mínimo 1
    if (quantityToAdd > this.product.stock) {
        alert(`Não há estoque suficiente. Máximo disponível: ${this.product.stock}`);
        this.quantity = this.product.stock;
        return;
    }
    
    // 3. Chamada ao Serviço do Carrinho
    this.cartService.addItemToCart(userId, this.product.id, quantityToAdd).subscribe({
      next: (cartResponse) => {
        alert(`${quantityToAdd}x ${this.product!.name} adicionado ao carrinho com sucesso!`);
        // Opcional: Redirecionar para a página do carrinho
        // this.router.navigate(['/cart']);
      },
      error: (err) => {
        console.error('Erro ao adicionar ao carrinho:', err);
        alert('Falha ao adicionar ao carrinho. Verifique se o item já está no carrinho ou o estoque.');
      }
    });
  }

  // Métodos Públicos para o Template (para evitar erros de acesso 'private')
  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}