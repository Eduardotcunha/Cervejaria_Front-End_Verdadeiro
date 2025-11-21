// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
// 1. Importar o HttpClient
import { HttpClient } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  // 2. Ajuste a URL base da sua API de Produtos
  private apiUrl = 'http://localhost:8080/products'; 

  // 3. Injetar o HttpClient no construtor
  constructor(private http: HttpClient) { } 

  // =======================================================
  // READ: Obter todos os Produtos (GET /api/products)
  // =======================================================
  getProducts(): Observable<Product[]> {
    console.log('Buscando todos os produtos em:', this.apiUrl);
    // O HttpClient.get faz a requisição e mapeia a resposta para um array de Product[]
    return this.http.get<Product[]>(this.apiUrl);
  }

  // =======================================================
  // READ: Obter Produto por ID (GET /api/products/{id})
  // =======================================================
  getProductById(id: number): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Buscando produto específico em:', url);
    return this.http.get<Product>(url);
  }

  // =======================================================
  // CREATE: Cadastrar Novo Produto (POST /api/products)
  // =======================================================
  createProduct(product: Product): Observable<Product> {
    console.log('Enviando novo produto para:', this.apiUrl, product);
    // Envia o objeto 'product' para a API.
    return this.http.post<Product>(this.apiUrl, product);
  }

  // =======================================================
  // UPDATE: Atualizar Produto Existente (PUT /api/products/{id})
  // =======================================================
  updateProduct(product: Product): Observable<Product> {
    // É crucial ter o ID do produto para a atualização
    const url = `${this.apiUrl}/${product.id}`;
    console.log('Atualizando produto em:', url, product);
    // Envia o objeto atualizado (product) via PUT.
    return this.http.put<Product>(url, product);
  }

  // =======================================================
  // DELETE: Excluir Produto (DELETE /api/products/{id})
  // =======================================================
  deleteProduct(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Deletando produto em:', url);
    // Retorna void porque geralmente a exclusão não retorna conteúdo.
    return this.http.delete<void>(url);
  }
}