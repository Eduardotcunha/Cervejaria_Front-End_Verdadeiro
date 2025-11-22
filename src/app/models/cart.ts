// src/app/models/cart.ts
import { User } from './user';
import { CartItem } from './cart-item';

export interface Cart {
    id: number;
    user: User; // O carrinho pertence a um usuário
    items: CartItem[]; // A lista de itens no carrinho
    total: number; // O preço total do carrinho
}