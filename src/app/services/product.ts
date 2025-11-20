// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Usamos RxJS para simular chamadas assíncronas
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Dados mockados (simulação do backend)
  private mockProducts: Product[] = [
    { id: 1, name: 'IPA Artesanal', description: 'Uma IPA com notas cítricas.', price: 15.00, stock: 50, beerType: { id: 1, name: 'IPA', description: 'India Pale Ale' } },
    { id: 2, name: 'Lager Leve', description: 'Cerveja clara e refrescante.', price: 8.50, stock: 120, beerType: { id: 2, name: 'Lager', description: 'Baixa fermentação' } },
    { id: 3, name: 'Stout Cremosa', description: 'Escura com sabor de café e chocolate.', price: 18.00, stock: 30, beerType: { id: 3, name: 'Stout', description: 'Cerveja escura' } },
  ];

  constructor() { }

  /**
   * Obtém todos os produtos (simula uma chamada HTTP GET).
   * @returns Observable<Product[]>
   */
  getProducts(): Observable<Product[]> {
    // Na vida real: return this.http.get<Product[]>('/api/products');
    // Usamos 'of' para retornar os dados mockados como um Observable.
    return of(this.mockProducts);
  }

  // **TODO:** Adicionar métodos como getProductById, createProduct, updateProduct, deleteProduct
}