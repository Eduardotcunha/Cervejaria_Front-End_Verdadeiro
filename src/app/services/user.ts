// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Dados mockados (simulação do backend)
  private mockUsers: User[] = [
    { id: 101, username: 'admin_user', role: 'ADMIN' },
    { id: 102, username: 'joao_cliente', role: 'USER' },
    { id: 103, username: 'maria_degustadora', role: 'USER' },
  ];

  constructor() { }

  /**
   * Obtém todos os usuários (simula uma chamada HTTP GET).
   * **Atenção:** Nunca retornar a senha em um sistema real!
   * @returns Observable<User[]>
   */
  getUsers(): Observable<User[]> {
    // Na vida real: return this.http.get<User[]>('/api/users');
    return of(this.mockUsers);
  }

  // **TODO:** Adicionar métodos como getUserById, createUser, etc.
}