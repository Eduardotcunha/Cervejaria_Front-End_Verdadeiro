import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user'; 
import { AuthService } from '../../services/auth'; 
import { User } from '../../models/user';
import { CommonModule } from '@angular/common'; 
import { cpfValidator } from '../../validators/custom-validators'; 
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; 
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs'; 

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css']
})
export class UserFormComponent implements OnInit {
  
  userForm!: FormGroup; 
  isEditMode: boolean = false; 
  roles: string[] = ['ADMIN', 'USER']; 
  userId: number | null = null;
  
  isCurrentUser: boolean = false;
  isAdminUser: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private authService: AuthService, 
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    // Verifica se o usuário logado é ADMIN
    this.isAdminUser = this.authService.isAdmin(); 
    this.checkEditModeAndLoadData(); 
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: [null], 
      username: ['', Validators.required], 
      // A senha só será validada no modo Cadastro
      password: ['', [Validators.required, Validators.minLength(6)]], 
      role: ['USER', Validators.required],
      cpf: ['', [Validators.required, cpfValidator()]]
    });
  }

  checkEditModeAndLoadData(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        
        if (idParam) {
          this.isEditMode = true;
          this.userId = +idParam;
          
          // 1. Verifica se o usuário logado está editando a si mesmo
          this.isCurrentUser = this.userId === this.authService.getCurrentUserId(); 

          // 2. No modo edição, a senha não é obrigatória
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
          
          // 3. Aplica restrições (desabilita campos se necessário)
          this.applyEditRestrictions();
          
          return this.userService.getUserById(this.userId);
        } else {
          this.isEditMode = false;
          return of(null);
        }
      })
    ).subscribe(user => {
      if (user) {
        // Preenche o formulário com os dados do usuário buscados
        this.userForm.patchValue(user);
        
        // Se a senha não é para ser editada (próprio usuário ou modo edição), limpamos o valor.
        if (this.isCurrentUser || this.isEditMode) {
             this.userForm.get('password')?.setValue('');
        }
      }
    });
  }
  
  /**
   * Aplica as regras de negócio para edição de campos
   * Desabilita campos no formulário para torná-los 'somente leitura'.
   */
  private applyEditRestrictions(): void {
    // 1. Restrição do Username (Nunca pode ser editado em modo de edição)
    if (this.isEditMode) {
      this.userForm.get('username')?.disable();
    }
    
    // 2. Restrição de Role (Somente ADMIN pode mudar o role de outro)
    if (this.isCurrentUser || !this.isAdminUser) {
      // Se for o próprio usuário OU se o usuário logado NÃO é ADMIN
      this.userForm.get('role')?.disable();
    }
  }


  onSubmit(): void {
    
    // Verifica a validade para o modo de cadastro (onde a senha é obrigatória)
    if (!this.isEditMode && this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      console.error('Formulário de Cadastro Inválido!');
      return;
    }

    // 🛑 IMPORTANTE: Reabilitar campos desabilitados (username e role) antes de pegar o valor!
    if (this.isEditMode) {
        // Reabilitar antes de pegar o .value
        this.userForm.get('username')?.enable();
        this.userForm.get('role')?.enable();
    }
    
    // -----------------------------------------------------------

    // Pega o valor (agora incluindo os campos reabilitados)
    const userData: User = this.userForm.value;
    let saveObservable: Observable<User>;

    // Lógica para garantir que o ID seja enviado corretamente na edição
    if (this.userId && this.isEditMode) {
        userData.id = this.userId;
    }
    
    // Lógica para não enviar senha vazia (PUT)
    if (this.isEditMode && (!userData.password || userData.password === '')) {
        // Remove a propriedade 'password' do payload para não sobrescrever a senha existente
        delete userData.password; 
    }

    if (this.isEditMode) {
      console.log('Atualizando Usuário:', userData.username);
      saveObservable = this.userService.updateUser(userData);
    } else {
      console.log('Cadastrando Novo Usuário:', userData.username);
      saveObservable = this.userService.createUser(userData);
    }
    
    // Executa a chamada e lida com a resposta
    saveObservable.subscribe({
      next: () => {
        console.log(`Usuário ${this.isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
        // Redireciona
        this.router.navigate(['/users']); 
      },
      error: (err) => {
        console.error('Erro ao salvar usuário:', err);
        alert(`Falha ao salvar usuário. Erro: ${err.status}`);
      },
      // Finaliza o bloco de subscrição
      complete: () => {
         // 🛑 Após a chamada (sucesso ou erro), re-aplicar as restrições de edição
         if (this.isEditMode) {
            this.applyEditRestrictions();
         }
      }
    });
  }
}