import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; 
import { HttpErrorResponse } from '@angular/common/http'; 
import { Subscription } from 'rxjs';

import { CartService } from '../services/cart';
import { AuthService } from '../services/auth';
import { Cart } from '../models/cart';

@Component({
  selector: 'app-header',
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {
  
  cartItemCount: number = 0;
  private cartSubscription: Subscription | undefined;
  
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.updateCartCount(); 
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin(); 
  }

  onLogout(): void {
    this.authService.logout();
    this.cartItemCount = 0;
    this.router.navigate(['/']); 
  }
  
  /**
   * 🛑 CORRIGIDO: Usa loadOrCreateCart para obter a contagem.
   */
  updateCartCount(): void {
    const userId = this.authService.getCurrentUserId();

    if (userId !== null) {
      this.cartService.loadOrCreateCart(userId).subscribe({
        next: (cart: Cart) => {
          // Calcula a contagem de itens de forma segura
          this.cartItemCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        },
        error: (err: HttpErrorResponse) => { 
          this.cartItemCount = 0;
          console.error('Erro ao buscar a contagem do carrinho:', err);
        }
      });
    } else {
      this.cartItemCount = 0;
    }
  }
  
  ngOnDestroy(): void {
      if (this.cartSubscription) {
          this.cartSubscription.unsubscribe();
      }
  }
}