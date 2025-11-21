// src/app/components/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user'; 
import { CommonModule } from '@angular/common'; 
import { RouterLink, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators'; // <-- Importar o filter

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule ,RouterLink],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  // Injeção de dependência (UserService e Router)
  constructor(private userService: UserService, private router: Router ) { } 

  ngOnInit(): void {
    // 1. CARGA INICIAL
    this.loadUsers();
    
    // 2. CORREÇÃO: Lógica para recarregar a lista ao navegar
    // Isso resolve o problema de precisar dar Ctrl+R
    this.router.events.pipe(
      // Filtra apenas eventos de conclusão de navegação
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Recarrega se a URL for a lista de usuários
      if (event.urlAfterRedirects === '/users') {
        this.loadUsers(); 
      }
    });
  }
  
  /**
   * Busca a lista de usuários no Backend.
   */
  loadUsers(): void {
    this.userService.getUsers()
      .subscribe({
        next: (data: User[]) => {
          this.users = data;
          console.log('Usuários carregados:', this.users);
        },
        error: (error) => {
          console.error('Erro ao carregar usuários:', error);
          // O array permanece vazio, exibindo "Carregando..." ou mensagem de erro
        }
      });
  } 

  /**
   * Implementação da Deleção: Chama o DELETE no serviço e remove da lista local.
   */
  deleteUser(id: number | undefined): void {
    if (!id) {
        console.error('ID do usuário não fornecido.');
        return;
    }

    if (confirm(`Tem certeza que deseja excluir o usuário #${id}?`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          console.log(`Usuário #${id} excluído com sucesso.`);
          // Remove o usuário da lista local para atualização imediata da interface
          this.users = this.users.filter(u => u.id !== id); 
        },
        error: (err) => {
          console.error(`Erro ao excluir usuário #${id}:`, err);
          alert('Erro ao excluir usuário. Verifique o console.');
        }
      });
    }
  }
}