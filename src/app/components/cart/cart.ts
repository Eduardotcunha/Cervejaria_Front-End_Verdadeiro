import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'; 

import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Cart } from '../../models/cart'; 
import { CartItem } from '../../models/cart-item';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterModule], 
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  
  cart: Cart | null = null;
  userId: number | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  subtotal: number = 0;
  totalItems: number = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    
    if (this.userId === null) {
      alert('Você precisa estar logado para ver o carrinho.');
      this.router.navigate(['/login']);
    } else {
      this.loadCart();
    }
  }

  loadCart(): void {
    if (this.userId !== null) {
      this.loading = true;
      this.errorMessage = null;

      // 🛑 CORREÇÃO: Chama o método loadOrCreateCart
      this.cartService.loadOrCreateCart(this.userId).subscribe({
        next: (cartData: Cart) => { 
          this.cart = cartData;
          this.calculateTotals();
          this.loading = false;
        },
        error: (err: HttpErrorResponse | any) => { 
          this.errorMessage = 'Erro ao carregar o carrinho. Verifique o servidor.';
          this.loading = false;
          console.error('Erro fatal:', err);
        }
      });
    }
  }
  
  calculateTotals(): void {
    this.subtotal = 0;
    this.totalItems = 0;
    
    if (this.cart && this.cart.items) {
      this.subtotal = this.cart.items.reduce((sum, item) => 
        sum + ((item.product?.price || 0) * (item.quantity || 0)), 0
      );
      this.totalItems = this.cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }
  }
  
  onUpdateQuantity(item: CartItem): void {
    if (this.userId === null || item.quantity <= 0) return;
    
    this.loading = true; 
    
    this.cartService.updateItemQuantity(this.userId, item.product.id, item.quantity).subscribe({
      next: (updatedCart: Cart) => { 
        this.cart = updatedCart;
        this.calculateTotals();
        this.loading = false;
      },
      error: (err: HttpErrorResponse | any) => { 
        alert('Não foi possível atualizar a quantidade.');
        this.loading = false;
        console.error('Erro ao atualizar quantidade:', err);
        this.loadCart();
      }
    });
  }

  onRemoveItem(productId: number): void {
    if (this.userId === null || !confirm('Tem certeza que deseja remover este item?')) return;
    
    this.loading = true;

    this.cartService.removeItemFromCart(this.userId, productId).subscribe({
      next: (updatedCart: Cart) => { 
        this.cart = updatedCart;
        this.calculateTotals();
        this.loading = false;
      },
      error: (err: HttpErrorResponse | any) => { 
        alert('Não foi possível remover o item.');
        this.loading = false;
        console.error('Erro ao remover item:', err);
      }
    });
  }

  onCheckout(): void {
    if (this.userId === null || !this.cart || this.cart.items.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    this.loading = true;
    this.errorMessage = null;

    this.cartService.checkoutAndClearCart(this.userId).subscribe({
        next: (clearedCart: Cart) => { 
            alert('Compra finalizada com sucesso! O carrinho foi esvaziado.');
            this.cart = clearedCart; 
            this.calculateTotals();
            this.loading = false;
        },
        error: (err: HttpErrorResponse | any) => { 
            this.errorMessage = 'Erro ao finalizar a compra. Tente novamente.';
            this.loading = false;
            console.error('Erro no checkout:', err);
        }
    });
  }
}