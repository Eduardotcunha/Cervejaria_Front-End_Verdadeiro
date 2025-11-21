import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; 
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from './user'; 
import { User } from '../models/user'; 

const USER_SESSION_KEY = 'currentUser'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: User | null = null;
  private currentUserId: number | null = null;
  private currentUserRole: string | null = null;
  
  constructor(
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) { 
    if (isPlatformBrowser(this.platformId)) {
      this.loadSession();
    }
  }
  
  private loadSession(): void {
    const userJson = localStorage.getItem(USER_SESSION_KEY);
    if (userJson) {
      try {
        const user: User = JSON.parse(userJson);
        this.setSession(user);
      } catch (e) {
        console.error('Erro ao parsear sessão do localStorage:', e);
        this.clearSession();
      }
    }
  }

  private setSession(user: User): void {
    this.currentUser = user;
    this.currentUserId = user.id;
    this.currentUserRole = user.role;
    
    if (isPlatformBrowser(this.platformId)) {
      const userToStore = { ...user };
      delete userToStore.password; 
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userToStore));
    }
    console.log(`✅ Sessão estabelecida para ${user.username}, Role: ${user.role}`);
  }

  private clearSession(): void {
    this.currentUser = null;
    this.currentUserId = null;
    this.currentUserRole = null;
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(USER_SESSION_KEY);
    }
    console.log('Sessão limpa.');
  }

  // ==========================================================
  // MÉTODO LOGIN: CORRIGIDO O ERRO DE TIPAGEM 'Observable<void>'
  // ==========================================================
  login(username: string, password: string): Observable<User> {
    
    return this.userService.getUsers().pipe(
        map(users => {
            
            const cleanUsername = username.trim(); 
            const cleanPassword = password.trim(); 

            const userFound = users.find(u => 
                u.username.trim() === cleanUsername
            );
            
            // Verifica se encontrou o usuário E se a senha confere
            if (userFound && userFound.password && userFound.password.trim() === cleanPassword) { 
                this.setSession(userFound); 
                return userFound; // ✅ Rota de sucesso: Retorna User
            }
            
            // 🛑 Rota de falha: Lança um erro para que o 'catchError' abaixo pegue
            throw new Error('Credenciais inválidas ou senha incorreta.');
        }),
        catchError(error => {
            console.error('Erro no login:', error.message);
            // Retorna um Observable de erro, mantendo o fluxo do Observable.
            return throwError(() => new Error('Falha no login.')); 
        })
    );
}

  logout(): void {
    this.clearSession();
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUserRole?.toUpperCase() === 'ADMIN'; 
  }

  getCurrentUserId(): number | null {
    return this.currentUserId;
  }
  
  getCurrentUserRole(): string | null {
      return this.currentUserRole;
  }
}