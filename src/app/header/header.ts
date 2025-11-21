import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common'; // Necessário para *ngIf

@Component({
  selector: 'app-header',
  standalone: true, // Adicionado standalone: true
  imports: [RouterLink, CommonModule], // Incluir CommonModule para *ngIf
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  
  // O Angular precisa da injeção no construtor para usar os serviços
  constructor(public authService: AuthService, private router: Router) { } 
  // Tornamos o authService público para que possamos usá-lo no template HTML (this.authService.isAdmin(), etc.)

  onLogout(): void {
    this.authService.logout();
    
    // Após o logout, redireciona o usuário para a página de login
    this.router.navigate(['/login']);
  }

  // Funções auxiliares para uso no template
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }
}