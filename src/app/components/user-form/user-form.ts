// src/app/components/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-user-form',
  // Se for standalone, adicione os imports necessários aqui:
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  // -----------------------------------------------------------
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css']
})
export class UserFormComponent implements OnInit {
  
  userForm!: FormGroup; 
  isEditMode: boolean = false; 
  // Tipos de roles disponíveis para o dropdown
  roles: string[] = ['ADMIN', 'USER']; 

  // Injetar o FormBuilder e o UserService
  constructor(
    private fb: FormBuilder, 
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initForm();
    // TODO: Adicionar lógica para carregar o usuário no modo edição
  }

  /**
   * Inicializa o FormGroup para o usuário.
   */
  initForm(): void {
    this.userForm = this.fb.group({
      id: [null], 
      
      // Validações: username obrigatório
      username: ['', Validators.required], 
      
      // Validações: password obrigatória e com comprimento mínimo
      // Atenção: A senha só é obrigatória no cadastro (não na edição se não for alterada)
      password: ['', [Validators.required, Validators.minLength(6)]], 
      
      // Role é obrigatório e deve ser um dos valores definidos
      role: ['USER', Validators.required] 
    });
  }

  /**
   * Lógica de submissão do formulário.
   */
  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: User = this.userForm.value;

      if (this.isEditMode) {
        console.log('Atualizando Usuário:', userData.username);
        // TODO: Chamar userService.updateUser(userData);
      } else {
        console.log('Cadastrando Novo Usuário:', userData.username);
        // TODO: Chamar userService.createUser(userData);
      }
      
      this.userForm.reset({ role: 'USER' }); // Resetar e manter o role padrão
    } else {
      this.userForm.markAllAsTouched();
      console.error('Formulário de Usuário Inválido!');
    }
  }
}