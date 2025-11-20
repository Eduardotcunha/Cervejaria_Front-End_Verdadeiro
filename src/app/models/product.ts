// src/app/models/product.ts
import { BeerType } from './beer-type';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  // O Produto referencia o Tipo de Cerveja
  beerType: BeerType;
}