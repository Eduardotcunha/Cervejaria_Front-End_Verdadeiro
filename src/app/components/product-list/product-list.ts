import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { ProductService } from '../../services/product';
import { AuthService } from '../../services/auth'; // <<<< NOVO IMPORT
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  // Certifique-se de que RouterLink está importado
  imports: [CommonModule, RouterLink], 
  templateUrl: './product-list.html', // Ou o nome do seu template
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isAdmin: boolean = false; // <<<< NOVO ESTADO

  // Injetar AuthService
  constructor(
    private productService: ProductService,
    private authService: AuthService // <<<< NOVO SERVIÇO INJETADO
  ) { }

  ngOnInit(): void {
    // 1. Verificar o Role do Usuário Logado
    this.isAdmin = this.authService.isAdmin(); 
    
    // 2. Carregar a lista de produtos
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
      }
    });
  }

  // Método de exclusão (necessário para o botão de Excluir)
  deleteProduct(id: number): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log(`Produto ID ${id} excluído com sucesso.`);
          // Remove o item da lista localmente
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Erro ao deletar produto:', err);
          alert('Falha ao excluir produto. Verifique se você tem permissão.');
        }
      });
    }
  }
  
  // Função de track para otimização (opcional, mas boa prática)
  trackById(index: number, product: Product): number | undefined {
    return product.id;
  }
}