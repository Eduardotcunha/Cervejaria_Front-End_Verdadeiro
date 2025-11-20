// src/app/models/cart.ts
import { CartItem } from "./cart-item";
export interface Cart {
  id: number;
  total: number;
  // O carrinho geralmente tem uma lista de itens do carrinho
  items: CartItem[];
}