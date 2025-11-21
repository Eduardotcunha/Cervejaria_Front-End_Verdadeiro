// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
// 1. Importar o HttpClient
import { HttpClient } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  // 2. Ajuste a URL base da sua API de Usuários (Exemplo)
  private apiUrl = 'http://localhost:8080/user'; 

  // 3. Injetar o HttpClient no construtor
  constructor(private http: HttpClient) { } 

  // =======================================================
  // READ: Obter todos os Usuários (GET /api/users)
  // =======================================================
  getUsers(): Observable<User[]> {
    console.log('Buscando todos os usuários em:', this.apiUrl);
    // Substitui os mockados pela chamada HTTP real
    return this.http.get<User[]>(this.apiUrl);
  }

  // =======================================================
  // READ: Obter Usuário por ID (GET /api/users/{id})
  // =======================================================
  getUserById(id: number): Observable<User> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Buscando usuário específico em:', url);
    return this.http.get<User>(url);
  }

  // =======================================================
  // CREATE: Cadastrar Novo Usuário (POST /api/users)
  // =======================================================
  createUser(user: User): Observable<User> {
    // Atenção: O CPF não deve ser enviado se o backend não o espera.
    // Se o backend espera um objeto User sem CPF, você deve mapear os dados aqui.
    const userPayload = {
      username: user.username,
      password: user.password,
      role: user.role
      // CPF É IGNORADO AQUI
    };
    console.log('Enviando novo usuário (sem CPF) para:', this.apiUrl);
    return this.http.post<User>(this.apiUrl, userPayload as User);
  }

  // =======================================================
  // UPDATE: Atualizar Usuário Existente (PUT /api/users/{id})
  // =======================================================
  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/${user.id}`;
    const userPayload = {
      id: user.id,
      username: user.username,
      // A senha deve ser enviada apenas se tiver sido alterada!
      password: user.password, 
      role: user.role
      // CPF É IGNORADO AQUI
    };
    console.log('Atualizando usuário em:', url);
    return this.http.put<User>(url, userPayload as User);
  }

  // =======================================================
  // DELETE: Excluir Usuário (DELETE /api/users/{id})
  // =======================================================
  deleteUser(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Deletando usuário em:', url);
    return this.http.delete<void>(url);
  }
}