import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.html', // Assumindo que o template é login.html
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.loginError = null;
    
    if (this.loginForm.invalid) {
      this.loginError = 'Por favor, preencha todos os campos.';
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    // Tenta logar usando o AuthService
    this.authService.login(username, password).subscribe({
      next: (user) => {
        console.log(`Login bem-sucedido para ${user.username}. Redirecionando...`);
        
        // ✅ Redirecionar para a rota de lista de produtos.
        // Como o AuthService salva o estado no localStorage, não precisamos de window.location.reload().
        this.router.navigate(['/products']);
      },
      error: (err) => {
        // Exibe o erro de login se a exceção for lançada no AuthService
        this.loginError = 'Nome de usuário ou senha incorretos.';
        console.error('Erro de Login:', err);
      }
    });
  }
}