// src/app/models/user.ts
export interface User {
  id: number;
  username: string;
  password?: string; // Opcional, geralmente não é retornado pelo backend
  role: 'ADMIN' | 'USER' | 'GUEST'; // Exemplo de tipos de role
}