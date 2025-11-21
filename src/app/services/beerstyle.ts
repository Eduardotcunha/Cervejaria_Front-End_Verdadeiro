// src/app/services/beer-style.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Defina a interface BeerStyle (se ainda não existir)
interface BeerStyle {
  id: number | null;
  name: string;
  description?: string; // Tornar opcional, dependendo do Backend
}

@Injectable({
  providedIn: 'root',
})
export class BeerStyleService {
  private apiUrl = 'http://localhost:8080/beerstyles'; // Ajuste a porta se necessário

  constructor(private http: HttpClient) {}

  // Método para criar um novo BeerStyle
  createBeerStyle(style: BeerStyle): Observable<BeerStyle> {
    // Envia o nome e descrição, mas o ID será ignorado (o Backend gera)
    return this.http.post<BeerStyle>(this.apiUrl, style); 
  }

  // Método para listar todos (opcional, mas bom para um futuro dropdown)
  getAllBeerStyles(): Observable<BeerStyle[]> {
    return this.http.get<BeerStyle[]>(this.apiUrl);
  }
}