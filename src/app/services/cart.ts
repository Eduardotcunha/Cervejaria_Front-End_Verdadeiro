import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs'; // BehaviorSubject adicionado
import { catchError, map, switchMap, tap } from 'rxjs/operators'; // tap adicionado
import { Cart} from '../models/cart';
import { AuthService } from './auth'; 
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private apiUrl = 'http://localhost:8080/cart';
  
  // 🛑 Variável de cache em memória
  private _currentCart: Cart | null = null; 

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) { }

  /**
   * 🛑 NOVO FLUXO: Tenta usar o cache. Se não houver, faz a requisição e armazena o resultado.
   */
  loadOrCreateCart(userId: number): Observable<Cart> {
    
    // 1. Se o carrinho já estiver em cache, retorne-o imediatamente.
    if (this._currentCart && this._currentCart.user && this._currentCart.user.id === userId) {
        return of(this._currentCart);
    }
    
    // 2. Se não estiver em cache, faça a requisição completa (busca/criação)
    return this.http.get<Cart[]>(`${this.apiUrl}`).pipe(
      map(allCarts => {
        const userCart = allCarts.find(cart => cart.user && cart.user.id === userId);
        
        if (!userCart) {
            throw new Error('CART_NOT_FOUND');
        }
        return userCart;
      }),
      catchError(error => {
          if (error.message === 'CART_NOT_FOUND' && userId !== null) {
              console.log('Carrinho não encontrado. Criando um novo no servidor...');
              return this.createEmptyCart(userId);
          }
          return throwError(() => new Error('Falha grave ao carregar ou criar o carrinho.'));
      }),
      // 3. 🛑 Depois de buscar ou criar, armazena no cache antes de retornar.
      tap(cart => {
          this._currentCart = cart;
      })
    );
  }
  
  /**
   * Cria um carrinho vazio no servidor
   */
  createEmptyCart(userId: number): Observable<Cart> {
    const newCartPayload = { 
        user: { id: userId }, 
        items: [] 
    };

    return this.http.post<Cart>(`${this.apiUrl}`, newCartPayload).pipe(
        // 🛑 Armazena em cache após a criação
        tap(cart => {
            this._currentCart = cart;
        }),
        catchError(err => {
            console.error('Erro ao criar carrinho:', err);
            return throwError(() => new Error('Falha ao criar um novo carrinho.'));
        })
    );
  }

  // 🛑 Função auxiliar para atualizar o carrinho no cache após uma operação POST
  private updateCartCache(cart: Cart): Cart {
      this._currentCart = cart;
      return cart;
  }


  addItemToCart(userId: number, productId: number, quantity: number): Observable<Cart> {
    return this.loadOrCreateCart(userId).pipe(
        switchMap(currentCart => {
            // ... (Lógica de modificação de itens) ...
            const existingItem = currentCart.items.find(item => item.product.id === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                const newProduct: Product = { id: productId } as Product;
                const newItem: CartItem = { product: newProduct, quantity: quantity } as CartItem;
                currentCart.items.push(newItem);
            }
            const updatedPayload = { 
                user: { id: userId }, 
                items: currentCart.items.map(item => ({
                    product: { id: item.product.id },
                    quantity: item.quantity
                }))
            };
            return this.http.post<Cart>(`${this.apiUrl}`, updatedPayload);
        }),
        tap(cart => this.updateCartCache(cart)), // 🛑 Atualiza o cache
        catchError(error => {
            console.error('Erro ao adicionar item (via POST /cart):', error);
            return throwError(() => new Error('Falha ao adicionar produto ao carrinho.'));
        })
    );
  }
  
  updateItemQuantity(userId: number, productId: number, quantity: number): Observable<Cart> {
    return this.loadOrCreateCart(userId).pipe(
        switchMap(currentCart => {
            // ... (Lógica de modificação de itens) ...
            const existingItem = currentCart.items.find(item => item.product.id === productId);
            if (existingItem) {
                existingItem.quantity = quantity;
            }
            const updatedPayload = { 
                user: { id: userId }, 
                items: currentCart.items.map(item => ({
                    product: { id: item.product.id },
                    quantity: item.quantity
                }))
            };
            return this.http.post<Cart>(`${this.apiUrl}`, updatedPayload);
        }),
        tap(cart => this.updateCartCache(cart)), // 🛑 Atualiza o cache
        catchError(error => {
            console.error('Erro ao atualizar quantidade (via POST /cart):', error);
            return throwError(() => new Error('Falha ao atualizar a quantidade do carrinho.'));
        })
    );
  }

  removeItemFromCart(userId: number, productId: number): Observable<Cart> {
    return this.loadOrCreateCart(userId).pipe(
        switchMap(currentCart => {
            currentCart.items = currentCart.items.filter(item => item.product.id !== productId);
            
            const updatedPayload = { 
                user: { id: userId }, 
                items: currentCart.items.map(item => ({
                    product: { id: item.product.id },
                    quantity: item.quantity
                }))
            };

            return this.http.post<Cart>(`${this.apiUrl}`, updatedPayload);
        }),
        tap(cart => this.updateCartCache(cart)), // 🛑 Atualiza o cache
        catchError(error => {
            console.error('Erro ao remover item (via POST /cart):', error);
            return throwError(() => new Error('Falha ao remover item do carrinho.'));
        })
    );
  }
  
  checkoutAndClearCart(userId: number): Observable<Cart> {
      const emptyCartPayload = { 
          user: { id: userId }, 
          items: [] 
      };
      return this.http.post<Cart>(`${this.apiUrl}`, emptyCartPayload).pipe(
          tap(cart => this._currentCart = cart), // 🛑 Atualiza cache com o carrinho vazio retornado
          catchError(error => {
              console.error('Erro ao finalizar e limpar o carrinho:', error);
              return throwError(() => new Error('Falha ao finalizar a compra.'));
          })
      );
  }
}