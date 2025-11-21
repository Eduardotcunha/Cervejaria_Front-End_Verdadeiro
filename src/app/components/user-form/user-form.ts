// src/app/components/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user'; // Corrigido para .service.ts
import { User } from '../../models/user';
import { CommonModule } from '@angular/common'; 
import { cpfValidator } from '../../validators/custom-validators'; 
// **IMPORTS ESSENCIAIS PARA EDIÇÃO/ROTEAMENTO**
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; 
import { switchMap } from 'rxjs/operators'; // Para lidar com o Observable da rota
import { of, Observable } from 'rxjs'; // Para o switchMap e Observables

@Component({
  selector: 'app-user-form',
  standalone: true,
  // Adicionar RouterLink aqui para garantir que links dentro do componente funcionem
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css']
})
export class UserFormComponent implements OnInit {
  
  userForm!: FormGroup; 
  isEditMode: boolean = false; 
  roles: string[] = ['ADMIN', 'USER']; 
  userId: number | null = null; // Para armazenar o ID do usuário

  // Injetar FormBuilder, UserService e os serviços de Roteamento
  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private route: ActivatedRoute, // Para ler o ID da URL
    private router: Router // Para redirecionar após salvar
  ) { }

  ngOnInit(): void {
    this.initForm();
    // CHAMAR O NOVO MÉTODO DE CARREGAMENTO
    this.checkEditModeAndLoadData(); 
  }

  /**
   * Verifica a rota para o ID do usuário e carrega os dados para edição.
   */
  checkEditModeAndLoadData(): void {
    // Usa switchMap para lidar com a mudança de parâmetros da URL (se necessário)
    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        
        if (idParam) {
          this.isEditMode = true;
          this.userId = +idParam; // Converte string para number
          
          // No modo edição, a senha não é obrigatória se não for alterada
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
          
          // Chama o serviço HTTP para buscar o usuário
          return this.userService.getUserById(this.userId);
        } else {
          this.isEditMode = false;
          return of(null); // Retorna Observable nulo para modo de cadastro
        }
      })
    ).subscribe(user => {
      if (user) {
        // Preenche o formulário com os dados do usuário buscados
        this.userForm.patchValue(user);
        
        // O CPF não está no backend, mas mantemos o valor do frontend se houver
        // Se você não quer que o CPF venha do backend, esta linha é suficiente:
        // this.userForm.patchValue(user); 
      }
    });
  }


  /**
   * Inicializa o FormGroup para o usuário.
   */
  initForm(): void {
    // ... (initForm permanece igual)
    this.userForm = this.fb.group({
      id: [null], 
      username: ['', Validators.required], 
      password: ['', [Validators.required, Validators.minLength(6)]], 
      role: ['USER', Validators.required],
      cpf: ['', [Validators.required, cpfValidator()]]
    });
  }

  /**
   * Lógica de submissão do formulário.
   */
  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: User = this.userForm.value;
      
      let saveObservable: Observable<User>;

      if (this.isEditMode) {
        console.log('Atualizando Usuário:', userData.username);
        // CHAMADA PUT REAL
        saveObservable = this.userService.updateUser(userData);
      } else {
        console.log('Cadastrando Novo Usuário:', userData.username);
        // CHAMADA POST REAL
        saveObservable = this.userService.createUser(userData);
      }
      
      // Executa a chamada e lida com a resposta
      saveObservable.subscribe({
        next: () => {
          console.log(`Usuário ${this.isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
          this.router.navigate(['/users']); // Redireciona para a lista
        },
        error: (err) => {
          console.error('Erro ao salvar usuário:', err);
          // TODO: Melhorar o feedback de erro para o usuário
        }
      });
    } else {
      this.userForm.markAllAsTouched();
      console.error('Formulário de Usuário Inválido!');
    }
  }
}