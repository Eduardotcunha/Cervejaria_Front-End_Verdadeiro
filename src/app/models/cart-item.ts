// src/app/models/cart-item.ts
import { Product } from './product';

export interface CartItem {
  id: number;
  quantity: number;
  subtotal: number;
  // O item precisa referenciar o Produto
  product: Product;
}