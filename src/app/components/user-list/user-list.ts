// src/app/components/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user';
import { CommonModule } from '@angular/common'; // <-- ADICIONAR ESTA IMPORTAÇÃO

@Component({
  selector: 'app-user-list',
  standalone: true, // <-- Assumindo que você está usando standalone
  // *** ADICIONE O COMMONMODULE AQUI ***
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) { } // Injeção de dependência

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers()
      .subscribe(
        (data: User[]) => {
          this.users = data;
          console.log('Usuários carregados:', this.users);
        },
        (error) => {
          console.error('Erro ao carregar usuários:', error);
        }
      );
  }
}